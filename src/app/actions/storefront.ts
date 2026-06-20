"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Product } from "@/lib/types";

const DEFAULT_STORE_TENANT_ID = "00000000-0000-0000-0000-000000000001";

type CustomerPayload = {
  fullName: string;
  phone: string;
  province: string;
  city?: string;
  address: string;
  notes?: string;
};

type OrderItemPayload = {
  product: Product;
  quantity: number;
};

function tenantId() {
  return process.env.STORE_TENANT_ID || DEFAULT_STORE_TENANT_ID;
}

export async function listPublicProductsAction(limit?: number) {
  try {
    const supabase = await createClient();
    const baseSelect = "*";
    let query = supabase
      .from("products")
      .select(baseSelect)
      .eq("tenant_id", tenantId())
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, products: data || [] };
  } catch (error: any) {
    return { success: false, products: [], error: error.message || "Impossible de charger les produits." };
  }
}

export async function getPublicProductAction(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("tenant_id", tenantId())
      .eq("is_active", true)
      .eq("id", id)
      .single();

    if (error) throw error;
    return { success: true, product: data };
  } catch (error: any) {
    return { success: false, product: null, error: error.message || "Produit introuvable." };
  }
}

export async function submitStoreOrderAction(customer: CustomerPayload, items: OrderItemPayload[]) {
  try {
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      return { success: false, error: "Nom, telephone et adresse sont obligatoires." };
    }
    if (items.length === 0) {
      return { success: false, error: "Panier vide." };
    }

    const supabase = createAdminClient();
    const activeTenantId = tenantId();

    // Verify stock on the server
    for (const item of items) {
      const { data: dbProduct, error: prodError } = await supabase
        .from("products")
        .select("current_quantity, name")
        .eq("id", item.product.id)
        .eq("tenant_id", activeTenantId)
        .single();
      
      if (prodError || !dbProduct) {
        return { success: false, error: `Produit introuvable: ${item.product.name}` };
      }
      
      if (dbProduct.current_quantity < item.quantity) {
        return { success: false, error: `Stock insuffisant pour ${dbProduct.name} (Reste: ${dbProduct.current_quantity})` };
      }
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.product.selling_price || 0) * Number(item.quantity || 1),
      0
    );

    const { data: createdCustomer, error: customerError } = await supabase
      .from("customers")
      .upsert(
        {
          tenant_id: activeTenantId,
          full_name: customer.fullName.trim(),
          phone: customer.phone.trim(),
          province: customer.province,
          city: customer.city?.trim() || null,
          address: customer.address.trim(),
        },
        { onConflict: "tenant_id,phone" }
      )
      .select("id")
      .single();

    if (customerError) throw customerError;

    const orderNumber = `STORE-${Date.now()}`;
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        tenant_id: activeTenantId,
        order_number: orderNumber,
        customer_id: createdCustomer!.id,
        status: "pending",
        province: customer.province,
        city: customer.city?.trim() || null,
        address: customer.address.trim(),
        customer_note: customer.notes?.trim() || null,
      })
      .select("id")
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item) => ({
      tenant_id: activeTenantId,
      order_id: order!.id,
      product_id: item.product.id,
      quantity: Math.max(1, Number(item.quantity || 1)),
      unit_price: Number(item.product.selling_price || 0),
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    for (const item of items) {
      // Re-fetch since we need the exact quantity just in case it changed in the last millisecond
      const { data: dbProduct } = await supabase
        .from("products")
        .select("current_quantity")
        .eq("id", item.product.id)
        .eq("tenant_id", activeTenantId)
        .single();

      const currentDbQty = dbProduct?.current_quantity || 0;
      const newQty = Math.max(0, currentDbQty - Number(item.quantity || 1));
      
      await supabase
        .from("products")
        .update({ current_quantity: newQty })
        .eq("id", item.product.id)
        .eq("tenant_id", activeTenantId); // Always scope to tenant
    }

    await supabase.from("order_financials").insert({
      order_id: order!.id,
      tenant_id: activeTenantId,
      subtotal: total,
      cod_amount: total,
      discount_amount: 0,
      charged_shipping_amount: 0,
      real_shipping_cost: 0,
      cogs_amount: items.reduce(
        (sum, item) => sum + Number((item.product as any).last_purchase_cost || 0) * Number(item.quantity || 1),
        0
      ),
      return_shipping_loss: 0,
      packaging_cost: 0,
      ad_spend_attributed: 0,
    });

    try {
      const { syncToGoogleSheets } = await import("@/lib/google-sheets");
      await syncToGoogleSheets("create", {
        id: orderNumber,
        customer: customer.fullName,
        phone: customer.phone,
        province: customer.province,
        city: customer.city || "",
        address: customer.address,
        product: items.map(i => `${i.quantity}x ${i.product.name}`).join(", "),
        amount: total,
        status: "pending",
        date: new Date().toISOString().slice(0, 10),
        source: "Store"
      });
    } catch (e) {
      console.error("Sheet sync failed", e);
    }

    return { success: true, orderNumber };
  } catch (error: any) {
    return { success: false, error: error.message || "Impossible de confirmer la commande." };
  }
}

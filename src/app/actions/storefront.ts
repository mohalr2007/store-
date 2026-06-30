"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Product, ProductVariant } from "@/lib/types";

const DEFAULT_STORE_TENANT_ID = "00000000-0000-0000-0000-000000000001";

type CustomerPayload = {
  fullName: string;
  phone: string;
  province: string;
  city?: string;
  address: string;
  notes?: string;
  delivery_mode?: string;
};

type OrderItemPayload = {
  product: Product;
  quantity: number;
  variant?: ProductVariant | null;
};

function tenantId() {
  return process.env.STORE_TENANT_ID || DEFAULT_STORE_TENANT_ID;
}

function describeItem(item: OrderItemPayload) {
  if (!item.variant?.value) return `${item.quantity}x ${item.product.name}`;
  return `${item.quantity}x ${item.product.name} (${item.variant.attribute}: ${item.variant.value})`;
}

export async function listPublicProductsAction(limit?: number) {
  try {
    const supabase = createAdminClient();
    let query = supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("tenant_id", tenantId())
      .eq("is_active", true)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw error;

    const products = (data || []).map((p: any) => ({
      ...p,
      variants: (p.product_variants || [])
        .filter((v: any) => !v.deleted_at)
        .sort((a: any, b: any) => a.sort_order - b.sort_order),
    }));

    return { success: true, products };
  } catch (error: any) {
    return { success: false, products: [], error: error.message || "Impossible de charger les produits." };
  }
}

export async function getPublicProductAction(id: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, product_variants(*)")
      .eq("tenant_id", tenantId())
      .eq("is_active", true)
      .is("deleted_at", null)
      .eq("id", id)
      .single();

    if (error) throw error;
    
    const variants = (data.product_variants || [])
      .filter((v: any) => !v.deleted_at)
      .sort((a: any, b: any) => a.sort_order - b.sort_order);

    const productWithVariants = {
      ...data,
      variants,
    };

    return { success: true, product: productWithVariants };
  } catch (error: any) {
    return { success: false, product: null, error: error.message || "Produit introuvable." };
  }
}

export async function getStoreShippingRatesAction() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("store_shipping_rates")
      .select("province, home_price, desk_price, is_active")
      .eq("tenant_id", tenantId())
      .eq("is_active", true)
      .order("province");

    if (error) {
      console.error("Supabase Error getting shipping rates:", error);
      return { success: false, rates: [], error: error.message };
    }

    return { success: true, rates: data || [] };
  } catch (error: any) {
    return { success: false, rates: [], error: error.message || "Impossible de charger les tarifs." };
  }
}

export async function submitStoreOrderAction(customer: CustomerPayload, items: OrderItemPayload[], shippingCost: number = 0) {
  try {
    if (!customer.fullName.trim() || !customer.phone.trim() || !customer.address.trim()) {
      return { success: false, error: "الاسم ورقم الهاتف والعنوان حقول إلزامية." };
    }
    if (items.length === 0) {
      return { success: false, error: "السلة فارغة." };
    }

    const supabase = createAdminClient();
    const activeTenantId = tenantId();

    // Verify stock on the server, including the selected variant when present.
    for (const item of items) {
      const { data: dbProduct, error: prodError } = await supabase
        .from("products")
        .select("current_quantity, name")
        .eq("id", item.product.id)
        .eq("tenant_id", activeTenantId)
        .single();
      
      if (prodError || !dbProduct) {
        return { success: false, error: `المنتج غير موجود: ${item.product.name}` };
      }

      if (item.variant?.id) {
        const { data: dbVariant, error: variantError } = await supabase
          .from("product_variants")
          .select("id, product_id, quantity, value, attribute")
          .eq("id", item.variant.id)
          .eq("tenant_id", activeTenantId)
          .eq("product_id", item.product.id)
          .is("deleted_at", null)
          .single();

        if (variantError || !dbVariant) {
          return { success: false, error: `النسخة غير موجودة للمنتج ${dbProduct.name}.` };
        }

        if (Number(dbVariant.quantity || 0) < item.quantity) {
          return {
            success: false,
            error: `المخزون غير كافٍ للمنتج ${dbProduct.name} (${dbVariant.value}). المتبقي: ${dbVariant.quantity}`,
          };
        }

        continue;
      }
      
      if (dbProduct.current_quantity < item.quantity) {
        return { success: false, error: `المخزون غير كافٍ للمنتج ${dbProduct.name} (المتبقي: ${dbProduct.current_quantity})` };
      }
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.product.selling_price || 0) * Number(item.quantity || 1),
      0
    );
    const payableTotal = total + Number(shippingCost || 0);
    const itemSummary = items.map(describeItem).join(", ");
    const orderNotes = [customer.notes?.trim(), itemSummary ? `Articles: ${itemSummary}` : ""]
      .filter(Boolean)
      .join("\n");

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
    const orderPayload = {
      tenant_id: activeTenantId,
      order_number: orderNumber,
      customer_id: createdCustomer!.id,
      status: "pending",
      total_amount: payableTotal,
      province: customer.province,
      city: customer.city?.trim() || null,
      address: customer.address.trim(),
      delivery_mode: customer.delivery_mode || "home",
      created_by: null,
    };

    let { data: order, error: orderError } = await insertOrderWithFallback(supabase, {
      ...orderPayload,
      shipping_cost: shippingCost,
      notes: orderNotes || null,
    });

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
      if (item.variant?.id) {
        const { data: dbVariant, error: variantFetchError } = await supabase
          .from("product_variants")
          .select("quantity")
          .eq("id", item.variant.id)
          .eq("tenant_id", activeTenantId)
          .eq("product_id", item.product.id)
          .single();

        if (variantFetchError || !dbVariant) throw variantFetchError;

        const currentVariantQty = Number(dbVariant.quantity || 0);
        const nextVariantQty = Math.max(0, currentVariantQty - Number(item.quantity || 1));

        const { error: variantUpdateError } = await supabase
          .from("product_variants")
          .update({ quantity: nextVariantQty })
          .eq("id", item.variant.id)
          .eq("tenant_id", activeTenantId)
          .eq("product_id", item.product.id);

        if (variantUpdateError) throw variantUpdateError;
        continue;
      }

      // Re-fetch since we need the exact quantity just in case it changed in the last millisecond.
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
    return { success: false, error: error.message || "تعذر تأكيد الطلب." };
  }
}

async function insertOrderWithFallback(supabase: ReturnType<typeof createAdminClient>, payload: Record<string, any>) {
  const mutablePayload = { ...payload };
  let lastError: any = null;
  const removableColumns = ["notes", "shipping_cost", "delivery_mode", "total_amount"];

  for (let attempt = 0; attempt < removableColumns.length + 1; attempt++) {
    const result = await supabase.from("orders").insert(mutablePayload).select("id").single();
    if (!result.error) return result;

    lastError = result.error;
    const message = String(result.error.message || "");
    const missingColumn = removableColumns.find((column) => {
      return column in mutablePayload && new RegExp(`\\b${column}\\b`, "i").test(message);
    });

    if (!missingColumn) break;
    delete mutablePayload[missingColumn];
  }

  return { data: null, error: lastError };
}

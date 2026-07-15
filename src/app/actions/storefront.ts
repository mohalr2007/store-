"use server";

import { PrismaClient } from "@prisma/client";
import type { Product, ProductVariant } from "@/lib/types";

const prisma = new PrismaClient();

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
    const products = await prisma.products.findMany({
      where: {
        tenant_id: tenantId(),
        is_active: true,
        deleted_at: null,
      },
      orderBy: { created_at: "desc" },
      take: limit,
      include: {
        product_variants: {
          where: { deleted_at: null },
          orderBy: { sort_order: "asc" },
        },
      },
    });

    return {
      success: true,
      products: products.map((p: any) => ({
        ...p,
        variants: p.product_variants,
      })),
    };
  } catch (error: any) {
    return { success: false, products: [] as any[], error: error.message || "Impossible de charger les produits." };
  }
}

export async function getPublicProductAction(id: string) {
  try {
    const product = await prisma.products.findFirst({
      where: {
        id,
        tenant_id: tenantId(),
        is_active: true,
        deleted_at: null,
      },
      include: {
        product_variants: {
          where: { deleted_at: null },
          orderBy: { sort_order: "asc" },
        },
      },
    });

    if (!product) throw new Error("Produit introuvable.");

    return {
      success: true,
      product: {
        ...product,
        variants: product.product_variants,
      },
    };
  } catch (error: any) {
    return { success: false, product: null as any, error: error.message || "Produit introuvable." };
  }
}

export async function getStoreShippingRatesAction() {
  try {
    const rates = await prisma.store_shipping_rates.findMany({
      where: {
        tenant_id: tenantId(),
        is_active: true,
      },
      select: {
        province: true,
        home_price: true,
        desk_price: true,
        is_active: true,
      },
      orderBy: { province: "asc" },
    });

    // Convert Prisma Decimal to number for the frontend
    const converted = rates.map((r) => ({
      province: r.province,
      home_price: Number(r.home_price ?? 0),
      desk_price: Number(r.desk_price ?? 0),
      is_active: r.is_active ?? true,
    }));

    return { success: true, rates: converted };
  } catch (error: any) {
    return { success: false, rates: [] as any[], error: error.message || "Impossible de charger les tarifs." };
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

    const activeTenantId = tenantId();

    // Verify stock
    for (const item of items) {
      const dbProduct = await prisma.products.findFirst({
        where: { id: item.product.id, tenant_id: activeTenantId },
        select: { current_quantity: true, name: true },
      });
      if (!dbProduct) return { success: false, error: `المنتج غير موجود: ${item.product.name}` };

      if (item.variant?.id) {
        const dbVariant = await prisma.product_variants.findFirst({
          where: { id: item.variant.id, tenant_id: activeTenantId, product_id: item.product.id, deleted_at: null },
          select: { id: true, quantity: true, value: true, attribute: true },
        });
        if (!dbVariant) return { success: false, error: `النسخة غير موجودة للمنتج ${dbProduct.name}.` };
      }
    }

    const total = items.reduce((sum, item) => sum + Number(item.product.selling_price || 0) * Number(item.quantity || 1), 0);
    const payableTotal = total + Number(shippingCost || 0);
    const itemSummary = items.map(describeItem).join(", ");
    const orderNotes = [customer.notes?.trim(), itemSummary ? `Articles: ${itemSummary}` : ""].filter(Boolean).join("\n");

    const orderNumber = `STORE-${Date.now()}`;

    // Transaction to ensure atomicity
    const orderResult = await prisma.$transaction(async (tx: any) => {
      let createdCustomer = await tx.customers.findFirst({
        where: { tenant_id: activeTenantId, phone: customer.phone.trim() }
      });

      if (createdCustomer) {
        createdCustomer = await tx.customers.update({
          where: { id: createdCustomer.id },
          data: {
            full_name: customer.fullName.trim(),
            province: customer.province,
            city: customer.city?.trim() || null,
            address: customer.address.trim(),
          }
        });
      } else {
        createdCustomer = await tx.customers.create({
          data: {
            tenant_id: activeTenantId,
            full_name: customer.fullName.trim(),
            phone: customer.phone.trim(),
            province: customer.province,
            city: customer.city?.trim() || null,
            address: customer.address.trim(),
          }
        });
      }

      const order = await tx.orders.create({
        data: {
          tenant_id: activeTenantId,
          order_number: orderNumber,
          customer_id: createdCustomer.id,
          status: "pending",
          total_amount: payableTotal,
          shipping_cost: shippingCost,
          province: customer.province,
          city: customer.city?.trim() || null,
          address: customer.address.trim(),
          delivery_mode: customer.delivery_mode || "home",
          customer_note: orderNotes || null,
        }
      });

      const orderItemsData = items.map((item) => ({
        tenant_id: activeTenantId,
        order_id: order.id,
        product_id: item.product.id,
        quantity: Math.max(1, Number(item.quantity || 1)),
        unit_price: Number(item.product.selling_price || 0),
      }));

      await tx.order_items.createMany({ data: orderItemsData });

      for (const item of items) {
        if (item.variant?.id) {
          const dbVariant = await tx.product_variants.findUnique({
            where: { id: item.variant.id }
          });
          if (dbVariant) {
            const nextVariantQty = Math.max(0, Number(dbVariant.quantity || 0) - Number(item.quantity || 1));
            await tx.product_variants.update({
              where: { id: item.variant.id },
              data: { quantity: nextVariantQty }
            });
          }
        }

        const dbProduct = await tx.products.findUnique({ where: { id: item.product.id } });
        if (dbProduct) {
          const newQty = Math.max(0, Number(dbProduct.current_quantity || 0) - Number(item.quantity || 1));
          await tx.products.update({
            where: { id: item.product.id },
            data: { current_quantity: newQty }
          });
        }
      }

      await tx.order_financials.create({
        data: {
          order_id: order.id,
          tenant_id: activeTenantId,
          subtotal: total,
          cod_amount: total,
          discount_amount: 0,
          charged_shipping_amount: 0,
          real_shipping_cost: 0,
          cogs_amount: items.reduce((sum, item) => sum + Number((item.product as any).last_purchase_cost || 0) * Number(item.quantity || 1), 0),
          return_shipping_loss: 0,
          packaging_cost: 0,
          ad_spend_attributed: 0,
        }
      });

      return order;
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
        product: items.map(describeItem).join(", "),
        amount: total,
        shippingCost: shippingCost,
        totalAmount: payableTotal,
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

export interface Product {
  id: string;
  tenant_id: string;
  name: string;
  sku: string | null;
  description: string | null;
  image_url?: string | null;
  image_path?: string | null;
  category: string | null;
  video_url?: string | null;
  images?: string[] | null;
  current_quantity: number | null;
  low_stock_threshold: number | null;
  selling_price: number | null;
  original_price?: number | null;
  show_discount: boolean | null;
  is_active: boolean | null;
  is_free_shipping?: boolean | null;
  last_purchase_cost?: number | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
  deleted_at?: string | Date | null;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  tenant_id: string;
  product_id: string;
  attribute: string;
  custom_name: string | null;
  value: string;
  quantity: number | null;
  sort_order: number | null;
  image_url?: string | null;
  deleted_at?: Date | null;
  created_at: string | Date | null;
  updated_at?: Date | null;
}

export interface Customer {
  id: string;
  tenant_id: string;
  full_name: string;
  phone: string;
  phone_secondary: string | null;
  province: string | null;
  city: string | null;
  address: string | null;
  total_orders: number;
  total_returns: number;
  total_spent: number;
  last_order_at: string | null;
  risk_score: number;
  risk_level: string;
  notes: string | null;
  is_blacklisted: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  tenant_id: string;
  order_number: string;
  customer_id: string;
  delivery_company_id: string | null;
  tracking_number: string | null;
  status: string;
  province: string | null;
  city: string | null;
  address: string | null;
  customer_note: string | null;
  internal_note: string | null;
  assigned_agent_id: string | null;
  confirmed_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  returned_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  tenant_id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_amount: number;
  line_total: number;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: ProductVariant;
}

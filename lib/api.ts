const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export type BackendCategory = { id: string; name: string };
export type BackendService = { id: string; name: string; category_id: string };
export type BackendTransaction = {
  id: string;
  client_id: string | null;
  service_id: string;
  is_expense: boolean;
  is_personal: boolean;
  pjpf: "pj" | "pf" | null;
  amount: number;
  description?: string | null;
  status: "pending" | "paid" | "cancelled";
  payment_method?: "pix" | "cash" | "card" | "transfer" | null;
  transaction_date: string;
  created_at: string;
};

export const api = {
  listCategories: () => request<BackendCategory[]>("/categories"),
  createCategory: (name: string) => request<BackendCategory>("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  }),
  deleteCategory: (id: string) => fetch(`${BASE_URL}/categories/${id}`, { method: "DELETE" }),

  listServices: () => request<BackendService[]>("/services"),
  createService: (name: string, category_id: string) => request<BackendService>("/services", {
    method: "POST",
    body: JSON.stringify({ name, category_id }),
  }),

  listTransactions: () => request<BackendTransaction[]>("/transactions"),
  createTransaction: (payload: {
    client_id?: string | null;
    service_id: string;
    is_expense: boolean;
    is_personal?: boolean;
    pjpf?: "pj" | "pf" | null;
    amount: number;
    description?: string | null;
    status?: "pending" | "paid" | "cancelled";
    payment_method?: "pix" | "cash" | "card" | "transfer" | null;
    transaction_date: string;
  }) => request<BackendTransaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  deleteTransaction: (id: string) => fetch(`${BASE_URL}/transactions/${id}`, { method: "DELETE" }),
};

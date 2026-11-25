/** Browser-side helper for the JSON API. All responses use { success, ... }. */
export async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: "no-store", ...init });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data as T;
}

export async function apiSend<T>(
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  return apiFetch<T>(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function uploadFile(
  file: File,
): Promise<{ id: string; url: string; filename: string }> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<{ id: string; url: string; filename: string }>("/api/media", {
    method: "POST",
    body: formData,
  });
}

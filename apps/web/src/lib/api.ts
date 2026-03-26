const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    })

    const data = await res.json()
    return data
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

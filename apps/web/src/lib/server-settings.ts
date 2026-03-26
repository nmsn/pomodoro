import { cookies } from "next/headers"

export interface ServerUserSettings {
  theme: string
  background: string
  workDuration: number
  breakDuration: number
  timerType: string
  soundEnabled: boolean
  notificationsEnabled: boolean
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function getServerUserSettings(): Promise<ServerUserSettings | null> {
  try {
    // Get session cookie
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("better-auth.session_token")

    if (!sessionCookie?.value) {
      return null
    }

    // Call backend API with session cookie
    const res = await fetch(`${API_BASE}/api/settings`, {
      credentials: "include",
      headers: {
        cookie: `better-auth.session_token=${sessionCookie.value}`,
      },
      cache: "no-store", // Don't cache, always get fresh data
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()

    if (!data.success || !data.data) {
      return null
    }

    return data.data as ServerUserSettings
  } catch (error) {
    console.error("[ServerSettings] Failed to load settings:", error)
    return null
  }
}

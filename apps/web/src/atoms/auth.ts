import { createAuthClient } from "better-auth/react"

const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001") + "/auth",
})

export const useSession = authClient.useSession

// Access signIn.social directly from the client
// The proxy converts signIn.social to a call to /sign-in/social
export const signIn = authClient.signIn

export const signOut = authClient.signOut

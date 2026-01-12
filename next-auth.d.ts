declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & import("next-auth").DefaultSession["user"]
  }

  interface User {
    id?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
  }
}

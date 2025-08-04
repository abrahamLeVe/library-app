/* eslint-disable @typescript-eslint/no-empty-object-type */

import "next-auth";
import "next-auth/jwt";

type Role = "ADMIN" | "ASISTENTE" | "CLIENT";

interface AppUser {
  id: string;
  role: Role;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

declare module "next-auth" {
  interface Session {
    user: AppUser;
  }

  interface User extends AppUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends Partial<AppUser> {}
}

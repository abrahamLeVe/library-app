export type Role = "ADMIN" | "ASISTENTE" | "CLIENT";

export interface Categoria {
  id: string;
  codigo: string;
  nombre: string;
  parent_id?: string | null;
  categoria_padre?: string | null;
}

export interface Tema {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  dni?: string | null;
  telefono?: string | null;
  direccion?: string | null;
  fecha_nacimiento?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Autor {
  id: number;
  nombre: string;
  biografia: string | null;
  created_at?: string;
}

export type AppUser = {
  id: string;
  role: Role;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

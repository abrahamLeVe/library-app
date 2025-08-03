export interface Categoria {
  id: string; // ID único de la categoría
  codigo: string; // Código de la categoría (ej: 800, 891, etc.)
  nombre: string; // Nombre de la categoría
  parent_id?: string | null; // ID de la categoría padre (null si es principal)
  categoria_padre?: string | null; // Nombre de la categoría padre (cuando se hace join)
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
}

export interface Autor {
  id: number;
  nombre: string;
  biografia: string | null;
  created_at?: string;
}

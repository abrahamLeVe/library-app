// Datos de usuarios
export const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Abraham",
    email: "leandrovegaabraham@mail.com",
    password: "Crostipapito123",
  },
];

// Categorías de la biblioteca
export const categorias = [
  { codigo: "800", nombre: "Literatura", parent_id: null },
  { codigo: "890", nombre: "Literaturas de autoayuda", parent_id: "800" },
  { codigo: "891", nombre: "Literatura peruana", parent_id: "800" },
  { codigo: "892", nombre: "Literatura Universal", parent_id: "800" },
  { codigo: "893", nombre: "Poesía y poemas", parent_id: "800" },
  { codigo: "894", nombre: "Literatura juvenil", parent_id: "800" },
  { codigo: "895", nombre: "Literatura infantil", parent_id: "800" },
];

// Libros
export const libros = [
  {
    codigo: "890,0001",
    anio: "SF",
    categoria_codigo: "890",
    autor: "Autor X",
    titulo: "Lectura lenta",
    origen: "Original",
    estado: "Nuevo",
  },
  {
    codigo: "890,0002",
    anio: "1999",
    categoria_codigo: "890",
    autor: "Autor X",
    titulo: "Lectura veloz",
    origen: "Original",
    estado: "Como nuevo",
  },
  {
    codigo: "890,0003",
    anio: "SF",
    categoria_codigo: "890",
    autor: "Autor Y",
    titulo: "Felicidad",
    origen: "Copia",
    estado: "Buen estado",
  },
  {
    codigo: "891,0004",
    anio: "2022",
    categoria_codigo: "891",
    autor: "César Vallejo",
    titulo: "Poemas Humanos",
    origen: "Copia",
    estado: "Regular",
  },
  {
    codigo: "891,0005",
    anio: "2022",
    categoria_codigo: "891",
    autor: "César Vallejo",
    titulo: "Poemas extraterrestres",
    origen: "Copia",
    estado: "Mal estado",
  },
];

// Temas adicionales
export const temas = [
  { nombre: "Lectura veloz" },
  { nombre: "Autoayuda" },
  { nombre: "Felicidad" },
  { nombre: "Poesía" },
];

// Relación libros ↔ temas
export const librosTemas = [
  { libro_codigo: "890,0001", tema_nombre: "Autoayuda" },
  { libro_codigo: "890,0002", tema_nombre: "Felicidad" },
  { libro_codigo: "890,0003", tema_nombre: "Lectura veloz" },
  { libro_codigo: "891,0004", tema_nombre: "Poesía" },
  { libro_codigo: "891,0005", tema_nombre: "Felicidad" },
];

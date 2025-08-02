// Datos de usuarios
export const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Abraham",
    email: "lizlv@gmail.com",
    password: "44436187966908047",
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

// Autores
export const autores = [
  {
    nombre: "Autor X",
    biografia:
      "Especialista en técnicas de lectura y comprensión, con múltiples publicaciones en educación.",
  },
  {
    nombre: "Autor Y",
    biografia:
      "Psicólogo y conferencista, reconocido por sus libros sobre crecimiento personal y felicidad.",
  },
  {
    nombre: "César Vallejo",
    biografia:
      "Poeta peruano considerado una de las figuras más innovadoras de la poesía universal.",
  },
  {
    nombre: "María Pérez",
    biografia:
      "Autora contemporánea de literatura juvenil e infantil, destacada por su narrativa fresca.",
  },
  {
    nombre: "Luis Gómez",
    biografia:
      "Escritor latinoamericano con enfoque en literatura universal y crítica social.",
  },
];

// Libros
export const libros = [
  {
    codigo: "890,0001",
    anio: "2005",
    categoria_codigo: "890",
    titulo: "Lectura lenta",
    origen: "Original",
    estado: "Nuevo",
  },
  {
    codigo: "890,0002",
    anio: "1999",
    categoria_codigo: "890",
    titulo: "Lectura veloz",
    origen: "Original",
    estado: "Como nuevo",
  },
  {
    codigo: "890,0003",
    anio: "2010",
    categoria_codigo: "890",
    titulo: "Felicidad",
    origen: "Copia",
    estado: "Buen estado",
  },
  {
    codigo: "891,0004",
    anio: "2022",
    categoria_codigo: "891",
    titulo: "Poemas Humanos",
    origen: "Copia",
    estado: "Regular",
  },
  {
    codigo: "891,0005",
    anio: "2023",
    categoria_codigo: "891",
    titulo: "Poemas extraterrestres",
    origen: "Copia",
    estado: "Mal estado",
  },
];

// Relación libros ↔ autores (N:M)
export const librosAutores = [
  { libro_codigo: "890,0001", autor_nombre: "Autor X" },
  { libro_codigo: "890,0002", autor_nombre: "Autor X" },
  { libro_codigo: "890,0002", autor_nombre: "Autor Y" },
  { libro_codigo: "890,0003", autor_nombre: "Autor Y" },
  { libro_codigo: "891,0004", autor_nombre: "César Vallejo" },
  { libro_codigo: "891,0005", autor_nombre: "César Vallejo" },
  { libro_codigo: "891,0005", autor_nombre: "María Pérez" },
  { libro_codigo: "890,0003", autor_nombre: "Luis Gómez" },
];

// Temas adicionales
export const temas = [
  {
    nombre: "Lectura veloz",
    descripcion:
      "Técnicas y estrategias para mejorar la velocidad y comprensión lectora.",
  },
  {
    nombre: "Autoayuda",
    descripcion:
      "Libros orientados al crecimiento personal, motivación y desarrollo emocional.",
  },
  {
    nombre: "Felicidad",
    descripcion: null, // sin descripción inicial
  },
  {
    nombre: "Poesía",
    descripcion:
      "Obras y colecciones líricas, poemas clásicos y contemporáneos.",
  },
];

// Relación libros ↔ temas
export const librosTemas = [
  { libro_codigo: "890,0001", tema_nombre: "Autoayuda" },
  { libro_codigo: "890,0002", tema_nombre: "Felicidad" },
  { libro_codigo: "890,0003", tema_nombre: "Lectura veloz" },
  { libro_codigo: "891,0004", tema_nombre: "Poesía" },
  { libro_codigo: "891,0005", tema_nombre: "Felicidad" },
];

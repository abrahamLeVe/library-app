// Datos de usuarios
export const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "Administrador",
    email: "admin@gmail.com",
    password: "Admin1234",
    role: "ADMIN",
  },
  {
    id: "510644c3-5002-4371-9855-fec4b8a6455b",
    name: "María Pérez",
    email: "asistente@gmail.com",
    password: "Asistente123",
    role: "ASISTENTE",
    dni: "87654321",
    telefono: "987444321",
    direccion: "Av. Siempre Muerta 666",
    fecha_nacimiento: "1985-05-13",
  },
  {
    id: "510644c3-5002-4371-9855-fec4b6a6455b",
    name: "Juan Pérez",
    email: "cliente@gmail.com",
    password: "Cliente123",
    role: "CLIENT",
    dni: "12345678",
    telefono: "987654321",
    direccion: "Av. Siempre Viva 742",
    fecha_nacimiento: "1995-05-12",
  },
];

export const categorias = [
  /* 000 Generalidades */
  { codigo: "000", nombre: "Generalidades", parent_id: null },
  { codigo: "010", nombre: "Bibliografía", parent_id: "000" },
  { codigo: "020", nombre: "Bibliotecnología e informática", parent_id: "000" },
  { codigo: "030", nombre: "Enciclopedias generales", parent_id: "000" },
  { codigo: "040", nombre: "Folletos", parent_id: "000" },
  { codigo: "050", nombre: "Publicaciones en serie", parent_id: "000" },
  { codigo: "060", nombre: "Organizaciones y museografía", parent_id: "000" },
  {
    codigo: "070",
    nombre: "Periodismo, editoriales, diarios",
    parent_id: "000",
  },
  { codigo: "080", nombre: "Colecciones generales", parent_id: "000" },
  { codigo: "090", nombre: "Manuscritos y libros raros", parent_id: "000" },

  /* 100 Filosofía y psicología */
  { codigo: "100", nombre: "Filosofía y psicología", parent_id: null },
  { codigo: "110", nombre: "Metafísica", parent_id: "100" },
  {
    codigo: "120",
    nombre: "Conocimiento, causa, fin, hombre",
    parent_id: "100",
  },
  { codigo: "130", nombre: "Parapsicología, ocultismo", parent_id: "100" },
  { codigo: "140", nombre: "Puntos de vista filosóficos", parent_id: "100" },
  { codigo: "150", nombre: "Psicología", parent_id: "100" },
  { codigo: "160", nombre: "Lógica", parent_id: "100" },
  { codigo: "170", nombre: "Ética (filosofía moral)", parent_id: "100" },
  { codigo: "180", nombre: "Filosofía", parent_id: "100" },

  /* 200 Religión */
  { codigo: "200", nombre: "Religión", parent_id: null },
  { codigo: "210", nombre: "Biblia", parent_id: "200" },
  { codigo: "230", nombre: "Teología cristiana", parent_id: "200" },
  { codigo: "240", nombre: "Moral y prácticas cristianas", parent_id: "200" },
  {
    codigo: "250",
    nombre: "Iglesia local y órdenes religiosas",
    parent_id: "200",
  },
  {
    codigo: "260",
    nombre: "Historia y geografía de la iglesia",
    parent_id: "200",
  },
  { codigo: "280", nombre: "Credos de la iglesia cristiana", parent_id: "200" },
  { codigo: "290", nombre: "Otras religiones", parent_id: "200" },

  /* 300 Ciencias sociales */
  { codigo: "300", nombre: "Ciencias sociales", parent_id: null },
  { codigo: "310", nombre: "Ciencia política", parent_id: "300" },
  { codigo: "320", nombre: "Economía - comercio", parent_id: "300" },
  { codigo: "330", nombre: "Derecho", parent_id: "300" },
  { codigo: "340", nombre: "Administración pública", parent_id: "300" },
  { codigo: "350", nombre: "Patología y servicio sociales", parent_id: "300" },
  { codigo: "360", nombre: "Educación", parent_id: "300" },
  { codigo: "370", nombre: "Costumbres y folklore", parent_id: "300" },

  /* 400 Lenguas */
  { codigo: "400", nombre: "Lenguas", parent_id: null },
  { codigo: "410", nombre: "Lingüística", parent_id: "400" },
  { codigo: "420", nombre: "Inglés y anglosajón", parent_id: "400" },
  { codigo: "430", nombre: "Lenguas originarias", parent_id: "400" },

  /* 500 Matemáticas y ciencias naturales */
  {
    codigo: "500",
    nombre: "Matemáticas y ciencias naturales",
    parent_id: null,
  },
  { codigo: "510", nombre: "Matemáticas", parent_id: "500" },
  { codigo: "520", nombre: "Astronomía y ciencias afines", parent_id: "500" },
  { codigo: "530", nombre: "Física", parent_id: "500" },
  { codigo: "540", nombre: "Química y ciencias afines", parent_id: "500" },
  { codigo: "550", nombre: "Geociencias", parent_id: "500" },
  { codigo: "560", nombre: "Paleontología", parent_id: "500" },
  { codigo: "570", nombre: "Ciencias biológicas", parent_id: "500" },
  { codigo: "580", nombre: "Ciencias botánicas", parent_id: "500" },
  { codigo: "590", nombre: "Ciencias zoológicas", parent_id: "500" },

  /* 600 Tecnología y ciencias aplicadas */
  { codigo: "600", nombre: "Tecnología y ciencias aplicadas", parent_id: null },
  { codigo: "610", nombre: "Ciencias médicas", parent_id: "600" },
  {
    codigo: "620",
    nombre: "Ingeniería y operaciones afines",
    parent_id: "600",
  },
  {
    codigo: "630",
    nombre: "Agricultura y tecnologías afines",
    parent_id: "600",
  },
  { codigo: "640", nombre: "Economía doméstica", parent_id: "600" },
  {
    codigo: "650",
    nombre: "Servicios administrativos empresariales",
    parent_id: "600",
  },
  { codigo: "660", nombre: "Química industrial", parent_id: "600" },
  { codigo: "670", nombre: "Manufacturas", parent_id: "600" },
  { codigo: "680", nombre: "Manufacturas varias", parent_id: "600" },
  { codigo: "690", nombre: "Construcciones", parent_id: "600" },

  /* 700 Artes */
  { codigo: "700", nombre: "Artes", parent_id: null },
  {
    codigo: "710",
    nombre: "Urbanismo y arquitectura del paisaje",
    parent_id: "700",
  },
  { codigo: "720", nombre: "Arquitectura", parent_id: "700" },
  { codigo: "730", nombre: "Artes plásticas; escultura", parent_id: "700" },
  {
    codigo: "740",
    nombre: "Dibujo, artes decorativas y menores",
    parent_id: "700",
  },
  { codigo: "750", nombre: "Pintura y pinturas", parent_id: "700" },
  { codigo: "760", nombre: "Artes gráficas; grabados", parent_id: "700" },
  { codigo: "770", nombre: "Fotografía y fotografías", parent_id: "700" },
  { codigo: "780", nombre: "Música", parent_id: "700" },
  { codigo: "790", nombre: "Entretenimiento", parent_id: "700" },

  /* 800 Literatura */
  { codigo: "800", nombre: "Literatura", parent_id: null },
  { codigo: "890", nombre: "Literaturas de autoayuda", parent_id: "800" },
  { codigo: "891", nombre: "Literatura peruana", parent_id: "800" },
  { codigo: "892", nombre: "Literatura Universal", parent_id: "800" },
  { codigo: "893", nombre: "Poesía y poemas", parent_id: "800" },
  { codigo: "894", nombre: "Literatura juvenil", parent_id: "800" },
  { codigo: "895", nombre: "Literatura infantil", parent_id: "800" },

  /* 900 Historia y geografía */
  { codigo: "900", nombre: "Historia y geografía", parent_id: null },
  { codigo: "910", nombre: "Geografía; viajes", parent_id: "900" },
  { codigo: "920", nombre: "Biografía y genealogía", parent_id: "900" },
  { codigo: "930", nombre: "Historia del mundo antiguo", parent_id: "900" },
  { codigo: "940", nombre: "Historia de Europa", parent_id: "900" },
  { codigo: "950", nombre: "Historia de Asia", parent_id: "900" },
  { codigo: "960", nombre: "Historia de África", parent_id: "900" },
  { codigo: "970", nombre: "Historia de América del Norte", parent_id: "900" },
  { codigo: "980", nombre: "Historia de América del Sur", parent_id: "900" },
  { codigo: "990", nombre: "Historia del Perú", parent_id: "900" },
];

// // Autores
// export const autores = [
//   {
//     nombre: "Autor X",
//     biografia:
//       "Especialista en técnicas de lectura y comprensión, con múltiples publicaciones en educación.",
//   },
//   {
//     nombre: "Autor Y",
//     biografia:
//       "Psicólogo y conferencista, reconocido por sus libros sobre crecimiento personal y felicidad.",
//   },
//   {
//     nombre: "César Vallejo",
//     biografia:
//       "Poeta peruano considerado una de las figuras más innovadoras de la poesía universal.",
//   },
//   {
//     nombre: "María Pérez",
//     biografia:
//       "Autora contemporánea de literatura juvenil e infantil, destacada por su narrativa fresca.",
//   },
//   {
//     nombre: "Luis Gómez",
//     biografia:
//       "Escritor latinoamericano con enfoque en literatura universal y crítica social.",
//   },
// ];
// // Temas adicionales
// export const temas = [
//   {
//     nombre: "Lectura veloz",
//     descripcion:
//       "Técnicas y estrategias para mejorar la velocidad y comprensión lectora.",
//   },
//   {
//     nombre: "Autoayuda",
//     descripcion:
//       "Libros orientados al crecimiento personal, motivación y desarrollo emocional.",
//   },
//   {
//     nombre: "Felicidad",
//     descripcion: null, // sin descripción inicial
//   },
//   {
//     nombre: "Poesía",
//     descripcion:
//       "Obras y colecciones líricas, poemas clásicos y contemporáneos.",
//   },
// ];
// // Libros
// export const libros = [
//   {
//     codigo: "890,0001",
//     anio: "2005",
//     categoria_codigo: "890",
//     titulo: "Lectura lenta",
//     origen: "Original",
//     estado: "Nuevo",
//   },
//   {
//     codigo: "890,0002",
//     anio: "1999",
//     categoria_codigo: "890",
//     titulo: "Lectura veloz",
//     origen: "Original",
//     estado: "Como nuevo",
//   },
//   {
//     codigo: "890,0003",
//     anio: "2010",
//     categoria_codigo: "890",
//     titulo: "Felicidad",
//     origen: "Copia",
//     estado: "Buen estado",
//   },
//   {
//     codigo: "891,0004",
//     anio: "2022",
//     categoria_codigo: "891",
//     titulo: "Poemas Humanos",
//     origen: "Copia",

//     estado: "Regular",
//   },
//   {
//     codigo: "891,0005",
//     anio: "2023",
//     categoria_codigo: "891",
//     titulo: "Poemas extraterrestres",
//     origen: "Copia",
//     estado: "Mal estado",
//   },
// ];

// // Relación libros ↔ autores (N:M)
// export const librosAutores = [
//   { libro_codigo: "890,0001", autor_nombre: "Autor X" },
//   { libro_codigo: "890,0002", autor_nombre: "Autor X" },
//   { libro_codigo: "890,0002", autor_nombre: "Autor Y" },
//   { libro_codigo: "890,0003", autor_nombre: "Autor Y" },
//   { libro_codigo: "891,0004", autor_nombre: "César Vallejo" },
//   { libro_codigo: "891,0005", autor_nombre: "César Vallejo" },
//   { libro_codigo: "891,0005", autor_nombre: "María Pérez" },
//   { libro_codigo: "890,0003", autor_nombre: "Luis Gómez" },
// ];

// // Relación libros ↔ temas
// export const librosTemas = [
//   { libro_codigo: "890,0001", tema_nombre: "Autoayuda" },
//   { libro_codigo: "890,0002", tema_nombre: "Felicidad" },
//   { libro_codigo: "890,0003", tema_nombre: "Lectura veloz" },
//   { libro_codigo: "891,0004", tema_nombre: "Poesía" },
//   { libro_codigo: "891,0005", tema_nombre: "Felicidad" },
// ];

// =======================
// AUTORES
// =======================
export const autores = [
  {
    nombre: "Diego Parra Duque",
    biografia: "Autor enfocado en creatividad y desarrollo personal.",
  },
  {
    nombre: "Harry Alder y Beryl Heather",
    biografia: "Autores especializados en psicología práctica y autoayuda.",
  },
  {
    nombre: "Stanley D. Frank",
    biografia: "Conferencista y escritor en técnicas de lectura veloz.",
  },
  {
    nombre: "Davis Lewis y James Greene",
    biografia: "Especialistas en autoayuda y mente humana.",
  },
  {
    nombre: "Og Mandino",
    biografia:
      "Escritor reconocido mundialmente por sus libros de motivación y autoayuda.",
  },
  {
    nombre: "Miguel Fernandez Romero y Fernando Ramirez",
    biografia: "Autores en desarrollo de habilidades comunicativas.",
  },
  {
    nombre: "Ediciones de desarrollo personal",
    biografia: "Editorial enfocada en autoestima y superación personal.",
  },
  {
    nombre: "Spencer Jhonson",
    biografia: "Famoso autor del best-seller '¿Quién se ha llevado mi queso?'.",
  },
  {
    nombre: "David Niven",
    biografia:
      "Psicólogo y escritor de obras sobre felicidad y crecimiento personal.",
  },
  {
    nombre: "Kim Woo - Choong",
    biografia: "Escritor coreano especializado en liderazgo y éxito.",
  },
  {
    nombre: "Arthur W. Kornhauser",
    biografia: "Autor de técnicas de estudio y aprendizaje.",
  },
  {
    nombre: "Francis Lefebure",
    biografia:
      "Investigador y autor de técnicas de respiración y concentración mental.",
  },
  {
    nombre: "Miguel Ángel Cornejo",
    biografia: "Conferencista y escritor de temas de motivación y liderazgo.",
  },
  {
    nombre: "Robert T. Kiyosaki y Sharon L. Lechter",
    biografia: "Autores del bestseller 'Padre Rico, Padre Pobre'.",
  },
  {
    nombre: "José Ingenieros",
    biografia: "Filósofo y médico argentino, autor de 'El hombre mediocre'.",
  },
  {
    nombre: "Editorial La esfera de los libros",
    biografia: "Editorial especializada en temas de autoayuda.",
  },
  {
    nombre: "Felix Franco editores y libreros",
    biografia: "Editorial enfocada en literatura de reflexión y pensamientos.",
  },
  {
    nombre: "Erich Fromm",
    biografia:
      "Psicoanalista y filósofo humanista alemán, autor de 'El arte de amar'.",
  },
  {
    nombre: "Alvin Toffler",
    biografia:
      "Escritor y futurista estadounidense, autor de 'El shock del futuro'.",
  },
  {
    nombre: "Wayne W. Dyer",
    biografia: "Psicólogo y autor de autoayuda, reconocido a nivel mundial.",
  },
  {
    nombre: "Mark A. Finley",
    biografia: "Escritor de temas espirituales y de esperanza.",
  },
  {
    nombre: "Daila Lama",
    biografia: "Líder espiritual tibetano, autor de textos de reflexión.",
  },
  {
    nombre: "Orlando M. Almeyda Sáenz",
    biografia: "Autor de reflexiones para el bienestar del alma.",
  },
  {
    nombre: "Macv Chávez",
    biografia: "Autor contemporáneo en temas de autoayuda y meditación.",
  },
  {
    nombre: "David Fischman",
    biografia: "Escritor peruano especializado en liderazgo y motivación.",
  },
];

// =======================
// TEMAS
// =======================
export const temas = [
  {
    nombre: "Desarrollo de la creatividad",
    descripcion: "Libros orientados a estimular la creatividad personal.",
  },
  {
    nombre: "Psicología y autoayuda",
    descripcion: "Obras enfocadas en el crecimiento emocional y psicológico.",
  },
  {
    nombre: "Lectura veloz",
    descripcion: "Técnicas para mejorar la velocidad y comprensión de lectura.",
  },
  {
    nombre: "Autoayuda",
    descripcion: "Textos de motivación y desarrollo personal.",
  },
  {
    nombre: "Autoestima",
    descripcion: "Obras para el fortalecimiento de la confianza y seguridad.",
  },
  {
    nombre: "Adaptarse",
    descripcion: "Textos sobre resiliencia y adaptación al cambio.",
  },
  {
    nombre: "Felicidad",
    descripcion: "Libros para alcanzar y mantener la felicidad.",
  },
  {
    nombre: "Éxito",
    descripcion:
      "Guías y reflexiones para alcanzar el éxito personal y profesional.",
  },
  {
    nombre: "Consejos para estudiar",
    descripcion: "Métodos prácticos de estudio y aprendizaje.",
  },
  {
    nombre: "Respiración",
    descripcion: "Técnicas para la concentración y el bienestar.",
  },
  {
    nombre: "Consejos",
    descripcion: "Recomendaciones generales para el crecimiento personal.",
  },
  {
    nombre: "Superación",
    descripcion: "Obras para el desarrollo personal y la autosuperación.",
  },
  {
    nombre: "Naturaleza del hombre",
    descripcion: "Reflexiones sobre la esencia y condición humana.",
  },
  {
    nombre: "Amor",
    descripcion: "Libros acerca del amor humano y sus dimensiones.",
  },
  {
    nombre: "Futuro",
    descripcion: "Textos que analizan el porvenir y los cambios sociales.",
  },
];

// =======================
// LIBROS
// =======================
export const libros = [
  {
    codigo: "890.0001",
    anio: "2003",
    categoria_codigo: "890",
    titulo: "MENTE CREATIVA",
    origen: "Original",
    estado: "Buen estado",
  },
  {
    codigo: "890.0002",
    anio: "2000",
    categoria_codigo: "890",
    titulo: "EN SOLO 21 DÍAS",
    origen: "Copia",
    estado: "Regular",
  },
  {
    codigo: "890.0003",
    anio: "2000",
    categoria_codigo: "890",
    titulo: "Como recordar todo lo que leemos.",
    origen: "Copia",
    estado: "Regular",
  },
  {
    codigo: "890.0004",
    anio: "1989",
    categoria_codigo: "890",
    titulo: "Conozca su propia mente",
    origen: "Original",
    estado: "Buen estado",
  },
  {
    codigo: "890.0005",
    anio: "1982",
    categoria_codigo: "890",
    titulo: "El éxito más grande del mundo",
    origen: "Original",
    estado: "Buen estado",
  },
  {
    codigo: "890.0006",
    anio: "2008",
    categoria_codigo: "890",
    titulo: "El fascinante poder de la conversación",
    origen: "Original",
    estado: "Como nuevo",
  },
  {
    codigo: "890.0007",
    anio: "2013",
    categoria_codigo: "890",
    titulo: "Autoestima, fortalece tu confianza y el de los tuyos.",
    origen: "Original",
    estado: "Buen estado",
  },
  {
    codigo: "890.0008",
    anio: "SF",
    categoria_codigo: "890",
    titulo: "¿Quién se llevó mi queso?",
    origen: "Copia",
    estado: "Regular",
  },
  {
    codigo: "890.0009",
    anio: "2009",
    categoria_codigo: "890",
    titulo: "100 secretos de la gente feliz",
    origen: "Original",
    estado: "Como nuevo",
  },
  {
    codigo: "890.0010",
    anio: "2010",
    categoria_codigo: "890",
    titulo: "El mundo es tuyo",
    origen: "Copia",
    estado: "Buen estado",
  },
  {
    codigo: "890.0011",
    anio: "1945",
    categoria_codigo: "890",
    titulo: "El arte de aprender a estudiar",
    origen: "Original",
    estado: "Buen estado",
  },
  {
    codigo: "890.0012",
    anio: "1985",
    categoria_codigo: "890",
    titulo: "Respiración rítmica y concentración mental",
    origen: "Original",
    estado: "Buen estado",
  },
  {
    codigo: "890.0013",
    anio: "2007",
    categoria_codigo: "890",
    titulo: "¿Qué significa ser joven?",
    origen: "Copia",
    estado: "Buen estado",
  },
  {
    codigo: "890.0014",
    anio: "2007",
    categoria_codigo: "890",
    titulo: "El ser excelente",
    origen: "Copia",
    estado: "Buen estado",
  },
  {
    codigo: "890.0015",
    anio: "2006",
    categoria_codigo: "890",
    titulo: "Padre rico, padre pobre",
    origen: "Copia",
    estado: "Buen estado",
  },
  {
    codigo: "890.0016",
    anio: "SF",
    categoria_codigo: "890",
    titulo: "El hombre mediocre",
    origen: "Original",
    estado: "Regular",
  },
  {
    codigo: "890.0017",
    anio: "2007",
    categoria_codigo: "890",
    titulo: "El hombre mediocre",
    origen: "Copia",
    estado: "Regular",
  },
  {
    codigo: "890.0018",
    anio: "2017",
    categoria_codigo: "890",
    titulo: "Keep Calm solo tienes 50 años",
    origen: "Original",
    estado: "Buen estado",
  },
  {
    codigo: "890.0019",
    anio: "SF",
    categoria_codigo: "890",
    titulo: "Pensamientos eternos",
    origen: "Copia",
    estado: "Buen estado",
  },
  {
    codigo: "890.0020",
    anio: "1987",
    categoria_codigo: "890",
    titulo: "El arte de amar",
    origen: "Original",
    estado: "Regular",
  },
  {
    codigo: "890.0021",
    anio: "1995",
    categoria_codigo: "890",
    titulo: "El shock del futuro",
    origen: "Original",
    estado: "Regular",
  },
  {
    codigo: "890.0022",
    anio: "1981",
    categoria_codigo: "890",
    titulo: "El cielo es tu límite",
    origen: "Original",
    estado: "Regular",
  },
  {
    codigo: "890.0023",
    anio: "2009",
    categoria_codigo: "890",
    titulo: "Tiempo de esperanza",
    origen: "Original",
    estado: "Buen estado",
  },
  {
    codigo: "890.0024",
    anio: "2002",
    categoria_codigo: "890",
    titulo: "Transforma tu mente",
    origen: "Copia",
    estado: "Buen estado",
  },
  {
    codigo: "890.0025",
    anio: "2012",
    categoria_codigo: "890",
    titulo: "Reflexiones para curar el alma",
    origen: "Copia",
    estado: "Regular",
  },
  {
    codigo: "890.0026",
    anio: "2018",
    categoria_codigo: "890",
    titulo: "Meditaciones para no adolecer",
    origen: "Original",
    estado: "Buen estado",
  },
  {
    codigo: "890.0027",
    anio: "SF",
    categoria_codigo: "890",
    titulo: "¿Cómo hablar con los hijos? (actualizar origen y estado)",
    origen: "Copia",
    estado: "Regular",
  },
  {
    codigo: "890.0028",
    anio: "2000",
    categoria_codigo: "890",
    titulo: "El camino del líder",
    origen: "Original",
    estado: "Regular",
  },
];

// =======================
// RELACIÓN LIBROS ↔ AUTORES
// =======================
export const librosAutores = [
  { libro_codigo: "890.0001", autor_nombre: "Diego Parra Duque" },
  { libro_codigo: "890.0002", autor_nombre: "Harry Alder y Beryl Heather" },
  { libro_codigo: "890.0003", autor_nombre: "Stanley D. Frank" },
  { libro_codigo: "890.0004", autor_nombre: "Davis Lewis y James Greene" },
  { libro_codigo: "890.0005", autor_nombre: "Og Mandino" },
  {
    libro_codigo: "890.0006",
    autor_nombre: "Miguel Fernandez Romero y Fernando Ramirez",
  },
  {
    libro_codigo: "890.0007",
    autor_nombre: "Ediciones de desarrollo personal",
  },
  { libro_codigo: "890.0008", autor_nombre: "Spencer Jhonson" },
  { libro_codigo: "890.0009", autor_nombre: "David Niven" },
  { libro_codigo: "890.0010", autor_nombre: "Kim Woo - Choong" },
  { libro_codigo: "890.0011", autor_nombre: "Arthur W. Kornhauser" },
  { libro_codigo: "890.0012", autor_nombre: "Francis Lefebure" },
  { libro_codigo: "890.0013", autor_nombre: "Miguel Ángel Cornejo" },
  { libro_codigo: "890.0014", autor_nombre: "Miguel Ángel Cornejo" },
  {
    libro_codigo: "890.0015",
    autor_nombre: "Robert T. Kiyosaki y Sharon L. Lechter",
  },
  { libro_codigo: "890.0016", autor_nombre: "José Ingenieros" },
  { libro_codigo: "890.0017", autor_nombre: "José Ingenieros" },
  {
    libro_codigo: "890.0018",
    autor_nombre: "Editorial La esfera de los libros",
  },
  {
    libro_codigo: "890.0019",
    autor_nombre: "Felix Franco editores y libreros",
  },
  { libro_codigo: "890.0020", autor_nombre: "Erich Fromm" },
  { libro_codigo: "890.0021", autor_nombre: "Alvin Toffler" },
  { libro_codigo: "890.0022", autor_nombre: "Wayne W. Dyer" },
  { libro_codigo: "890.0023", autor_nombre: "Mark A. Finley" },
  { libro_codigo: "890.0024", autor_nombre: "Daila Lama" },
  { libro_codigo: "890.0025", autor_nombre: "Orlando M. Almeyda Sáenz" },
  { libro_codigo: "890.0026", autor_nombre: "Macv Chávez" },
  { libro_codigo: "890.0027", autor_nombre: "" },
  { libro_codigo: "890.0028", autor_nombre: "David Fischman" },
];

// =======================
// RELACIÓN LIBROS ↔ TEMAS
// =======================
export const librosTemas = [
  { libro_codigo: "890.0001", tema_nombre: "Desarrollo de la creatividad" },
  { libro_codigo: "890.0002", tema_nombre: "Psicología y autoayuda" },
  { libro_codigo: "890.0003", tema_nombre: "Lectura veloz" },
  { libro_codigo: "890.0004", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0005", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0006", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0007", tema_nombre: "Autoestima" },
  { libro_codigo: "890.0008", tema_nombre: "Adaptarse" },
  { libro_codigo: "890.0009", tema_nombre: "Felicidad" },
  { libro_codigo: "890.0010", tema_nombre: "Éxito" },
  { libro_codigo: "890.0011", tema_nombre: "Consejos para estudiar" },
  { libro_codigo: "890.0012", tema_nombre: "Respiración" },
  { libro_codigo: "890.0013", tema_nombre: "Consejos" },
  { libro_codigo: "890.0014", tema_nombre: "Consejos" },
  { libro_codigo: "890.0015", tema_nombre: "Superación" },
  { libro_codigo: "890.0016", tema_nombre: "Naturaleza del hombre" },
  { libro_codigo: "890.0017", tema_nombre: "Naturaleza del hombre" },
  { libro_codigo: "890.0018", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0019", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0020", tema_nombre: "Amor" },
  { libro_codigo: "890.0021", tema_nombre: "Futuro" },
  { libro_codigo: "890.0022", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0023", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0024", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0025", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0026", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0027", tema_nombre: "Autoayuda" },
  { libro_codigo: "890.0028", tema_nombre: "Autoayuda" },
];

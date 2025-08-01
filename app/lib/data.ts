import postgres from "postgres";
import { Categoria, Tema } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchLibrosPorMes() {
  try {
    const data = await sql`
      SELECT 
        TO_CHAR(fecha_creacion, 'Mon') AS mes,
        COUNT(*) AS total
      FROM libros
      WHERE fecha_creacion >= NOW() - INTERVAL '12 months'
      GROUP BY TO_CHAR(fecha_creacion, 'Mon'), DATE_TRUNC('month', fecha_creacion)
      ORDER BY DATE_TRUNC('month', fecha_creacion);
    `;
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books per month.");
  }
}

export async function fetchLatestBooks() {
  try {
    const data = await sql`
      SELECT 
        l.id,
        l.codigo,
        l.titulo,
        l.anio,
        l.fecha_creacion,
        c.nombre AS categoria,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', a.id,
              'nombre', a.nombre
            )
          ) FILTER (WHERE a.id IS NOT NULL), '[]'
        ) AS autores
      FROM libros l
      JOIN categorias c ON l.categoria_id = c.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      GROUP BY l.id, l.codigo, l.titulo, l.anio, l.fecha_creacion, c.nombre
      ORDER BY l.fecha_creacion DESC
      LIMIT 5;
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest books.");
  }
}

export async function fetchCardData() {
  try {
    const totalLibrosPromise = sql`SELECT COUNT(*) FROM libros`;
    const totalCategoriasPromise = sql`SELECT COUNT(*) FROM categorias`;
    const totalTemasPromise = sql`SELECT COUNT(*) FROM temas`;
    const totalUsuariosPromise = sql`SELECT COUNT(*) FROM users`;

    const [libros, categorias, temas, usuarios] = await Promise.all([
      totalLibrosPromise,
      totalCategoriasPromise,
      totalTemasPromise,
      totalUsuariosPromise,
    ]);

    return {
      totalLibros: Number(libros[0].count ?? "0"),
      totalCategorias: Number(categorias[0].count ?? "0"),
      totalTemas: Number(temas[0].count ?? "0"),
      totalUsuarios: Number(usuarios[0].count ?? "0"),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data for library.");
  }
}

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredBooks(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const libros = await sql`
      SELECT
        libros.id,
        libros.codigo,
        libros.titulo,
        libros.anio,
        libros.estado,
        libros.origen,
        -- categoría principal (nivel más alto)
        cp.nombre AS categoria_principal,
        cp.codigo AS codigo_principal,
        -- categoría del libro (puede ser subcategoría)
        c.nombre AS categoria,
        c.codigo AS codigo_categoria,
        -- autores asociados
        COALESCE(STRING_AGG(DISTINCT a.nombre, ', '), 'Sin autores') AS autores,
        -- temas asociados
        COALESCE(STRING_AGG(DISTINCT t.nombre, ', '), 'Sin temas') AS temas
      FROM libros
      JOIN categorias c ON libros.categoria_id = c.id
      LEFT JOIN categorias cp ON c.parent_id = cp.id
      LEFT JOIN libros_autores la ON libros.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      LEFT JOIN libros_temas lt ON libros.id = lt.libro_id
      LEFT JOIN temas t ON lt.tema_id = t.id
      WHERE
        libros.titulo ILIKE ${`%${query}%`} OR
        a.nombre ILIKE ${`%${query}%`} OR
        c.nombre ILIKE ${`%${query}%`} OR
        c.codigo ILIKE ${`%${query}%`} OR
        cp.nombre ILIKE ${`%${query}%`} OR
        cp.codigo ILIKE ${`%${query}%`} OR
        t.nombre ILIKE ${`%${query}%`} OR
        libros.estado ILIKE ${`%${query}%`} OR
        libros.origen ILIKE ${`%${query}%`} OR
        libros.anio::text ILIKE ${`%${query}%`} OR
        libros.codigo ILIKE ${`%${query}%`} 
      GROUP BY 
        libros.id, libros.codigo, 
        libros.titulo, libros.anio, 
        libros.estado, libros.origen,
        c.nombre, c.codigo, 
        cp.nombre, cp.codigo
      ORDER BY libros.fecha_creacion DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return libros;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered books.");
  }
}

export async function fetchBooksPages(query: string) {
  try {
    const data = await sql`
      SELECT COUNT(DISTINCT libros.id)
      FROM libros
      JOIN categorias ON libros.categoria_id = categorias.id
      LEFT JOIN libros_autores ON libros.id = libros_autores.libro_id
      LEFT JOIN autores ON libros_autores.autor_id = autores.id
      WHERE
        libros.titulo ILIKE ${`%${query}%`} OR
        categorias.nombre ILIKE ${`%${query}%`} OR
        libros.estado ILIKE ${`%${query}%`} OR
        libros.anio::text ILIKE ${`%${query}%`} OR
        autores.nombre ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of books.");
  }
}

export async function fetchBookById(id: string) {
  try {
    const data = await sql<any[]>`
      SELECT
        l.id,
        l.codigo,
        l.titulo,
        l.anio,
        l.estado,
        l.origen,
        l.categoria_id,
        t.id AS tema_id,
        t.nombre AS tema_nombre,
        array_agg(a.id) AS autores_ids,
        array_agg(a.nombre) AS autores_nombres
      FROM libros l
      LEFT JOIN libros_temas lt ON lt.libro_id = l.id
      LEFT JOIN temas t ON t.id = lt.tema_id
      LEFT JOIN libros_autores la ON la.libro_id = l.id
      LEFT JOIN autores a ON a.id = la.autor_id
      WHERE l.id = ${id}
      GROUP BY l.id, t.id, t.nombre;
    `;

    if (data.length === 0) return null;

    const libro = data[0];

    return {
      id: libro.id,
      codigo: libro.codigo,
      titulo: libro.titulo,
      anio: libro.anio,
      estado: libro.estado,
      origen: libro.origen,
      categoriaPrincipal: libro.categoria_id,
      subcategoria: libro.categoria_id,
      tema: libro.tema_id,
      autores: libro.autores_ids?.filter((id: string) => id !== null) || [],
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch book.");
  }
}

/*Categories and Topics*/

export async function fetchSubcategorias() {
  try {
    return await sql`
      SELECT id, nombre, codigo, parent_id
      FROM categorias
      WHERE parent_id IS NOT NULL
      ORDER BY nombre ASC;
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch subcategories.");
  }
}

// Filtrar categorías
export async function fetchFilteredCategorias(
  query: string,
  currentPage: number
) {
  const ITEMS_PER_PAGE = 6;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    return await sql<Categoria[]>`
      SELECT 
        c.id,
        c.codigo,
        c.nombre,
        cp.nombre AS categoria_padre
      FROM categorias c
      LEFT JOIN categorias cp ON c.parent_id = cp.id
      WHERE 
        c.nombre ILIKE ${`%${query}%`}
        OR c.codigo ILIKE ${`%${query}%`}
        OR cp.nombre ILIKE ${`%${query}%`}
      ORDER BY c.nombre ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered categories.");
  }
}

// Total de páginas
export async function fetchCategoriasPages(query: string) {
  try {
    const result = await sql`
      SELECT COUNT(*)
      FROM categorias c
      LEFT JOIN categorias cp ON c.parent_id = cp.id
      WHERE 
        c.nombre ILIKE ${`%${query}%`}
        OR c.codigo ILIKE ${`%${query}%`}
        OR cp.nombre ILIKE ${`%${query}%`}
    `;

    return Math.ceil(Number(result[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of categories.");
  }
}

// Crear categoría
export async function createCategoria(
  nombre: string,
  codigo: string,
  parent_id: number | null
) {
  try {
    const [categoria] = await sql<Categoria[]>`
      INSERT INTO categorias (nombre, codigo, parent_id)
      VALUES (${nombre}, ${codigo}, ${parent_id})
      RETURNING id, nombre, codigo, parent_id;
    `;
    return categoria;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to create category.");
  }
}

// Traer categorías principales (para seleccionar padre)
export async function fetchCategoriasPrincipales() {
  try {
    return await sql<Categoria[]>`
      SELECT id, nombre, codigo 
      FROM categorias
      WHERE parent_id IS NULL
      ORDER BY nombre ASC;
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch main categories.");
  }
}

export async function fetchCategoriaById(
  id: string
): Promise<Categoria | null> {
  try {
    const data = await sql<Categoria[]>`
      SELECT id, nombre, codigo, parent_id
      FROM categorias
      WHERE id = ${id}
      LIMIT 1;
    `;
    return data[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch category.");
  }
}

// Temas
export async function fetchTemas() {
  try {
    return await sql`
      SELECT id, nombre 
      FROM temas
      ORDER BY nombre ASC;
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

export async function fetchFilteredTemas(
  query: string,
  currentPage: number
): Promise<Tema[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    return await sql<Tema[]>`
      SELECT id, nombre, descripcion
      FROM temas
      WHERE nombre ILIKE ${"%" + query + "%"}
      ORDER BY nombre ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch temas.");
  }
}

export async function fetchTemasPages(query: string): Promise<number> {
  try {
    const data = await sql`
      SELECT COUNT(*) 
      FROM temas 
      WHERE nombre ILIKE ${"%" + query + "%"};
    `;
    return Math.ceil(Number(data[0].count) / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total temas pages.");
  }
}

export async function fetchTemaById(id: number): Promise<Tema | null> {
  try {
    const data = await sql<Tema[]>`
      SELECT id, nombre, descripcion
      FROM temas
      WHERE id = ${id};
    `;
    return data[0] || null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch tema.");
  }
}

/*Autores*/

export async function fetchAutores() {
  try {
    const autores = await sql`
      SELECT id, nombre 
      FROM autores
      ORDER BY nombre ASC;
    `;
    return autores;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch autores.");
  }
}

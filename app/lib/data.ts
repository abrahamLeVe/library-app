import postgres from "postgres";
import { CustomerField, CustomersTableType } from "./definitions";
import { formatCurrency } from "./utils";

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
        libros.id,
        libros.codigo,
        libros.titulo,
        libros.autor,
        libros.anio,
        libros.fecha_creacion,
        categorias.nombre AS categoria
      FROM libros
      JOIN categorias ON libros.categoria_id = categorias.id
      ORDER BY libros.fecha_creacion DESC
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
        libros.autor,
        libros.anio,
        libros.estado,
        libros.origen,
        -- categoría principal (nivel más alto)
        cp.nombre AS categoria_principal,
        cp.codigo AS codigo_principal,
        -- categoría del libro (puede ser subcategoría)
        c.nombre AS categoria,
        c.codigo AS codigo_categoria,
        -- temas asociados
        COALESCE(STRING_AGG(t.nombre, ', '), 'Sin temas') AS temas
      FROM libros
      JOIN categorias c ON libros.categoria_id = c.id
      LEFT JOIN categorias cp ON c.parent_id = cp.id
      LEFT JOIN libros_temas lt ON libros.id = lt.libro_id
      LEFT JOIN temas t ON lt.tema_id = t.id
      WHERE
        libros.titulo ILIKE ${`%${query}%`} OR
        libros.autor ILIKE ${`%${query}%`} OR
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
        libros.origen,
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
      SELECT COUNT(*)
      FROM libros
      JOIN categorias ON libros.categoria_id = categorias.id
      WHERE
        libros.titulo ILIKE ${`%${query}%`} OR
        libros.autor ILIKE ${`%${query}%`} OR
        categorias.nombre ILIKE ${`%${query}%`} OR
        libros.estado ILIKE ${`%${query}%`} OR
        libros.anio::text ILIKE ${`%${query}%`}
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
        l.autor,
        l.anio,
        l.estado,
        l.origen,
        l.categoria_id,
        t.id AS tema_id,
        t.nombre AS tema_nombre
      FROM libros l
      LEFT JOIN libros_temas lt ON lt.libro_id = l.id
      LEFT JOIN temas t ON t.id = lt.tema_id
      WHERE l.id = ${id};
    `;

    if (data.length === 0) return null;

    const libro = data[0];

    return {
      id: libro.id,
      codigo: libro.codigo,
      titulo: libro.titulo,
      autor: libro.autor,
      anio: libro.anio,
      estado: libro.estado,
      origen: libro.origen,
      categoriaPrincipal: libro.categoria_id, // principal
      subcategoria: libro.categoria_id, // usar el mismo para subcategoría
      tema: libro.tema_id,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch book.");
  }
}

export async function fetchCustomers() {
  try {
    const customers = await sql<CustomerField[]>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType[]>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

export async function fetchCategoriasPrincipales() {
  try {
    return await sql`
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

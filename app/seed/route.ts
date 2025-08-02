import bcrypt from "bcrypt";
import postgres from "postgres";
import {
  autores,
  categorias,
  libros,
  librosAutores,
  librosTemas,
  temas,
  users,
} from "../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

/* USERS */
async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await sql`
      INSERT INTO users (id, name, email, password)
      VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
      ON CONFLICT (id) DO NOTHING;
    `;
  }
}

/* CATEGORIAS */
async function seedCategorias() {
  await sql`
    CREATE TABLE IF NOT EXISTS categorias (
      id SERIAL PRIMARY KEY,
      codigo VARCHAR(10) UNIQUE NOT NULL,
      nombre VARCHAR(100) UNIQUE NOT NULL,
      parent_id INT REFERENCES categorias(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  for (const cat of categorias) {
    const parent = cat.parent_id
      ? await sql`SELECT id FROM categorias WHERE codigo = ${cat.parent_id}`
      : null;

    await sql`
      INSERT INTO categorias (codigo, nombre, parent_id)
      VALUES (${cat.codigo}, ${cat.nombre}, ${parent?.[0]?.id ?? null})
      ON CONFLICT (codigo) DO NOTHING;
    `;
  }
}

/* AUTORES */
async function seedAutores() {
  await sql`
    CREATE TABLE IF NOT EXISTS autores (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(150) UNIQUE NOT NULL,
      biografia TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  for (const autor of autores) {
    await sql`
      INSERT INTO autores (nombre, biografia)
      VALUES (${autor.nombre}, ${autor.biografia ?? null})
      ON CONFLICT (nombre) DO NOTHING;
    `;
  }
}

/* LIBROS */
async function seedLibros() {
  await sql`
    CREATE TABLE IF NOT EXISTS libros (
      id SERIAL PRIMARY KEY,
      codigo VARCHAR(20) UNIQUE NOT NULL,
      anio VARCHAR(4), 
      fecha_creacion TIMESTAMP DEFAULT NOW(),
      categoria_id INT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
      titulo VARCHAR(200) NOT NULL,
      origen VARCHAR(100),
      estado VARCHAR(50) CHECK (
        estado IN ('Nuevo','Como nuevo','Buen estado','Regular','Mal estado')
      ),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  for (const libro of libros) {
    const cat =
      await sql`SELECT id FROM categorias WHERE codigo = ${libro.categoria_codigo}`;

    await sql`
      INSERT INTO libros (codigo, anio, categoria_id, titulo, origen, estado)
      VALUES (${libro.codigo}, ${libro.anio ?? null}, ${cat[0].id}, 
              ${libro.titulo}, ${libro.origen}, ${libro.estado})
      ON CONFLICT (codigo) DO NOTHING;
    `;
  }
}

/* TEMAS */
async function seedTemas() {
  await sql`
    CREATE TABLE IF NOT EXISTS temas (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) UNIQUE NOT NULL,
      descripcion TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  for (const tema of temas) {
    await sql`
      INSERT INTO temas (nombre, descripcion)
      VALUES (${tema.nombre}, ${tema.descripcion ?? null})
      ON CONFLICT (nombre) DO NOTHING;
    `;
  }
}

/* RELACIÓN LIBROS-TEMAS */
async function seedLibrosTemas() {
  await sql`
    CREATE TABLE IF NOT EXISTS libros_temas (
      libro_id INT REFERENCES libros(id) ON DELETE CASCADE,
      tema_id INT REFERENCES temas(id) ON DELETE CASCADE,
      PRIMARY KEY (libro_id, tema_id),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  for (const rel of librosTemas) {
    const libro =
      await sql`SELECT id FROM libros WHERE codigo = ${rel.libro_codigo}`;
    const tema =
      await sql`SELECT id FROM temas WHERE nombre = ${rel.tema_nombre}`;
    if (libro.length && tema.length) {
      await sql`
        INSERT INTO libros_temas (libro_id, tema_id)
        VALUES (${libro[0].id}, ${tema[0].id})
        ON CONFLICT DO NOTHING;
      `;
    }
  }
}

/* RELACIÓN LIBROS-AUTORES */
async function seedLibrosAutores() {
  await sql`
    CREATE TABLE IF NOT EXISTS libros_autores (
      libro_id INT REFERENCES libros(id) ON DELETE CASCADE,
      autor_id INT REFERENCES autores(id) ON DELETE CASCADE,
      PRIMARY KEY (libro_id, autor_id),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;

  for (const rel of librosAutores) {
    const libro =
      await sql`SELECT id FROM libros WHERE codigo = ${rel.libro_codigo}`;
    const autor =
      await sql`SELECT id FROM autores WHERE nombre = ${rel.autor_nombre}`;
    if (libro.length && autor.length) {
      await sql`
        INSERT INTO libros_autores (libro_id, autor_id)
        VALUES (${libro[0].id}, ${autor[0].id})
        ON CONFLICT DO NOTHING;
      `;
    }
  }
}

/* MAIN */
export async function GET() {
  try {
    await sql.begin(async () => {
      await seedUsers();
      await seedCategorias();
      await seedAutores();
      await seedLibros();
      await seedTemas();
      await seedLibrosTemas();
      await seedLibrosAutores();
    });

    return Response.json({
      message: "Base de datos sembrada con autores, libros y temas 🚀",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}

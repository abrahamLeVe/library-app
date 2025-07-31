import bcrypt from "bcrypt";
import postgres from "postgres";
import {
  users,
  categorias,
  libros,
  temas,
  librosTemas,
} from "../lib/placeholder-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

async function seedUsers() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
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

async function seedCategorias() {
  await sql`
    CREATE TABLE IF NOT EXISTS categorias (
      id SERIAL PRIMARY KEY,
      codigo VARCHAR(10) UNIQUE NOT NULL,
      nombre VARCHAR(100) NOT NULL,
      parent_id INT REFERENCES categorias(id) ON DELETE CASCADE
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

async function seedLibros() {
  await sql`
    CREATE TABLE IF NOT EXISTS libros (
      id SERIAL PRIMARY KEY,
      codigo VARCHAR(20) UNIQUE NOT NULL,
      anio VARCHAR(4), 
      fecha_creacion TIMESTAMP DEFAULT NOW(),
      categoria_id INT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
      autor VARCHAR(100) NOT NULL,
      titulo VARCHAR(200) NOT NULL,
      origen VARCHAR(100),
      estado VARCHAR(50) CHECK (
        estado IN ('Nuevo','Como nuevo','Buen estado','Regular','Mal estado')
      )
    );
  `;

  for (const libro of libros) {
    const cat =
      await sql`SELECT id FROM categorias WHERE codigo = ${libro.categoria_codigo}`;

    await sql`
      INSERT INTO libros (codigo, anio, categoria_id, autor, titulo, origen, estado)
      VALUES (${libro.codigo}, ${libro.anio ?? null}, ${cat[0].id}, ${
      libro.autor
    }, ${libro.titulo}, ${libro.origen}, ${libro.estado})
      ON CONFLICT (codigo) DO NOTHING;
    `;
  }
}

async function seedTemas() {
  await sql`
    CREATE TABLE IF NOT EXISTS temas (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(100) UNIQUE NOT NULL
    );
  `;

  for (const tema of temas) {
    await sql`
      INSERT INTO temas (nombre)
      VALUES (${tema.nombre})
      ON CONFLICT (nombre) DO NOTHING;
    `;
  }
}

async function seedLibrosTemas() {
  await sql`
    CREATE TABLE IF NOT EXISTS libros_temas (
      libro_id INT REFERENCES libros(id) ON DELETE CASCADE,
      tema_id INT REFERENCES temas(id) ON DELETE CASCADE,
      PRIMARY KEY (libro_id, tema_id)
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

export async function GET() {
  try {
    await sql.begin(async () => {
      // 🚀 Insertar datos nuevos
      await seedUsers();
      await seedCategorias();
      await seedLibros();
      await seedTemas();
      await seedLibrosTemas();
    });

    return Response.json({
      message: "Base de datos limpiada y sembrada con éxito 🚀",
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}

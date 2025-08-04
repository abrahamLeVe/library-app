"use server";

import { signIn } from "@/auth";
import bcrypt from "bcrypt";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";
import { capitalizeFirstLetter } from "./utils";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const FormSchema = z.object({
  codigo: z
    .string()
    .length(8, { message: "El código debe tener exactamente 8 caracteres." }),
  categoriaPrincipal: z
    .string()
    .min(1, { message: "Seleccione una categoría principal." }),
  subcategoria: z.string().min(1, { message: "Seleccione una subcategoría." }),
  tema: z.string().min(1, { message: "Seleccione un tema." }),
  titulo: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres." }),
  autores: z
    .array(z.string().min(1))
    .min(1, { message: "Seleccione al menos un autor." }),
  anio: z
    .string()
    .transform((val) => val.toUpperCase().trim())
    .refine((val) => val === "SF" || /^\d{4}$/.test(val), {
      message: "Debe ingresar un año válido (ej: 1999) o 'SF'.",
    }),
  origen: z.enum(["Copia", "Original", "Otro"]),
  estado: z.enum([
    "Nuevo",
    "Como nuevo",
    "Buen estado",
    "Regular",
    "Mal estado",
  ]),
});

export type State = {
  errors?: {
    codigo?: string[];
    categoriaPrincipal?: string[];
    subcategoria?: string[];
    tema?: string[];
    titulo?: string[];
    autores?: string[];
    anio?: string[];
    origen?: string[];
    estado?: string[];
  };
  message?: string | null;
  values?: Record<string, string | string[]>;
};

export async function createBook(prevState: State, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    codigo: formData.get("codigoCompleto"),
    categoriaPrincipal: formData.get("categoriaPrincipal"),
    subcategoria: formData.get("subcategoria"),
    tema: formData.get("tema"),
    titulo: formData.get("titulo"),
    autores: formData.getAll("autores"), // múltiples autores
    anio: formData.get("anio"),
    origen: formData.get("origen"),
    estado: formData.get("estado"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos. No se pudo crear el libro.",
      values: Object.fromEntries(
        Array.from(formData.keys()).map((key) => {
          const allValues = formData.getAll(key).map((v) => String(v));
          return [key, allValues.length > 1 ? allValues : allValues[0]];
        })
      ) as Record<string, string | string[]>,
    };
  }

  const { codigo, subcategoria, tema, titulo, autores, anio, origen, estado } =
    validatedFields.data;

  try {
    // 1. Insertar libro
    const result = await sql`
      INSERT INTO libros (codigo, titulo, anio, estado, origen, categoria_id)
      VALUES (${codigo}, ${titulo}, ${anio}, ${estado}, ${origen}, ${subcategoria})
      RETURNING id;
    `;

    const libroId = result[0].id;

    // 2. Insertar relación libro-tema (1 tema por libro)
    await sql`
      INSERT INTO libros_temas (libro_id, tema_id)
      VALUES (${libroId}, ${tema});
    `;

    // 3. Insertar relación libro-autores (N:M)
    for (const autorId of autores) {
      await sql`
        INSERT INTO libros_autores (libro_id, autor_id)
        VALUES (${libroId}, ${autorId});
      `;
    }
  } catch (error: any) {
    console.error("Database Error:", error);

    if (error.code === "23505") {
      return {
        message: `Ya existe un libro con el código ${formData.get(
          "codigoCompleto"
        )}.`,
        errors: { codigo: ["Este código ya está registrado."] },
        values: Object.fromEntries(
          Array.from(formData.keys()).map((key) => {
            const allValues = formData.getAll(key).map((v) => String(v));
            return [key, allValues.length > 1 ? allValues : allValues[0]];
          })
        ) as Record<string, string | string[]>,
      };
    }

    return {
      message: `Error en la base de datos: No se pudo actualizar el libro. ${error.detail}`,
      values: Object.fromEntries(
        Array.from(formData.keys()).map((key) => {
          const allValues = formData.getAll(key).map((v) => String(v));
          return [key, allValues.length > 1 ? allValues : allValues[0]];
        })
      ) as Record<string, string | string[]>,
    };
  }

  revalidatePath("/dashboard/books");
  redirect("/dashboard/books");
}

export async function updateBook(
  id: string,
  prevState: State,
  formData: FormData
) {
  const validatedFields = FormSchema.safeParse({
    codigo: formData.get("codigoCompleto"),
    categoriaPrincipal: formData.get("categoriaPrincipal"),
    subcategoria: formData.get("subcategoria"),
    tema: formData.get("tema"),
    titulo: formData.get("titulo"),
    anio: formData.get("anio"),
    origen: formData.get("origen"),
    estado: formData.get("estado"),
    autores: formData.getAll("autores"), // <- importante, porque es multiple
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos. No se pudo actualizar el libro.",
      values: Object.fromEntries(
        Array.from(formData.keys()).map((key) => {
          const allValues = formData.getAll(key).map((v) => String(v));
          return [key, allValues.length > 1 ? allValues : allValues[0]];
        })
      ) as Record<string, string | string[]>,
    };
  }

  const { codigo, subcategoria, tema, titulo, autores, anio, origen, estado } =
    validatedFields.data;

  try {
    // Actualizamos el libro
    await sql`
      UPDATE libros
      SET codigo = ${codigo},
          titulo = ${titulo},
          anio = ${anio},
          estado = ${estado},
          origen = ${origen},
          categoria_id = ${subcategoria}          
      WHERE id = ${id}
    `;

    // Actualizamos autores: primero limpiamos y luego insertamos
    await sql`DELETE FROM libros_autores WHERE libro_id = ${id}`;
    for (const autorId of autores) {
      await sql`
        INSERT INTO libros_autores (libro_id, autor_id)
        VALUES (${id}, ${autorId});
      `;
    }

    // Actualizamos tema (solo uno)
    await sql`DELETE FROM libros_temas WHERE libro_id = ${id}`;
    if (tema) {
      await sql`
        INSERT INTO libros_temas (libro_id, tema_id)
        VALUES (${id}, ${tema});
      `;
    }
  } catch (error: any) {
    console.error("Database Error:", error);
    if (error.code === "23505") {
      return {
        message: `Ya existe un libro con el código ${formData.get(
          "codigoCompleto"
        )}.`,
        errors: { codigo: ["Este código ya está registrado."] },
        values: Object.fromEntries(
          Array.from(formData.keys()).map((key) => {
            const allValues = formData.getAll(key).map((v) => String(v));
            return [key, allValues.length > 1 ? allValues : allValues[0]];
          })
        ) as Record<string, string | string[]>,
      };
    }

    return {
      message: `Error en la base de datos: No se pudo actualizar el libro. ${error.detail}`,
      values: Object.fromEntries(
        Array.from(formData.keys()).map((key) => {
          const allValues = formData.getAll(key).map((v) => String(v));
          return [key, allValues.length > 1 ? allValues : allValues[0]];
        })
      ) as Record<string, string | string[]>,
    };
  }

  revalidatePath("/dashboard/books");
  redirect("/dashboard/books");
}

export async function deleteBook(id: string) {
  try {
    // Eliminar relaciones con autores
    await sql`DELETE FROM libros_autores WHERE libro_id = ${id}`;

    // Eliminar relaciones con temas
    await sql`DELETE FROM libros_temas WHERE libro_id = ${id}`;

    // Eliminar el libro
    await sql`DELETE FROM libros WHERE id = ${id}`;

    revalidatePath("/dashboard/books");
    return { success: true, message: "Libro eliminado correctamente ✅" };
  } catch (error) {
    console.error("Error eliminando el libro:", error);
    return { success: false, message: "Error eliminando el libro ❌" };
  }
}
//auth
export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Credenciales invalidas.";
        default:
          return "Algo paso!.";
      }
    }
    throw error;
  }
}

//category

export async function createCategory(
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  try {
    const nombre = formData.get("nombre")?.toString().trim() || "";
    const codigo = formData.get("codigo")?.toString().trim() || "";
    const parentId = formData.get("parent_id")?.toString() || null;

    if (!nombre || !codigo) {
      return { success: false, message: "Nombre y código son obligatorios." };
    }

    await sql`
      INSERT INTO categorias (nombre, codigo, parent_id)
      VALUES (${capitalizeFirstLetter(nombre)}, ${codigo}, ${parentId || null})
    `;
    revalidatePath("/dashboard/category/create");
    revalidatePath("/dashboard/books");

    return { success: true, message: "Categoría creada exitosamente ✅" };
  } catch (error: any) {
    console.error("Error actualizando categoría:", error);
    if (error.code === "23505") {
      if (error.constraint_name === "categorias_nombre_key") {
        return {
          success: false,
          message: `⚠️ Ya existe una categoría con el nombre "${formData.get(
            "nombre"
          )}".`,
        };
      } else {
        return {
          success: false,
          message: `⚠️ Ya existe una categoría con el código "${formData.get(
            "codigo"
          )}".`,
        };
      }
    }

    return {
      success: false,
      message: `Error en la base de datos: No se pudo actualizar el libro. ${error.detail}`,
    };
  }
}

export async function updateCategory(
  id: number,
  prevState: { success: boolean; message: string },
  formData: FormData
) {
  const parsedId = Number(id);
  if (isNaN(parsedId)) {
    return { success: false, message: "ID de categoría inválido." };
  }
  try {
    const nombre = formData.get("nombre")?.toString().trim() || "";
    const codigo = formData.get("codigo")?.toString().trim() || "";
    const parentId = formData.get("parent_id")?.toString() || null;

    if (!nombre || !codigo) {
      return { success: false, message: "Nombre y código son obligatorios." };
    }

    await sql`
      UPDATE categorias
      SET nombre = ${capitalizeFirstLetter(
        nombre
      )}, codigo = ${codigo}, parent_id = ${parentId || null}
      WHERE id = ${id}
    `;
    revalidatePath(`/dashboard/category/${id}/edit`);
    revalidatePath("/dashboard/books");

    return { success: true, message: "Categoría actualizada correctamente ✅" };
  } catch (error: any) {
    console.error("Error actualizando categoría:", error);
    if (error.code === "23505") {
      if (error.constraint_name === "categorias_nombre_key") {
        return {
          success: false,
          message: `⚠️ Ya existe una categoría con el nombre "${formData.get(
            "nombre"
          )}".`,
        };
      } else {
        return {
          success: false,
          message: `⚠️ Ya existe una categoría con el código "${formData.get(
            "codigo"
          )}".`,
        };
      }
    }

    return {
      success: false,
      message: `Error en la base de datos: No se pudo actualizar el libro. ${error.detail}`,
    };
  }
}

export async function deleteCategory(id: string) {
  try {
    await sql`DELETE FROM categorias WHERE id = ${id}`;
    revalidatePath("/dashboard/category");
    revalidatePath("/dashboard/books");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category.");
  }
}

// ✅ Esquema de validación con Zod
const FormSchemaTema = z.object({
  nombre: z
    .string()
    .min(3, { message: "El título debe tener al menos 3 caracteres." }),
  descripcion: z.string().optional(),
});

// ✅ Tipado del estado
export type StateTema = {
  errors?: {
    nombre?: string[];
    descripcion?: string[];
  };
  message?: string | null;
  values?: {
    nombre: string;
    descripcion?: string | null;
  };
};

export async function createTema(prevState: StateTema, formData: FormData) {
  const validatedFields = FormSchemaTema.safeParse({
    nombre: formData.get("nombre")?.toString().trim(),
    descripcion: formData.get("descripcion"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "❌ Faltan campos. No se pudo actualizar el tema.",
      values: {
        nombre: formData.get("nombre")?.toString() || "",
        descripcion: formData.get("descripcion")?.toString() || "",
      },
    };
  }

  const { nombre, descripcion } = validatedFields.data;

  try {
    // Insertar el tema si no existe
    await sql`
      INSERT INTO temas (nombre, descripcion)
      VALUES (${capitalizeFirstLetter(nombre)}, ${descripcion ?? null})
    `;

    revalidatePath("/dashboard/themes"); // refrescar la lista
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Tema "${nombre}" creado correctamente.`,
      values: { nombre, descripcion: descripcion ?? "" },
    };
  } catch (error: any) {
    console.error("Error creando tema:", error);
    if (error.code === "23505") {
      return {
        errors: { nombre: [`⚠️ Ya existe un tema con el nombre "${nombre}".`] },
        message: `El tema "${nombre}" ya existe.`,
        values: { nombre, descripcion: descripcion ?? "" },
      };
    }
    return { success: false, message: "❌ Error creando tema." };
  }
}

// ✅ Función para actualizar un tema
export async function updateTema(
  id: number,
  prevState: StateTema,
  formData: FormData
): Promise<StateTema> {
  // Validar campos
  const validatedFields = FormSchemaTema.safeParse({
    nombre: formData.get("nombre")?.toString().trim().toLowerCase(),
    descripcion: formData.get("descripcion"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "❌ Faltan campos. No se pudo actualizar el tema.",
      values: {
        nombre: formData.get("nombre")?.toString() || "",
        descripcion: formData.get("descripcion")?.toString() || "",
      },
    };
  }

  const { nombre, descripcion } = validatedFields.data;

  try {
    // Actualizar tema
    await sql`
      UPDATE temas
      SET nombre = ${nombre}, descripcion = ${descripcion ?? ""}
      WHERE id = ${id}
    `;

    // Refrescar cache de la ruta
    revalidatePath("/dashboard/themes");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Tema "${nombre}" actualizado correctamente.`,
      values: { nombre, descripcion: descripcion ?? "" },
    };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        errors: { nombre: [`⚠️ Ya existe un tema con el nombre "${nombre}".`] },
        message: `El tema "${nombre}" ya existe.`,
        values: { nombre, descripcion: descripcion ?? "" },
      };
    }

    return {
      message: "❌ Error en la base de datos: No se pudo actualizar el tema.",
      values: { nombre, descripcion: descripcion ?? "" },
    };
  }
}

export async function deleteTema(id: number) {
  try {
    await sql`DELETE FROM temas WHERE id = ${id}`;
    revalidatePath("/dashboard/themes");
    revalidatePath("/dashboard/books");

    return { success: true, message: "Tema eliminado correctamente" };
  } catch (error) {
    console.error("Error eliminando tema:", error);
    return { success: false, message: "Error eliminando tema" };
  }
}

/************autor***********/

const FormSchemaAutor = z.object({
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  biografia: z.string().optional(),
});

export type StateAutor = {
  errors?: {
    nombre?: string[];
    biografia?: string[];
  };
  message?: string | null;
  values?: {
    nombre: string;
    biografia?: string | null;
  };
};

export async function createAutor(prevState: StateAutor, formData: FormData) {
  const validatedFields = FormSchemaAutor.safeParse({
    nombre: formData.get("nombre")?.toString().trim(),
    biografia: formData.get("biografia")?.toString().trim() || null,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "❌ Faltan campos. No se pudo crear el autor.",
      values: {
        nombre: formData.get("nombre")?.toString() || "",
        biografia: formData.get("biografia")?.toString() || "",
      },
    };
  }

  const { nombre, biografia } = validatedFields.data;

  try {
    await sql`
      INSERT INTO autores (nombre, biografia)
      VALUES (${capitalizeFirstLetter(nombre)}, ${biografia ?? null})
    `;

    revalidatePath("/dashboard/author");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Autor "${nombre}" creado correctamente.`,
      values: { nombre, biografia: biografia ?? "" },
    };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        errors: {
          nombre: [`⚠️ Ya existe un autor con el nombre "${nombre}".`],
        },
        message: `El autor "${nombre}" ya existe.`,
        values: { nombre, biografia: biografia ?? "" },
      };
    }
    return { message: "❌ Error creando autor." };
  }
}

export async function updateAutor(
  id: number,
  prevState: StateAutor,
  formData: FormData
): Promise<StateAutor> {
  const validatedFields = FormSchemaAutor.safeParse({
    nombre: formData.get("nombre")?.toString().trim(),
    biografia: formData.get("biografia")?.toString().trim() || null,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "❌ Faltan campos. No se pudo actualizar el autor.",
      values: {
        nombre: formData.get("nombre")?.toString() || "",
        biografia: formData.get("biografia")?.toString() || "",
      },
    };
  }

  const { nombre, biografia } = validatedFields.data;

  try {
    await sql`
      UPDATE autores
      SET nombre = ${nombre}, biografia = ${biografia ?? null}
      WHERE id = ${id};
    `;

    revalidatePath("/dashboard/author");
    revalidatePath("/dashboard/books");

    return {
      message: `✅ Autor "${nombre}" actualizado correctamente.`,
      values: { nombre, biografia: biografia ?? "" },
    };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        errors: {
          nombre: [`⚠️ Ya existe un autor con el nombre "${nombre}".`],
        },
        message: `El autor "${nombre}" ya existe.`,
        values: { nombre, biografia: biografia ?? "" },
      };
    }

    console.error("Database Error (updateAutor):", error);
    return {
      message: "❌ Error actualizando autor.",
      values: { nombre, biografia: biografia ?? "" },
    };
  }
}

export async function deleteAutor(id: number) {
  try {
    await sql`DELETE FROM autores WHERE id = ${id};`;

    revalidatePath("/dashboard/author");
    revalidatePath("/dashboard/books"); // en caso de que estén relacionados

    return { message: "✅ Autor eliminado correctamente." };
  } catch (error) {
    console.error("Error eliminando autor:", error);
    throw new Error("❌ No se pudo eliminar el autor.");
  }
}

// Definición de estado para el formulario de usuarios
export type StateUser = {
  message: string | null;
  errors?: Record<string, string[]>;
  values?: {
    name: string;
    email: string;
    password?: string;
    role?: string;
  };
};

// Esquema de validación para usuarios

const FormSchemaUser = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Debe ser un correo válido." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener mínimo 6 caracteres." }),
  role: z.enum(["ADMIN", "CLIENT", "ASISTENTE"], { message: "Rol inválido." }),
});

export async function createUser(
  prevState: StateUser,
  formData: FormData
): Promise<StateUser> {
  const validatedFields = FormSchemaUser.safeParse({
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString(),
    role: formData.get("role")?.toString().toUpperCase() || "CLIENT",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "❌ Datos inválidos. Revisa el formulario.",
      values: {
        name: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        role: formData.get("role")?.toString() || "CLIENT",
      },
    };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
    `;

    revalidatePath("/dashboard/users");

    return {
      message: `✅ Usuario "${name}" registrado exitosamente.`,
      values: { name: "", email: "", role },
    };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        errors: { email: ["⚠️ Ya existe un usuario con este correo."] },
        message: `El usuario con correo "${email}" ya está registrado.`,
        values: { name, email, role },
      };
    }
    return { message: "❌ Error creando usuario." };
  }
}

const FormSchemaUserUpdate = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Debe ser un correo válido." }),
  password: z.string().optional(), // ahora opcional
  role: z.enum(["ADMIN", "CLIENT", "ASISTENTE"], { message: "Rol inválido." }),
});

export async function updateUser(
  id: string,
  prevState: StateUser,
  formData: FormData
): Promise<StateUser> {
  const validatedFields = FormSchemaUserUpdate.safeParse({
    name: formData.get("name")?.toString().trim(),
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString() || undefined, // si está vacío será undefined
    role: formData.get("role")?.toString().toUpperCase() || "CLIENT",
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "❌ Datos inválidos. Revisa el formulario.",
      values: {
        name: formData.get("name")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        role: formData.get("role")?.toString() || "CLIENT",
      },
    };
  }

  const { name, email, password, role } = validatedFields.data;

  try {
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await sql`
        UPDATE users
        SET name=${name}, email=${email}, password=${hashedPassword}, role=${role}
        WHERE id=${id}
      `;
    } else {
      await sql`
        UPDATE users
        SET name=${name}, email=${email}, role=${role}
        WHERE id=${id}
      `;
    }

    revalidatePath("/dashboard/users");
    return {
      message: `✅ Usuario "${name}" actualizado exitosamente.`,
      values: { name, email, role },
    };
  } catch (error: any) {
    if (error.code === "23505") {
      return {
        errors: { email: ["⚠️ Ya existe un usuario con este correo."] },
        message: `El usuario con correo "${email}" ya está registrado.`,
        values: { name, email, role },
      };
    }
    return { message: "❌ Error actualizando usuario." };
  }
}

export async function deleteUser(id: string) {
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;

    revalidatePath("/dashboard/users");

    return {
      success: true,
      message: "✅ Usuario eliminado correctamente.",
    };
  } catch (error: any) {
    console.error("Error eliminando usuario:", error);
    return {
      success: false,
      message: "❌ No se pudo eliminar el usuario.",
    };
  }
}

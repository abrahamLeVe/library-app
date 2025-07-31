"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { z } from "zod";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const FormSchema = z.object({
  codigo: z
    .string({
      required_error: "El código es obligatorio.",
      invalid_type_error: "El código es obligatorio.",
    })
    .length(8, { message: "El código debe tener exactamente 4 caracteres." }),

  categoriaPrincipal: z
    .string({
      required_error: "Seleccione una categoría principal.",
      invalid_type_error: "Seleccione una categoría principal.",
    })
    .min(1, { message: "Seleccione una categoría principal." }),

  subcategoria: z
    .string({
      required_error: "Seleccione una subcategoría.",
      invalid_type_error: "Seleccione una subcategoría.",
    })
    .min(1, { message: "Seleccione una subcategoría." }),

  tema: z
    .string({
      required_error: "Seleccione un tema.",
      invalid_type_error: "Seleccione un tema.",
    })
    .min(1, { message: "Seleccione un tema." }),

  titulo: z
    .string({
      required_error: "El título es obligatorio.",
      invalid_type_error: "El título es obligatorio.",
    })
    .min(3, { message: "El título debe tener al menos 3 caracteres." }),

  autor: z
    .string({
      required_error: "El autor es obligatorio.",
      invalid_type_error: "El autor es obligatorio.",
    })
    .min(3, { message: "El autor debe tener al menos 3 caracteres." }),

  anio: z
    .string({
      required_error: "El año es obligatorio.",
      invalid_type_error: "El año debe ser texto.",
    })
    .transform((val) => val.toUpperCase().trim()) // convierte a mayúsculas
    .refine((val) => val === "SF" || /^\d{4}$/.test(val), {
      message: "Debe ingresar un año válido (ej: 1999) o 'SF'.",
    }),

  origen: z.enum(["Copia", "Original", "Otro"], {
    required_error: "Seleccione un origen.",
    invalid_type_error: "Seleccione un origen.",
  }),

  estado: z.enum(
    ["Nuevo", "Como nuevo", "Buen estado", "Regular", "Mal estado"],
    {
      required_error: "Seleccione un estado.",
      invalid_type_error: "Seleccione un estado.",
    }
  ),

  fecha_creacion: z
    .string()
    .datetime()
    .default(() => new Date().toISOString()),
});

export type State = {
  errors?: {
    codigo?: string[];
    categoriaPrincipal?: string[];
    subcategoria?: string[];
    tema?: string[];
    titulo?: string[];
    autor?: string[];
    anio?: string[];
    origen?: string[];
    estado?: string[];
    fecha_creacion?: string[];
  };
  message?: string | null;
  values?: Record<string, string>;
};

export async function createBook(prevState: State, formData: FormData) {
  const validatedFields = FormSchema.safeParse({
    codigo: formData.get("codigoCompleto"),
    categoriaPrincipal: formData.get("categoriaPrincipal"),
    subcategoria: formData.get("subcategoria"),
    tema: formData.get("tema"),
    titulo: formData.get("titulo"),
    autor: formData.get("autor"),
    anio: formData.get("anio"),
    origen: formData.get("origen"),
    estado: formData.get("estado"),
    fecha_creacion: new Date().toISOString(),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos. No se pudo crear el libro.",
      values: Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [
          key,
          String(value),
        ])
      ),
    };
  }

  const {
    codigo,
    categoriaPrincipal,
    subcategoria,
    tema,
    titulo,
    autor,
    anio,
    origen,
    estado,
    fecha_creacion,
  } = validatedFields.data;

  try {
    // Insertamos el libro
    const result = await sql`
      INSERT INTO libros (codigo, titulo, autor, anio, estado, origen, categoria_id, fecha_creacion)
      VALUES (${codigo}, ${titulo}, ${autor}, ${anio}, ${estado}, ${origen}, ${subcategoria}, ${fecha_creacion})
      RETURNING id;
    `;

    const libroId = result[0].id;

    // Guardamos el tema (solo 1 tema por libro)
    await sql`
      INSERT INTO libros_temas (libro_id, tema_id)
      VALUES (${libroId}, ${tema});
    `;
  } catch (error: any) {
    console.error("Database Error:", error);

    if (error.code === "23505") {
      // Error de duplicado
      return {
        message: `Ya existe un libro con el código ${formData.get(
          "codigoCompleto"
        )}.`,
        errors: { codigo: ["Este código ya está registrado."] },
        values: Object.fromEntries(
          Array.from(formData.entries()).map(([key, value]) => [
            key,
            String(value),
          ])
        ),
      };
    }

    return {
      message: "Error en la base de datos: No se pudo crear el libro.",
      values: Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [
          key,
          String(value),
        ])
      ),
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
    autor: formData.get("autor"),
    anio: formData.get("anio"),
    origen: formData.get("origen"),
    estado: formData.get("estado"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos. No se pudo actualizar el libro.",
      values: Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [
          key,
          String(value),
        ])
      ),
    };
  }

  const {
    codigo,
    categoriaPrincipal,
    subcategoria,
    tema,
    titulo,
    autor,
    anio,
    origen,
    estado,
  } = validatedFields.data;

  try {
    // Actualizamos el libro
    await sql`
      UPDATE libros
      SET codigo = ${codigo},
          titulo = ${titulo},
          autor = ${autor},
          anio = ${anio},
          estado = ${estado},
          origen = ${origen},
          categoria_id = ${subcategoria}          
      WHERE id = ${id}
    `;

    // Actualizamos el tema (aseguramos solo uno por libro)
    await sql`DELETE FROM libros_temas WHERE libro_id = ${id}`;
    await sql`
      INSERT INTO libros_temas (libro_id, tema_id)
      VALUES (${id}, ${tema});
    `;
  } catch (error: any) {
    console.error("Database Error:", error);
    if (error.code === "23505") {
      // Error de duplicado
      return {
        message: `Ya existe un libro con el código ${formData.get(
          "codigoCompleto"
        )}.`,
        errors: { codigo: ["Este código ya está registrado."] },
        values: Object.fromEntries(
          Array.from(formData.entries()).map(([key, value]) => [
            key,
            String(value),
          ])
        ),
      };
    }

    return {
      message: `Error en la base de datos: No se pudo crear el libro. ${error.detail}`,
      values: Object.fromEntries(
        Array.from(formData.entries()).map(([key, value]) => [
          key,
          String(value),
        ])
      ),
    };
  }

  revalidatePath("/dashboard/books");
  redirect("/dashboard/books");
}

export async function deleteBook(id: string) {
  try {
    // Primero eliminamos la relación con temas (si existe)
    await sql`DELETE FROM libros_temas WHERE libro_id = ${id}`;

    // Luego eliminamos el libro
    await sql`DELETE FROM libros WHERE id = ${id}`;

    revalidatePath("/dashboard/books");
  } catch (error) {
    console.error("Error eliminando el libro:", error);
  }
}

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
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

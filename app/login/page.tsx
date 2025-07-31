import AcmeLogo from "@/app/ui/acme-logo";
import LoginForm from "@/app/ui/login-form";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-md p-6 space-y-6">
        {/* Encabezado con logo */}
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-40">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>

        {/* Formulario */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

"use client";
import Link from "next/link";
import Button from "./components/Button";
import Input from "./components/Input";
import Navbar from "./components/Navbar";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useClient } from "@/api/context";
import toast from "react-hot-toast";
import { useSession } from "@/api/session";

export default function LoginPage() {
  const router = useRouter();

  const { client } = useClient();
  const session = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [emailClicked, setEmailClicked] = useState(false);
  const [passwordClicked, setPasswordClicked] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const schema = z.object({
    email: z
      .string()
      .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
        message: "Ingresa un correo electrónico válido",
        path: ["email"],
      }),
    password: z.string().refine((value) => value.length >= 8, {
      message: "Contraseña inválida",
      path: ["password"],
    }),
  });

  const handleButtonClick = () => {
    const result = schema.safeParse({ email, password });

    if (result.success) {
      const f = async () => {
        const r = await client.auth.login({ id: email, password }).submit();
        session.init(r.token);

        router.push("/perfil");
      };

      void toast
        .promise(f(), {
          loading: "Iniciando sesion...",
          success: "Sesion iniciada",
          error: "Error al iniciar sesion",
        })
        .then();
    } else {
      setEmailError(result.error.errors.some((err) => err.path[0] === "email"));
      setPasswordError(
        result.error.errors.some((err) => err.path[0] === "password"),
      );

      setEmailClicked(false);
      setPasswordClicked(false);

      if (result.error.errors.length > 0) {
        setErrorMessage(result.error.errors[0].message);
      }

      console.log(result.error.errors);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-white text-black">
      <Navbar />
      <div className="flex flex-col w-full h-full p-4 gap-4">
        <div
          id="ProfileCard"
          className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-8"
        >
          <p className="text-lg font-bold self-center">Iniciar sesion</p>
          <div className="w-full">
            <form
              className="flex flex-col w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();

                handleButtonClick();
              }}
            >
              <Input
                placeholder="Correo o Número"
                onInputChange={setEmail}
                error={emailError}
                isClicked={emailClicked}
                setIsClicked={setEmailClicked}
              />
              <Input
                placeholder="Contraseña"
                onInputChange={setPassword}
                error={passwordError}
                isClicked={passwordClicked}
                setIsClicked={setPasswordClicked}
                type="password"
              />
              <div className="mt-2">
                <Button
                  text="Iniciar sesion"
                  color="green"
                  selected
                  onClick={handleButtonClick}
                  submit
                />
              </div>
            </form>
          </div>
          <div className="flex flex-col w-full items-center gap-2">
            <p className="text-red-400">{errorMessage}</p>
            <p>¿No tienes cuenta?</p>
            <Link href={"/register"} className="text-verde-salud font-bold">
              Registrate aquí
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

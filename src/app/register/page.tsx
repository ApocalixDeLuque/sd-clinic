'use client';
import Link from 'next/link';
import Button from '../components/Button';
import Input from '../components/Input';
import Navbar from '../components/Navbar';
import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useClient } from '@/api/context';
import toast from 'react-hot-toast';
import { useSession } from '@/api/session';

export default function RegisterPage() {
  const router = useRouter();

  const { client } = useClient();
  const session = useSession();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [firstNameClicked, setFirstNameClicked] = useState(false);
  const [lastNameClicked, setLastNameClicked] = useState(false);
  const [emailClicked, setEmailClicked] = useState(false);
  const [phoneClicked, setPhoneClicked] = useState(false);
  const [passwordClicked, setPasswordClicked] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const schema = z.object({
    firstName: z.string().refine((value) => value.length >= 1, {
      message: 'Ingresa al menos un nombre válido',
      path: ['firstName'], // Esto es necesario para que el error se asocie correctamente con el campo
    }),
    lastName: z.string().refine((value) => value.length >= 1, {
      message: 'Ingresa al menos un apellido válido',
      path: ['lastName'],
    }),
    email: z.string().refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
      message: 'Ingresa un correo electrónico válido',
      path: ['email'],
    }),
    phone: z.string().refine((value) => value.startsWith('+52') && value.length === 13, {
      message: 'El número de teléfono debe comenzar con "+52" seguido de 10 dígitos',
      path: ['phone'],
    }),
    password: z.string().refine((value) => value.length >= 8, {
      message: 'Crea una contraseña de al menos 8 caracteres',
      path: ['password'],
    }),
  });

  const handleButtonClick = () => {
    console.log(phone.length);
    const result = schema.safeParse({ firstName, lastName, email, phone, password });

    if (result.success) {
      const f = async () => {
        const r = await client.auth.register({ name: `${firstName} ${lastName}`, email, phone, password }).submit();
        session.init(r.token);

        router.push('/perfil');
      };

      void toast
        .promise(f(), {
          loading: 'Registrando...',
          success: 'Registro exitoso',
          error: 'Error al registrar',
        })
        .then();
    } else {
      // En lugar de imprimir el error, establece el estado del error
      setFirstNameError(result.error.errors.some((err) => err.path[0] === 'firstName'));
      setLastNameError(result.error.errors.some((err) => err.path[0] === 'lastName'));
      setEmailError(result.error.errors.some((err) => err.path[0] === 'email'));
      setPhoneError(result.error.errors.some((err) => err.path[0] === 'phone'));
      setPasswordError(result.error.errors.some((err) => err.path[0] === 'password'));

      // Restablece los estados isClicked a false
      setFirstNameClicked(false);
      setLastNameClicked(false);
      setEmailClicked(false);
      setPhoneClicked(false);
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
        <div id="ProfileCard" className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-8">
          <p className="text-lg font-bold self-center">¿Cuál es tu nombre?</p>
          <div className="flex flex-col w-full gap-2">
            <Input
              placeholder="Nombre(s)"
              onInputChange={setFirstName}
              error={firstNameError}
              isClicked={firstNameClicked}
              setIsClicked={setFirstNameClicked}
            />
            <Input
              placeholder="Apellido(s)*"
              onInputChange={setLastName}
              error={lastNameError}
              isClicked={lastNameClicked}
              setIsClicked={setLastNameClicked}
            />
          </div>
          <p className="text-lg font-bold self-center">Compártenos tus datos de contacto</p>
          <div className="flex flex-col w-full gap-2">
            <Input
              placeholder="Correo Electrónico*"
              onInputChange={setEmail}
              error={emailError}
              isClicked={emailClicked}
              setIsClicked={setEmailClicked}
            />
            <Input
              placeholder="Teléfono"
              onInputChange={setPhone}
              error={phoneError}
              isClicked={phoneClicked}
              setIsClicked={setPhoneClicked}
            />
            <Input
              placeholder="Contraseña*"
              onInputChange={setPassword}
              error={passwordError}
              isClicked={passwordClicked}
              setIsClicked={setPasswordClicked}
            />
          </div>
          <Button text="Registrate" selected onClick={handleButtonClick} />
          <div className="flex flex-col w-full items-center gap-2">
            <p className="text-red-400">{errorMessage}</p>
            <p>¿Ya tienes cuenta?</p>
            <Link href={'/'} className="text-verde-salud font-bold">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

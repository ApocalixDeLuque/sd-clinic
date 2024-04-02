import Button from './components/Button';
import Navbar from './components/Navbar';
import SectionsMenu from './components/SectionsMenu';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white text-black">
      <Navbar />
      <div className="flex flex-col w-full p-4 gap-4">
        <div id="ProfileCard" className="flex flex-col w-full items-center justify-between border rounded-lg p-4 gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold">Iniciar sesion</p>
            <input type="text" placeholder="Correo" />
          </div>
          <Button text="Iniciar sesion" link="/perfil" />
        </div>
      </div>
    </main>
  );
}

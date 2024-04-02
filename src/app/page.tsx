import { faBars, faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      {/* Navbar */}
      <div id="Navbar" className="flex w-full items-center justify-between border-b p-4">
        <div className="aspect-[120/25]">
          <img src="/images/logo.png" alt="logo"></img>
        </div>
        <FontAwesomeIcon icon={faBars} className="aspect-square w-8" />
      </div>
      {/* Main Section */}
      <div className="flex flex-col w-full p-4">
        {/* Profile Card */}
        <div id="ProfileCard" className="flex w-full items-center justify-between border rounded-lg p-4 gap-2">
          <img src="/images/pfp.png" alt="logo"></img>
          <div className="flex flex-col gap-2">
            <p className="font-bold">Maria Fernanda Ramirez Gonzalez</p>
            <div>
              <p className="font-bold">Último ingreso:</p>
              <p>15/mar/2024 3:01:34 PM</p>
            </div>
          </div>
          <FontAwesomeIcon icon={faGear} className="aspect-square w-8 self-start" />
        </div>
      </div>
      <div>footer</div>
    </main>
  );
}

import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
  return (
    <div id="Navbar" className="flex w-full items-center justify-between border-b p-4">
      <div className="aspect-[120/25]">
        <img src="/images/logo.png" alt="logo" />
      </div>
      <FontAwesomeIcon icon={faBars} className="aspect-square w-8" />
    </div>
  );
};

export default Navbar;

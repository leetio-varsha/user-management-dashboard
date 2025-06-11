import { Link } from 'react-router-dom';

interface NavbarProps {
  title: string;
  links: { to: string; label: string }[];
}

export const Navbar: React.FC<NavbarProps> = ({ title, links }) => {
  return (
    <nav className="mb-6 flex items-center justify-between bg-gray-800 p-4">
      <div className="text-xl font-semibold">{title}</div>
      <div className="flex gap-4">
        {links.map((link, index) => (
          <Link key={index} to={link.to} className="transition hover:text-blue-400">
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

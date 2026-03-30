import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Phone, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Wellness', path: '/wellness' },
    { name: 'Voice', path: '/voice' },
  ];

  return (
    <nav className="sticky top-4 z-50 px-4">
      <motion.div
        className="max-w-5xl mx-auto glass rounded-full px-6 py-3 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-lavender flex items-center justify-center text-white shadow-lg">
            <HeartPulse size={20} />
          </div>
          <span className="font-heading font-bold text-xl text-primary drop-shadow-sm">SukoonAI</span>
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8 font-body">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                "transition-all duration-300 relative text-sm font-medium",
                location.pathname === link.path ? "text-primary" : "text-gray-500 hover:text-gray-900"
              )}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary rounded-full"
                  layoutId="nav-indicator"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Link
            to="/emergency"
            className="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 font-medium px-4 py-2 rounded-full transition-all duration-300"
          >
            <Phone size={16} />
            <span className="hidden sm:inline text-sm">Emergency</span>
          </Link>

          {user && (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm font-medium transition px-3 py-2 rounded-full hover:bg-gray-100/50"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </motion.div>
    </nav>
  );
}

export default Navbar;

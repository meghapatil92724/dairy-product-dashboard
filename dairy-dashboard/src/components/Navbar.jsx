import React from 'react';
import { Milk, Bell, Settings, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo-container">
            <Milk size={28} className="logo-icon" />
          </div>
          <h1 className="navbar-title">Dairy Dashboard</h1>
        </div>
        
        <div className="navbar-actions">
          <ThemeToggle />
          
          <button className="icon-btn">
            <Bell size={20} />
            <span className="badge">3</span>
          </button>
          
          <div className="user-profile">
            <div className="avatar">
              <UserIcon size={18} />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name || 'Admin'}</span>
              <span className="user-role">{user?.role || 'Manager'}</span>
            </div>
          </div>

          <button className="icon-btn logout-btn" onClick={logout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

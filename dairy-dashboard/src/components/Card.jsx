import React from 'react';
import * as Icons from 'lucide-react';
import './Card.css';

const Card = ({ title, value, subtitle, iconName }) => {
  const Icon = Icons[iconName] || Icons.HelpCircle;

  return (
    <div className="stat-card hover-lift fade-in">
      <div className="stat-card-content">
        <div className="stat-info">
          <h3 className="stat-title">{title}</h3>
          <p className="stat-value">{value}</p>
          {subtitle && <span className="stat-subtitle">{subtitle}</span>}
        </div>
        <div className="stat-icon-wrapper">
          <Icon size={24} className="stat-icon" />
        </div>
      </div>
      <div className="stat-progress-bar"></div>
    </div>
  );
};

export default Card;

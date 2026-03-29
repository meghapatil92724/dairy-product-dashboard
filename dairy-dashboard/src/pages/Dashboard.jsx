import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import BarChartComponent from '../components/BarChartComponent';
import PieChartComponent from '../components/PieChartComponent';
import Table from '../components/Table';
import Modal from '../components/Modal';
import ProductForm from '../components/ProductForm';
import Notification from '../components/Notification';
import { useProducts } from '../context/ProductContext';
import { downloadCSV } from '../utils/exportCsv';
import { Plus, Download, LayoutDashboard, Database, TrendingUp } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const { 
    products, 
    production, 
    distribution, 
    stats 
  } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleExport = () => {
    downloadCSV(products, 'dairy_inventory.csv');
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <Notification />
      
      <main className="dashboard-main">
        <header className="dashboard-header animate-on-load">
          <div className="header-info">
            <h2 className="dashboard-title">Dashboard Overview</h2>
            <p className="dashboard-subtitle">Monitor and manage your dairy farm operations in real-time.</p>
          </div>
          
          <div className="header-actions">
            <button className="btn btn-outline" onClick={handleExport}>
              <Download size={18} /> Export Data
            </button>
            <button className="btn btn-primary" onClick={handleAddProduct}>
              <Plus size={18} /> New Product
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div key={stat.id} style={{ animationDelay: `${index * 100}ms` }} className="animate-card">
              <Card 
                title={stat.title}
                value={stat.value}
                subtitle={stat.subtitle}
                iconName={stat.icon}
              />
            </div>
          ))}
        </section>

        {/* Analytics & Table Grid */}
        <div className="dashboard-grid dashboard-section">
          <section className="charts-column">
            <div className="section-card chart-wrapper">
              <BarChartComponent data={production} />
            </div>
            
            <div className="section-card chart-wrapper">
              <div className="chart-info">
                <PieChartComponent data={distribution} />
              </div>
            </div>
          </section>

          <section className="inventory-column">
            <div className="section-header">
              <div className="section-title">
                <Database size={20} className="section-icon" />
                <h3>Product Inventory</h3>
              </div>
            </div>
            <Table onEdit={handleEditProduct} />
          </section>
        </div>

        {/* Modals */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)}
          title={editingProduct ? 'Edit Product' : 'Add New Product'}
        >
          <ProductForm 
            product={editingProduct} 
            onSubmit={() => setIsModalOpen(false)} 
          />
        </Modal>
      </main>
    </div>
  );
};

export default Dashboard;

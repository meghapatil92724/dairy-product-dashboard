import React, { createContext, useContext, useState, useEffect } from 'react';
import { statsData as initialStats, productionData as initialProduction, distributionData as initialDistribution, productsList as initialProducts } from '../data/dummyData';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [production, setProduction] = useState(initialProduction);
  const [distribution, setDistribution] = useState(initialDistribution);
  const [stats, setStats] = useState(initialStats);
  const [notifications, setNotifications] = useState([]);

  // Mock: Initial notification for low stock
  useEffect(() => {
    const lowStock = products.filter(p => p.status === 'Low Stock' || p.status === 'Out of Stock');
    if (lowStock.length > 0) {
      addNotification(`Warning: ${lowStock.length} products have low/no stock!`, 'warning');
    }
  }, []);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const addProduct = (product) => {
    const newProduct = { ...product, id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1 };
    setProducts(prev => [newProduct, ...prev]);
    updateDistribution(newProduct.name, parseFloat(product.quantity) || 10);
    addNotification(`${product.name} added successfully!`, 'success');
  };

  const updateProduct = (updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    addNotification(`${updatedProduct.name} updated successfully!`, 'success');
  };

  const deleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addNotification(`${product?.name || 'Product'} deleted!`, 'error');
  };

  const updateDistribution = (name, value) => {
    // Simple mock update for distribution chart
    setDistribution(prev => {
      const existing = prev.find(d => d.name === name);
      if (existing) {
        return prev.map(d => d.name === name ? { ...d, value: d.value + value } : d);
      }
      return [...prev, { name, value }];
    });
  };

  return (
    <ProductContext.Provider value={{
      products, production, distribution, stats, notifications,
      addProduct, updateProduct, deleteProduct, addNotification
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);

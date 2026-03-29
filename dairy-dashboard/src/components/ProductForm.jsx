import React, { useState, useEffect } from 'react';
import { useProducts } from '../context/ProductContext';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit }) => {
  const { addProduct, updateProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    price: '',
    status: 'In Stock'
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (product) {
      updateProduct({ ...product, ...formData });
    } else {
      addProduct(formData);
    }
    onSubmit();
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Product Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          placeholder="e.g. Fresh Milk"
        />
      </div>
      <div className="form-group">
        <label htmlFor="quantity">Quantity</label>
        <input 
          type="text" 
          id="quantity" 
          name="quantity" 
          value={formData.quantity} 
          onChange={handleChange} 
          required 
          placeholder="e.g. 500 L"
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input 
            type="text" 
            id="price" 
            name="price" 
            value={formData.price} 
            onChange={handleChange} 
            required 
            placeholder="₹ 60/L"
          />
        </div>
        <div className="form-group">
          <label htmlFor="status">Stock Status</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange}>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary w-full">
          {product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;

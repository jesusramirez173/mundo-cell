import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle, PlusCircle, Check } from 'lucide-react';
import { PHONE_BRANDS, ACCESSORIES_CATEGORIES } from '../constants/brandsAndCategories';

export function ProductFormModal({ isOpen, onClose, onSave, productToEdit = null }) {
  const [brand, setBrand] = useState('Xiaomi');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Celulares');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('5');
  const [error, setError] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setBrand(productToEdit.brand || 'Xiaomi');
      setModel(productToEdit.model || '');
      setCategory(productToEdit.category || 'Celulares');
      setPrice(productToEdit.price !== undefined ? String(productToEdit.price) : '');
      setStock(productToEdit.stock !== undefined ? String(productToEdit.stock) : '0');
    } else {
      setBrand('Xiaomi');
      setModel('');
      setCategory('Celulares');
      setPrice('');
      setStock('5');
    }
    setError('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Strict numeric handler for price: strictly prevents letters, symbols, or invalid input
  const handlePriceKeyDown = (e) => {
    // Allow navigation, backspace, delete, tab, enter, arrow keys
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
    if (allowedKeys.includes(e.key)) return;

    // Allow decimal point only once
    if ((e.key === '.' || e.key === ',') && !price.includes('.')) {
      return;
    }

    // Only allow digits 0-9
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePriceChange = (e) => {
    let val = e.target.value.replace(',', '.');
    // Only accept numeric regex with optional decimal
    if (val === '' || /^\d*\.?\d*$/.test(val)) {
      setPrice(val);
    }
  };

  const handleStockChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setStock(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!model.trim()) {
      setError('Por favor ingresa el modelo o nombre del artículo');
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('El precio debe ser un número mayor a 0');
      return;
    }

    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      setError('Las unidades disponibles deben ser 0 o un número positivo');
      return;
    }

    onSave({
      id: productToEdit ? productToEdit.id : undefined,
      brand,
      model: model.trim(),
      category,
      price: numPrice,
      stock: numStock,
      createdAt: productToEdit ? productToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    onClose();
  };

  const parsedStock = parseInt(stock, 10);
  const isCriticalStock = !isNaN(parsedStock) && parsedStock < 2;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              {productToEdit ? <Save size={18} /> : <PlusCircle size={18} />}
            </div>
            <h3 className="modal-title">
              {productToEdit ? 'Modificar Artículo' : 'Nuevo Artículo al Inventario'}
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '10px 14px',
            color: '#f87171',
            fontSize: '13px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Categoría */}
          <div className="form-group">
            <label className="form-label">Categoría del Artículo</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                const newCat = e.target.value;
                setCategory(newCat);
                if (newCat !== 'Celulares') {
                  setBrand('Accesorios');
                } else if (brand === 'Accesorios') {
                  setBrand('Xiaomi');
                }
              }}
            >
              <option value="Celulares">📱 Celulares (Equipos)</option>
              <option value="Forros">🛡️ Forros (Protectores)</option>
              <option value="Audifonos">🎧 Audífonos</option>
              <option value="Cable USB">🔌 Cable USB</option>
              <option value="Router">📶 Router</option>
              <option value="Cornetas">🔊 Cornetas</option>
              <option value="Otros">📦 Otros Accesorios</option>
            </select>
          </div>

          {/* Marca */}
          <div className="form-group">
            <label className="form-label">Marca</label>
            {category === 'Celulares' ? (
              <select
                className="form-select"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              >
                {PHONE_BRANDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
                <option value="Samsung">Samsung</option>
                <option value="Realme">Realme</option>
                <option value="Honor">Honor</option>
                <option value="Otras">Otra Marca</option>
              </select>
            ) : (
              <input
                type="text"
                className="form-input"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Ej. Accesorios, Genérico, Baseus, TP-Link..."
              />
            )}
          </div>

          {/* Modelo */}
          <div className="form-group">
            <label className="form-label">Modelo / Descripción</label>
            <input
              type="text"
              className="form-input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder={category === 'Celulares' ? 'Ej. Redmi Note 13 256GB' : 'Ej. Cable Tipo C 65W 2M'}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Precio (SOLO NUMEROS) */}
            <div className="form-group">
              <label className="form-label">
                Precio USD ($) <span style={{ color: '#f59e0b', fontSize: '10px' }}>(Solo números)</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*[.]?[0-9]*"
                  className="form-input"
                  value={price}
                  onKeyDown={handlePriceKeyDown}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  style={{ paddingLeft: '28px', fontWeight: '700', fontSize: '15px' }}
                  required
                />
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  fontWeight: '700'
                }}>
                  $
                </span>
              </div>
            </div>

            {/* Unidades disponibles */}
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                Unidades en Stock
                {isCriticalStock && <span className="red-asterisk">*</span>}
              </label>
              <input
                type="text"
                inputMode="numeric"
                className="form-input"
                value={stock}
                onChange={handleStockChange}
                placeholder="0"
                style={{
                  fontWeight: '700',
                  fontSize: '15px',
                  borderColor: isCriticalStock ? '#ef4444' : undefined
                }}
                required
              />
            </div>
          </div>

          {/* Advertencia visual si stock < 2 */}
          {isCriticalStock && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <span className="red-asterisk" style={{ fontSize: '18px' }}>*</span>
              <span>
                <strong>Atención:</strong> Al tener menos de 2 unidades disponibles, el artículo mostrará un <strong>asterisco rojo (*)</strong> indicando stock crítico en inventario.
              </span>
            </div>
          )}

          {/* Botones de acción */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-gold"
              style={{ flex: 2 }}
            >
              <Save size={16} />
              {productToEdit ? 'Guardar Cambios' : 'Agregar al Inventario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

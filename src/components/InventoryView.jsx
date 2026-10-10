import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Edit2, Trash2, AlertCircle, 
  Package, Filter, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { BrandCarousel } from './BrandCarousel';
import { AccessoryCarousel } from './AccessoryCarousel';

export function InventoryView({
  products = [],
  exchangeRate = 62.50,
  onOpenAddModal,
  onEditProduct,
  onDeleteProduct
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);
  const [onlyCritical, setOnlyCritical] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Calculate counts for brands and accessories
  const counts = useMemo(() => {
    const c = { totalCelulares: 0, totalAcc: 0 };
    products.forEach((p) => {
      if (p.category === 'Celulares') {
        c.totalCelulares = (c.totalCelulares || 0) + 1;
        c[p.brand] = (c[p.brand] || 0) + 1;
      } else {
        c.totalAcc = (c.totalAcc || 0) + 1;
        c[p.category] = (c[p.category] || 0) + 1;
      }
    });
    return c;
  }, [products]);

  // Filter products according to active filters
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Text search
      const matchesSearch =
        p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Critical stock filter (< 2)
      if (onlyCritical && p.stock >= 2) return false;

      // Brand filter
      if (selectedBrand && (p.category !== 'Celulares' || p.brand !== selectedBrand)) {
        return false;
      }

      // Accessory category filter
      if (selectedAccessory) {
        if (selectedAccessory === 'ALL_ACC') {
          if (p.category === 'Celulares') return false;
        } else if (p.category !== selectedAccessory) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, selectedBrand, selectedAccessory, onlyCritical]);

  const criticalStockCount = products.filter((p) => p.stock < 2).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Top Banner & Fast Stats */}
      <div style={{ padding: '14px 16px 6px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
              Control de Inventario
            </h2>
            <p style={{ fontSize: '11.5px', color: '#94a3b8' }}>
              {products.length} artículos registrados en Mundo Cell
            </p>
          </div>

          <button className="btn-gold" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Agregar</span>
          </button>
        </div>

        {/* Quick Stock Status Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <div
            onClick={() => setOnlyCritical(false)}
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              background: !onlyCritical ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${!onlyCritical ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)'}`,
              color: !onlyCritical ? '#fbbf24' : '#94a3b8',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Package size={13} />
            <span>Todos ({products.length})</span>
          </div>

          <div
            onClick={() => setOnlyCritical(!onlyCritical)}
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              background: onlyCritical ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.08)',
              border: `1px solid ${onlyCritical ? '#ef4444' : 'rgba(239, 68, 68, 0.3)'}`,
              color: '#f87171',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span className="red-asterisk" style={{ fontSize: '14px' }}>*</span>
            <span>Stock Crítico &lt; 2 ({criticalStockCount})</span>
          </div>
        </div>
      </div>

      {/* Marcas de Celulares con Logos */}
      <BrandCarousel
        selectedBrand={selectedBrand}
        onSelectBrand={(b) => {
          setSelectedBrand(b);
          if (b) setSelectedAccessory(null); // clear accessory filter when selecting phone brand
        }}
        productCounts={counts}
      />

      {/* Apartado de Accesorios Desplazable */}
      <AccessoryCarousel
        selectedAccessory={selectedAccessory}
        onSelectAccessory={(a) => {
          setSelectedAccessory(a);
          if (a) setSelectedBrand(null); // clear phone brand filter when selecting accessory
        }}
        accessoryCounts={counts}
      />

      {/* Buscador */}
      <div className="search-wrapper">
        <Search size={16} className="search-icon-inside" />
        <input
          type="text"
          className="search-input-field"
          placeholder="Buscar por marca, modelo o categoría..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Lista de Artículos */}
      <div className="product-grid">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 4px 6px',
          fontSize: '11px',
          color: '#94a3b8',
          fontWeight: '700'
        }}>
          <span>MOSTRANDO {filteredProducts.length} ARTÍCULOS</span>
          {(selectedBrand || selectedAccessory || onlyCritical || searchQuery) && (
            <button
              onClick={() => {
                setSelectedBrand(null);
                setSelectedAccessory(null);
                setOnlyCritical(false);
                setSearchQuery('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#f59e0b',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Limpiar Filtros
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '36px 20px',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <Package size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ color: '#e2e8f0', fontSize: '15px', marginBottom: '6px' }}>
              No se encontraron artículos
            </h4>
            <p style={{ fontSize: '12px', maxWidth: '280px', margin: '0 auto 16px' }}>
              No hay productos que coincidan con la búsqueda o el filtro actual.
            </p>
            <button className="btn-gold" onClick={onOpenAddModal}>
              <Plus size={16} />
              <span>Agregar Nuevo Artículo</span>
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => {
            const isCritical = product.stock < 2;
            const priceBs = (product.price * exchangeRate).toFixed(2);

            return (
              <div
                key={product.id}
                className={`product-card ${isCritical ? 'has-critical-stock' : ''}`}
              >
                <div className="product-info-col">
                  {/* Etiqueta de Marca & Categoría */}
                  <div className="product-brand-tag">
                    <span>{product.brand}</span>
                    <span style={{ color: '#475569' }}>•</span>
                    <span style={{ color: '#94a3b8' }}>{product.category}</span>
                  </div>

                  {/* Modelo */}
                  <div className="product-model-text" title={product.model}>
                    {product.model}
                  </div>

                  {/* Precio en $ y Bs */}
                  <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '2px' }}>
                    <span className="product-price-tag">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="product-price-bs">
                      ≈ {priceBs} Bs
                    </span>
                  </div>

                  {/* Unidades disponibles con Asterisco Rojo si < 2 */}
                  <div style={{ marginTop: '4px' }}>
                    <div className={`stock-badge ${isCritical ? 'stock-critical' : 'stock-normal'}`}>
                      <span>Stock:</span>
                      <strong style={{ fontSize: '13px' }}>{product.stock}</strong>
                      <span style={{ fontSize: '11px' }}>unid.</span>

                      {/* ASTERISCO ROJO AL LADO SI MENOS DE 2 UNIDADES */}
                      {isCritical && (
                        <span
                          className="red-asterisk"
                          title="Menos de 2 unidades disponibles (Stock Crítico)"
                        >
                          *
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones: Modificar y Eliminar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginLeft: '12px' }}>
                  <button
                    className="btn-icon"
                    title="Modificar artículo"
                    onClick={() => onEditProduct(product)}
                    style={{ color: '#38bdf8' }}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    className="btn-icon"
                    title="Eliminar artículo"
                    onClick={() => setProductToDelete(product)}
                    style={{ color: '#f87171' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      {productToDelete && (
        <div className="modal-overlay" onClick={() => setProductToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ color: '#f87171' }}>
                Eliminar Artículo
              </h3>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '13.5px', marginBottom: '16px' }}>
              ¿Estás seguro de que deseas eliminar permanentemente <strong>{productToDelete.brand} {productToDelete.model}</strong> del inventario de Mundo Cell?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setProductToDelete(null)}
              >
                Cancelar
              </button>
              <button
                className="btn-danger"
                style={{ flex: 1 }}
                onClick={() => {
                  onDeleteProduct(productToDelete.id);
                  setProductToDelete(null);
                }}
              >
                <Trash2 size={16} />
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

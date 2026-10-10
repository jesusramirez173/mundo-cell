import React from 'react';
import { BRAND_LOGOS, PHONE_BRANDS } from '../constants/brandsAndCategories';
import { Smartphone } from 'lucide-react';

export function BrandCarousel({ selectedBrand, onSelectBrand, productCounts = {} }) {
  return (
    <div className="scroll-section">
      <div className="section-label">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Smartphone size={14} color="#f59e0b" />
          Marcas de Celulares
        </span>
        {selectedBrand && (
          <span
            onClick={() => onSelectBrand(null)}
            style={{ fontSize: '11px', color: '#f59e0b', cursor: 'pointer', fontWeight: '700' }}
          >
            Ver Todas
          </span>
        )}
      </div>

      <div className="horizontal-carousel">
        {/* "Todos" chip */}
        <div
          className={`brand-chip ${selectedBrand === null ? 'active' : ''}`}
          onClick={() => onSelectBrand(null)}
        >
          <div className="brand-svg-container" style={{
            background: selectedBrand === null ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            color: selectedBrand === null ? '#fbbf24' : '#94a3b8'
          }}>
            <span style={{ fontWeight: '900', fontSize: '13px' }}>ALL</span>
          </div>
          <span className="brand-name">Todos</span>
          <span style={{ fontSize: '10px', color: '#94a3b8' }}>
            {productCounts.totalCelulares || 0}
          </span>
        </div>

        {/* Brand chips with official SVG logos */}
        {PHONE_BRANDS.map((b) => {
          const LogoComponent = BRAND_LOGOS[b.id];
          const count = productCounts[b.id] || 0;
          const isActive = selectedBrand === b.id;

          return (
            <div
              key={b.id}
              className={`brand-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectBrand(isActive ? null : b.id)}
            >
              <div className="brand-svg-container">
                {LogoComponent ? <LogoComponent /> : <Smartphone size={28} />}
              </div>
              <span className="brand-name">{b.name}</span>
              <span style={{ fontSize: '10px', color: isActive ? '#fbbf24' : '#64748b', fontWeight: '600' }}>
                {count} {count === 1 ? 'modelo' : 'modelos'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

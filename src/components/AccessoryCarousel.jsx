import React from 'react';
import { ACCESSORIES_CATEGORIES } from '../constants/brandsAndCategories';
import { Shield, Headphones, Cable, Wifi, Speaker, Layers } from 'lucide-react';

const ICON_MAP = {
  Shield: Shield,
  Headphones: Headphones,
  Cable: Cable,
  Wifi: Wifi,
  Speaker: Speaker
};

export function AccessoryCarousel({ selectedAccessory, onSelectAccessory, accessoryCounts = {} }) {
  return (
    <div className="scroll-section">
      <div className="section-label">
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={14} color="#f59e0b" />
          Apartado de Accesorios (Deslizar)
        </span>
        {selectedAccessory && (
          <span
            onClick={() => onSelectAccessory(null)}
            style={{ fontSize: '11px', color: '#f59e0b', cursor: 'pointer', fontWeight: '700' }}
          >
            Ver Todos
          </span>
        )}
      </div>

      <div className="horizontal-carousel">
        {/* All Accessories chip */}
        <div
          className={`accessory-chip ${selectedAccessory === 'ALL_ACC' ? 'active' : ''}`}
          onClick={() => onSelectAccessory(selectedAccessory === 'ALL_ACC' ? null : 'ALL_ACC')}
        >
          <div className="accessory-icon-box">
            <Layers size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>
              Todos
            </span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>
              {accessoryCounts.totalAcc || 0} ítems
            </span>
          </div>
        </div>

        {/* Scrollable accessories: Forros, Audifonos, Cable USB, Router, Cornetas */}
        {ACCESSORIES_CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Layers;
          const isActive = selectedAccessory === cat.id;
          const count = accessoryCounts[cat.id] || 0;

          return (
            <div
              key={cat.id}
              className={`accessory-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectAccessory(isActive ? null : cat.id)}
            >
              <div className="accessory-icon-box">
                <IconComp size={16} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#f8fafc' }}>
                  {cat.name}
                </span>
                <span style={{ fontSize: '10px', color: isActive ? '#fbbf24' : '#64748b', fontWeight: '600' }}>
                  {count} {count === 1 ? 'disponible' : 'disponibles'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

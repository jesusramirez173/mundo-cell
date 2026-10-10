import React, { useState } from 'react';
import { DollarSign, Edit3, Check, Store } from 'lucide-react';

export function Header({ settings, onUpdateExchangeRate }) {
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState(settings?.exchangeRate || 62.50);

  const handleSaveRate = () => {
    const num = parseFloat(rateInput);
    if (!isNaN(num) && num > 0) {
      onUpdateExchangeRate(num);
      setIsEditingRate(false);
    }
  };

  return (
    <header className="glass-header">
      <div className="header-brand-container">
        <div className="header-brand-left">
          <img
            src="/logo.png"
            alt="Mundo Cell Logo"
            className="header-logo-img"
            onError={(e) => {
              // Fallback if image fails to load
              e.target.style.display = 'none';
            }}
          />
          <div>
            <h1 className="header-brand-title">{settings?.storeName || 'Mundo Cell'}</h1>
            <div className="header-brand-subtitle">
              <span className="badge-live-pulse" />
              <span>Inventario & Ventas Móvil</span>
            </div>
          </div>
        </div>

        {/* Tasa del Día Pill */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '12px',
          padding: '6px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          {isEditingRate ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#fbbf24', fontWeight: '700' }}>Bs/$</span>
              <input
                type="number"
                value={rateInput}
                onChange={(e) => setRateInput(e.target.value)}
                style={{
                  width: '54px',
                  background: '#0a0e17',
                  border: '1px solid #f59e0b',
                  color: '#fff',
                  borderRadius: '6px',
                  padding: '2px 4px',
                  fontSize: '12px',
                  fontWeight: '700'
                }}
                autoFocus
              />
              <button
                onClick={handleSaveRate}
                style={{
                  background: '#f59e0b',
                  color: '#000',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '3px',
                  cursor: 'pointer',
                  display: 'flex'
                }}
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setRateInput(settings?.exchangeRate || 62.50);
                setIsEditingRate(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
              title="Click para editar tasa de cambio"
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '9px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800' }}>
                  Tasa Hoy
                </span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24', fontFamily: 'Outfit, sans-serif' }}>
                  {settings?.exchangeRate?.toFixed(2) || '62.50'} Bs
                </span>
              </div>
              <Edit3 size={12} color="#f59e0b" style={{ opacity: 0.8 }} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

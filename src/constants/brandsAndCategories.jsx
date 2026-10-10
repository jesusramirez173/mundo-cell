import React from 'react';

// Brand logos in pure vector SVG with official brand colors and sleek styling
export const BRAND_LOGOS = {
  Xiaomi: () => (
    <svg viewBox="0 0 100 100" className="brand-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="#FF6900" />
      {/* Xiaomi MI emblem */}
      <path
        d="M28 32H38V68H28V32Z"
        fill="white"
      />
      <path
        d="M48 32H64C69.5 32 74 36.5 74 42V68H64V44C64 42.9 63.1 42 62 42H58V68H48V32Z"
        fill="white"
      />
      <rect x="38" y="47" width="10" height="7" fill="white" />
    </svg>
  ),

  Motorola: () => (
    <svg viewBox="0 0 100 100" className="brand-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#001489" />
      {/* Motorola M batwing emblem */}
      <path
        d="M50 36C45 44 38 60 26 64C33 59 38 48 42 36C40 47 34 60 48 64C48 58 48 52 50 36Z"
        fill="white"
      />
      <path
        d="M50 36C55 44 62 60 74 64C67 59 62 48 58 36C60 47 66 60 52 64C52 58 52 52 50 36Z"
        fill="white"
      />
    </svg>
  ),

  Infinix: () => (
    <svg viewBox="0 0 100 100" className="brand-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="#0B132B" stroke="#00FF87" strokeWidth="3" />
      {/* Infinix stylized infinity mark */}
      <path
        d="M30 40C24 40 20 44 20 50C20 56 24 60 30 60C38 60 45 40 54 40C60 40 64 44 64 50C64 56 60 60 54 60C46 60 39 40 30 40Z"
        stroke="#00FF87"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="50" y="80" textAnchor="middle" fill="#00FF87" fontSize="13" fontWeight="900" letterSpacing="1">
        INFINIX
      </text>
    </svg>
  ),

  Tecno: () => (
    <svg viewBox="0 0 100 100" className="brand-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="#0066FF" />
      {/* Tecno badge */}
      <text x="50" y="58" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" letterSpacing="2" fontFamily="sans-serif">
        TECNO
      </text>
      <circle cx="50" cy="74" r="3" fill="#00E5FF" />
    </svg>
  ),

  Iphone: () => (
    <svg viewBox="0 0 100 100" className="brand-svg" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="24" fill="#1C1C1E" stroke="#48484A" strokeWidth="2" />
      {/* Apple Logo */}
      <path
        d="M62 26C59.5 29 56 31 52.5 30.5C52 27 53.8 23.5 56.5 21C59.2 18.5 63 17 64 17C64.2 20.2 63.2 23.8 62 26Z"
        fill="#F5F5F7"
      />
      <path
        d="M68 62C65.5 66 63 70 59 70C55 70 53.5 67.5 49 67.5C44.5 67.5 42.5 70 39 70C35 70 32 65.5 29.5 61.5C24.5 53 22 42.5 27.5 35.5C30.5 31.5 35 29 40 29C44.5 29 47 31.5 50.5 31.5C54 31.5 56 29 61 29C64.5 29 69 31 72 34.5C65.5 38 65 47 71 50C69.5 54 67.5 58 68 62Z"
        fill="#F5F5F7"
      />
    </svg>
  )
};

export const PHONE_BRANDS = [
  { id: 'Xiaomi', name: 'Xiaomi', color: '#FF6900' },
  { id: 'Motorola', name: 'Motorola', color: '#001489' },
  { id: 'Infinix', name: 'Infinix', color: '#00FF87' },
  { id: 'Tecno', name: 'Tecno', color: '#0066FF' },
  { id: 'Iphone', name: 'iPhone', color: '#A2AAAD' }
];

export const ACCESSORIES_CATEGORIES = [
  { id: 'Forros', name: 'Forros', icon: 'Shield', description: 'Fundas y protectores antigolpes' },
  { id: 'Audifonos', name: 'Audífonos', icon: 'Headphones', description: 'Inalámbricos, Bluetooth y Diadema' },
  { id: 'Cable USB', name: 'Cable USB', icon: 'Cable', description: 'Tipo C, Lightning y Carga Rápida' },
  { id: 'Router', name: 'Router', icon: 'Wifi', description: 'Routers Wi-Fi y Portátiles 4G' },
  { id: 'Cornetas', name: 'Cornetas', icon: 'Speaker', description: 'Altavoces Bluetooth y Sonido' }
];

export const PAYMENT_METHODS = [
  { id: 'efectivo', label: 'Efectivo', currency: 'Bs/USD', icon: 'Banknote', color: '#10b981' },
  { id: 'divisa', label: 'Divisa', currency: 'USD ($)', icon: 'DollarSign', color: '#f59e0b' },
  { id: 'puntoDeVenta', label: 'Punto de Venta', currency: 'POS Débito/Crédito', icon: 'CreditCard', color: '#3b82f6' },
  { id: 'pagoMovil', label: 'Pago Móvil', currency: 'Bs Instantáneo', icon: 'Smartphone', color: '#8b5cf6' },
  { id: 'cashea', label: 'Cashea', currency: 'Cuotas sin interés', icon: 'Percent', color: '#eab308' },
  { id: 'weppa', label: 'Weppa', currency: 'Financiamiento Digital', icon: 'Zap', color: '#ec4899' }
];

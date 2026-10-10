import Dexie from 'dexie';

export const db = new Dexie('MundoCellDB');

// Database schema
db.version(1).stores({
  products: '++id, brand, model, category, price, stock, createdAt',
  sales: '++id, invoiceNumber, date, totalUSD, totalBS, clientName',
  cashClosures: '++id, closureNumber, date, closedAt, totalUSD',
  settings: 'id'
});

// Initial seed data for Mundo Cell
export const INITIAL_PRODUCTS = [
  // --- CELULARES ---
  {
    brand: 'Xiaomi',
    model: 'Redmi Note 13 (8GB/256GB)',
    category: 'Celulares',
    price: 185,
    stock: 6,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Xiaomi',
    model: 'Poco X6 Pro 5G (512GB)',
    category: 'Celulares',
    price: 310,
    stock: 1, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Motorola',
    model: 'Moto G84 5G (12GB/256GB)',
    category: 'Celulares',
    price: 195,
    stock: 5,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Motorola',
    model: 'Moto Edge 40 Neo OLED',
    category: 'Celulares',
    price: 280,
    stock: 1, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Infinix',
    model: 'Hot 40 Pro (8GB/256GB)',
    category: 'Celulares',
    price: 145,
    stock: 8,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Infinix',
    model: 'Note 40 Pro 70W FastCharge',
    category: 'Celulares',
    price: 215,
    stock: 0, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Tecno',
    model: 'Spark 20 Pro (8GB/256GB)',
    category: 'Celulares',
    price: 155,
    stock: 7,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Tecno',
    model: 'Camon 30 50MP Sony Sensor',
    category: 'Celulares',
    price: 220,
    stock: 1, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Iphone',
    model: 'iPhone 13 (128GB) Medianoche',
    category: 'Celulares',
    price: 520,
    stock: 4,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Iphone',
    model: 'iPhone 15 Pro (256GB) Titanio',
    category: 'Celulares',
    price: 990,
    stock: 1, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  },

  // --- ACCESORIOS ---
  // Forros
  {
    brand: 'Accesorios',
    model: 'Forro Antichoque Airbag Transparente',
    category: 'Forros',
    price: 6,
    stock: 25,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Accesorios',
    model: 'Forro Silicona MagSafe Velvet Touch',
    category: 'Forros',
    price: 12,
    stock: 1, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  },
  // Audífonos
  {
    brand: 'Accesorios',
    model: 'Audífonos Bluetooth F9 TWS con PowerBank',
    category: 'Audifonos',
    price: 10,
    stock: 18,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Accesorios',
    model: 'Audífonos Diadema Inalámbricos Extra Bass',
    category: 'Audifonos',
    price: 25,
    stock: 1, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  },
  // Cable USB
  {
    brand: 'Accesorios',
    model: 'Cable Tipo C Carga Ultra Rápida 65W 2M',
    category: 'Cable USB',
    price: 5,
    stock: 30,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Accesorios',
    model: 'Cable Lightning Reforzado en Nylon MFi',
    category: 'Cable USB',
    price: 7,
    stock: 1, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  },
  // Router
  {
    brand: 'Accesorios',
    model: 'Router Gigabit Doble Banda AC1200 4 Antenas',
    category: 'Router',
    price: 38,
    stock: 5,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Accesorios',
    model: 'Mini Router Móvil 4G LTE Batería Recargable',
    category: 'Router',
    price: 45,
    stock: 1, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  },
  // Cornetas
  {
    brand: 'Accesorios',
    model: 'Corneta Bluetooth Resistente al Agua IPX7',
    category: 'Cornetas',
    price: 24,
    stock: 9,
    createdAt: new Date().toISOString()
  },
  {
    brand: 'Accesorios',
    model: 'Corneta Torre Bazooka con Luces RGB y Micrófono',
    category: 'Cornetas',
    price: 58,
    stock: 1, // < 2 unidades -> alerta roja *
    createdAt: new Date().toISOString()
  }
];

export async function initDatabase() {
  const count = await db.products.count();
  if (count === 0) {
    await db.products.bulkAdd(INITIAL_PRODUCTS);
  }

  const settings = await db.settings.get('config');
  if (!settings) {
    await db.settings.put({
      id: 'config',
      storeName: 'Mundo Cell',
      exchangeRate: 62.50, // Tasa referencial Bs/$
      currencySymbol: '$',
      secondaryCurrency: 'Bs',
      phone: '+58 412 000 0000',
      address: 'Centro Comercial, Local Mundo Cell'
    });
  }
}

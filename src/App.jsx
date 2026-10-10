import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Package, DollarSign, Settings as SettingsIcon, 
  Smartphone, Plus, ArrowUpRight 
} from 'lucide-react';
import { db, initDatabase } from './db/db';
import { Header } from './components/Header';
import { InventoryView } from './components/InventoryView';
import { SalesPOSView } from './components/SalesPOSView';
import { CashClosingView } from './components/CashClosingView';
import { SettingsAndBackupView } from './components/SettingsAndBackupView';
import { ProductFormModal } from './components/ProductFormModal';
import { ReceiptModal } from './components/ReceiptModal';

export function App() {
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'pos' | 'cash' | 'settings'
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [cashClosures, setCashClosures] = useState([]);
  const [settings, setSettings] = useState({
    storeName: 'Mundo Cell',
    exchangeRate: 62.50,
    phone: '+58 412 000 0000',
    address: 'Venezuela'
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [receiptSale, setReceiptSale] = useState(null);

  // Initialize Dexie database and load records
  const loadData = async () => {
    try {
      await initDatabase();
      const loadedProducts = await db.products.toArray();
      const loadedSales = await db.sales.toArray();
      const loadedClosures = await db.cashClosures.toArray();
      const loadedConfig = await db.settings.get('config');

      setProducts(loadedProducts);
      setSales(loadedSales);
      setCashClosures(loadedClosures);
      if (loadedConfig) setSettings(loadedConfig);
    } catch (err) {
      console.error('Error cargando datos de Mundo Cell:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Exchange Rate
  const handleUpdateExchangeRate = async (newRate) => {
    const updated = { ...settings, exchangeRate: newRate };
    await db.settings.put(updated);
    setSettings(updated);
  };

  // Add or Edit Product
  const handleSaveProduct = async (productData) => {
    if (productData.id) {
      // Modificar existente
      await db.products.update(productData.id, productData);
    } else {
      // Agregar nuevo
      await db.products.add(productData);
    }
    const updatedProducts = await db.products.toArray();
    setProducts(updatedProducts);
    setProductToEdit(null);
    setIsAddModalOpen(false);
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    await db.products.delete(productId);
    const updatedProducts = await db.products.toArray();
    setProducts(updatedProducts);
  };

  // Process Completed Sale: saves sale and decreases product stock in DB
  const handleCompleteSale = async (saleData) => {
    // 1. Guardar la venta
    const saleId = await db.sales.add(saleData);
    saleData.id = saleId;

    // 2. Disminuir unidades disponibles de cada producto en inventario
    for (const item of saleData.items) {
      const prod = await db.products.get(item.productId);
      if (prod) {
        const newStock = Math.max(0, prod.stock - item.quantity);
        await db.products.update(item.productId, { stock: newStock });
      }
    }

    // 3. Recargar datos
    const [updatedProducts, updatedSales] = await Promise.all([
      db.products.toArray(),
      db.sales.toArray()
    ]);
    setProducts(updatedProducts);
    setSales(updatedSales);

    // 4. Mostrar recibo digital
    setReceiptSale(saleData);
  };

  // Save Cash Closure
  const handleSaveClosure = async (closureData) => {
    await db.cashClosures.add(closureData);
    const updatedClosures = await db.cashClosures.toArray();
    setCashClosures(updatedClosures);
  };

  return (
    <div className="app-viewport">
      {/* App Header */}
      <Header
        settings={settings}
        onUpdateExchangeRate={handleUpdateExchangeRate}
      />

      {/* Main View Router */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'inventory' && (
          <InventoryView
            products={products}
            exchangeRate={settings.exchangeRate}
            onOpenAddModal={() => {
              setProductToEdit(null);
              setIsAddModalOpen(true);
            }}
            onEditProduct={(prod) => {
              setProductToEdit(prod);
              setIsAddModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'pos' && (
          <SalesPOSView
            products={products}
            exchangeRate={settings.exchangeRate}
            onCompleteSale={handleCompleteSale}
          />
        )}

        {activeTab === 'cash' && (
          <CashClosingView
            sales={sales}
            cashClosures={cashClosures}
            exchangeRate={settings.exchangeRate}
            onSaveClosure={handleSaveClosure}
            onViewReceipt={(sale) => setReceiptSale(sale)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsAndBackupView
            settings={settings}
            onUpdateSettings={setSettings}
            onDatabaseReload={loadData}
          />
        )}
      </main>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="bottom-nav">
        <button
          className={`nav-tab-button ${activeTab === 'pos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pos')}
        >
          <div className="nav-icon-container">
            <ShoppingBag size={20} />
          </div>
          <span>Vender (POS)</span>
        </button>

        <button
          className={`nav-tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <div className="nav-icon-container">
            <Package size={20} />
          </div>
          <span>Inventario</span>
        </button>

        <button
          className={`nav-tab-button ${activeTab === 'cash' ? 'active' : ''}`}
          onClick={() => setActiveTab('cash')}
        >
          <div className="nav-icon-container">
            <DollarSign size={20} />
          </div>
          <span>Cierre Caja</span>
        </button>

        <button
          className={`nav-tab-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <div className="nav-icon-container">
            <SettingsIcon size={20} />
          </div>
          <span>Ajustes / BD</span>
        </button>
      </nav>

      {/* Modal Agregar / Modificar Producto */}
      <ProductFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />

      {/* Modal Recibo de Venta */}
      <ReceiptModal
        sale={receiptSale}
        onClose={() => setReceiptSale(null)}
        settings={settings}
      />
    </div>
  );
}

export default App;

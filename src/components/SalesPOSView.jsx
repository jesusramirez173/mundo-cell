import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, Plus, Minus, Trash2, CheckCircle2, 
  ArrowRight, Search, DollarSign, Smartphone, X, 
  Receipt, Sparkles, User, Phone, Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BrandCarousel } from './BrandCarousel';
import { AccessoryCarousel } from './AccessoryCarousel';
import { PAYMENT_METHODS } from '../constants/brandsAndCategories';

export function SalesPOSView({
  products = [],
  exchangeRate = 62.50,
  onCompleteSale
}) {
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedAccessory, setSelectedAccessory] = useState(null);

  // Checkout payment form state
  const [payments, setPayments] = useState({
    efectivo: 0,
    divisa: 0,
    puntoDeVenta: 0,
    pagoMovil: 0,
    cashea: 0,
    weppa: 0
  });

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentError, setPaymentError] = useState('');

  // Brand / category counts
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

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedBrand && (p.category !== 'Celulares' || p.brand !== selectedBrand)) {
        return false;
      }

      if (selectedAccessory) {
        if (selectedAccessory === 'ALL_ACC') {
          if (p.category === 'Celulares') return false;
        } else if (p.category !== selectedAccessory) {
          return false;
        }
      }

      return true;
    });
  }, [products, searchQuery, selectedBrand, selectedAccessory]);

  // Cart calculation
  const cartTotalUSD = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const cartTotalBS = (cartTotalUSD * exchangeRate).toFixed(2);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Add item to cart
  const addToCart = (product) => {
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert(`No hay más unidades disponibles de este artículo (Stock: ${product.stock})`);
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Update quantity in cart
  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === productId);
      if (!item) return prev;

      const product = products.find((p) => p.id === productId);
      const newQty = item.quantity + delta;

      if (newQty <= 0) {
        return prev.filter((i) => i.id !== productId);
      }

      if (product && newQty > product.stock) {
        alert(`No hay más unidades disponibles en stock (Stock: ${product.stock})`);
        return prev;
      }

      return prev.map((i) => (i.id === productId ? { ...i, quantity: newQty } : i));
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  // Open checkout modal & preset default payment
  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    setPayments({
      efectivo: 0,
      divisa: cartTotalUSD, // default full divisa
      puntoDeVenta: 0,
      pagoMovil: 0,
      cashea: 0,
      weppa: 0
    });
    setPaymentError('');
    setIsCheckoutOpen(true);
  };

  // Sum of entered payments
  const totalPaidUSD = useMemo(() => {
    return (
      (parseFloat(payments.efectivo) || 0) +
      (parseFloat(payments.divisa) || 0) +
      (parseFloat(payments.puntoDeVenta) || 0) +
      (parseFloat(payments.pagoMovil) || 0) +
      (parseFloat(payments.cashea) || 0) +
      (parseFloat(payments.weppa) || 0)
    );
  }, [payments]);

  const difference = (cartTotalUSD - totalPaidUSD);

  // Set single payment to 100% of the total
  const setQuickMethod = (methodId) => {
    setPayments({
      efectivo: methodId === 'efectivo' ? cartTotalUSD : 0,
      divisa: methodId === 'divisa' ? cartTotalUSD : 0,
      puntoDeVenta: methodId === 'puntoDeVenta' ? cartTotalUSD : 0,
      pagoMovil: methodId === 'pagoMovil' ? cartTotalUSD : 0,
      cashea: methodId === 'cashea' ? cartTotalUSD : 0,
      weppa: methodId === 'weppa' ? cartTotalUSD : 0
    });
  };

  // Process and save sale
  const handleConfirmSale = () => {
    if (Math.abs(difference) > 0.05) {
      setPaymentError(`El total pagado ($${totalPaidUSD.toFixed(2)}) debe coincidir con el total de la venta ($${cartTotalUSD.toFixed(2)})`);
      return;
    }

    const saleData = {
      invoiceNumber: `MC-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString(),
      items: cart.map((i) => ({
        productId: i.id,
        brand: i.brand,
        model: i.model,
        category: i.category,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.price * i.quantity
      })),
      totalUSD: cartTotalUSD,
      totalBS: parseFloat(cartTotalBS),
      exchangeRate,
      payments: {
        efectivo: parseFloat(payments.efectivo) || 0,
        divisa: parseFloat(payments.divisa) || 0,
        puntoDeVenta: parseFloat(payments.puntoDeVenta) || 0,
        pagoMovil: parseFloat(payments.pagoMovil) || 0,
        cashea: parseFloat(payments.cashea) || 0,
        weppa: parseFloat(payments.weppa) || 0
      },
      clientName: clientName.trim() || 'Cliente Mostrador',
      clientPhone: clientPhone.trim() || '',
      notes: notes.trim()
    };

    onCompleteSale(saleData);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      // ignore
    }

    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {/* Top Banner */}
      <div style={{ padding: '14px 16px 4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
              Punto de Venta (POS)
            </h2>
            <p style={{ fontSize: '11.5px', color: '#94a3b8' }}>
              Toca un artículo para añadirlo a la venta
            </p>
          </div>

          {cart.length > 0 && (
            <button
              className="btn-gold"
              onClick={handleOpenCheckout}
              style={{ padding: '8px 14px' }}
            >
              <ShoppingCart size={15} />
              <span>Cobrar (${cartTotalUSD.toFixed(2)})</span>
            </button>
          )}
        </div>
      </div>

      {/* Marcas de Celulares con Logos */}
      <BrandCarousel
        selectedBrand={selectedBrand}
        onSelectBrand={(b) => {
          setSelectedBrand(b);
          if (b) setSelectedAccessory(null);
        }}
        productCounts={counts}
      />

      {/* Apartado de Accesorios Desplazable */}
      <AccessoryCarousel
        selectedAccessory={selectedAccessory}
        onSelectAccessory={(a) => {
          setSelectedAccessory(a);
          if (a) setSelectedBrand(null);
        }}
        accessoryCounts={counts}
      />

      {/* Buscador */}
      <div className="search-wrapper">
        <Search size={16} className="search-icon-inside" />
        <input
          type="text"
          className="search-input-field"
          placeholder="Buscar para vender celular o accesorio..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Catálogo de Productos Táctiles */}
      <div className="product-grid">
        {filteredProducts.map((product) => {
          const isCritical = product.stock < 2;
          const isOutOfStock = product.stock <= 0;
          const cartItem = cart.find((i) => i.id === product.id);
          const inCartCount = cartItem ? cartItem.quantity : 0;
          const priceBs = (product.price * exchangeRate).toFixed(2);

          return (
            <div
              key={product.id}
              className={`product-card ${isCritical ? 'has-critical-stock' : ''}`}
              style={{
                opacity: isOutOfStock ? 0.6 : 1,
                cursor: isOutOfStock ? 'not-allowed' : 'pointer'
              }}
              onClick={() => !isOutOfStock && addToCart(product)}
            >
              <div className="product-info-col">
                <div className="product-brand-tag">
                  <span>{product.brand}</span>
                  <span style={{ color: '#475569' }}>•</span>
                  <span>{product.category}</span>
                </div>
                <div className="product-model-text" title={product.model}>
                  {product.model}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', marginTop: '2px' }}>
                  <span className="product-price-tag">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="product-price-bs">
                    ≈ {priceBs} Bs
                  </span>
                </div>
                <div style={{ marginTop: '4px' }}>
                  <div className={`stock-badge ${isCritical ? 'stock-critical' : 'stock-normal'}`}>
                    <span>Stock: {product.stock}</span>
                    {/* ASTERISCO ROJO SI MENOS DE 2 UNIDADES */}
                    {isCritical && (
                      <span className="red-asterisk" title="Menos de 2 unidades disponibles">*</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de Añadir o Contador en Carrito */}
              <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center' }}>
                {inCartCount > 0 ? (
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      border: '1.5px solid #f59e0b',
                      borderRadius: '12px',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => updateQuantity(product.id, -1)}
                      style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontWeight: '800', color: '#fff', fontSize: '14px' }}>
                      {inCartCount}
                    </span>
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn-gold"
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      borderRadius: '12px',
                      opacity: isOutOfStock ? 0.4 : 1
                    }}
                    disabled={isOutOfStock}
                  >
                    {isOutOfStock ? 'Agotado' : '+ Vender'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Cart Bar (if items in cart) */}
      {cart.length > 0 && !isCheckoutOpen && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 24px)',
          maxWidth: '476px',
          background: 'linear-gradient(135deg, #131b2e 0%, #0c101d 100%)',
          border: '1.5px solid #f59e0b',
          borderRadius: '18px',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.8), 0 0 20px rgba(245, 158, 11, 0.3)',
          zIndex: 45
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
              Carrito ({totalItemsCount} {totalItemsCount === 1 ? 'artículo' : 'artículos'})
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '20px', fontWeight: '900', color: '#fbbf24', fontFamily: 'Outfit' }}>
                ${cartTotalUSD.toFixed(2)}
              </span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                ≈ {cartTotalBS} Bs
              </span>
            </div>
          </div>

          <button className="btn-gold" onClick={handleOpenCheckout}>
            <span>Cobrar</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Modal de Cobro / Procesar Venta */}
      {isCheckoutOpen && (
        <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '92vh' }}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Cobrar Venta</h3>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {totalItemsCount} artículos en la orden
                </span>
              </div>
              <button className="btn-icon" onClick={() => setIsCheckoutOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Resumen Total */}
            <div className="fin-card fin-card-highlight" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1' }}>
                  Total a Cobrar:
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#fbbf24', fontFamily: 'Outfit' }}>
                    ${cartTotalUSD.toFixed(2)} USD
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    ≈ {cartTotalBS} Bolívares (Tasa: {exchangeRate} Bs)
                  </div>
                </div>
              </div>
            </div>

            {/* Desglose de Artículos en Carrito */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '10px 14px',
              marginBottom: '16px',
              maxHeight: '120px',
              overflowY: 'auto'
            }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    fontSize: '12.5px'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: '700', color: '#f8fafc' }}>{item.quantity}x</span>{' '}
                    <span>{item.brand} {item.model}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '700', color: '#38bdf8' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SELECCIÓN Y DESGLOSE DE MÉTODOS DE PAGO:
                Efectivo, Divisa, Punto de venta, Pago Movil, Cashea Y Weppa */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Métodos de Pago
                </label>
                <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>
                  Puedes pagar con uno o combinar varios
                </span>
              </div>

              {/* Botones de selección rápida 100% */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
                {PAYMENT_METHODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setQuickMethod(m.id)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: m.color,
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Todo en {m.label}
                  </button>
                ))}
              </div>

              {/* Campos individuales de cada método de pago */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {PAYMENT_METHODS.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '8px 10px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: m.color }}>
                        {m.label}
                      </span>
                      <span style={{ fontSize: '9px', color: '#64748b' }}>
                        {m.currency}
                      </span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="form-input"
                        style={{ padding: '6px 8px 6px 20px', fontSize: '13px', fontWeight: '700' }}
                        value={payments[m.id] || ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          setPayments((prev) => ({ ...prev, [m.id]: val }));
                        }}
                        placeholder="0.00"
                      />
                      <span style={{
                        position: 'absolute',
                        left: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '12px',
                        color: '#64748b'
                      }}>
                        $
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verificación de Cuadre del Cobro */}
            <div style={{
              background: Math.abs(difference) <= 0.05 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${Math.abs(difference) <= 0.05 ? '#10b981' : '#ef4444'}`,
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              fontSize: '12px'
            }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Total ingresado: </span>
                <strong style={{ color: '#fff', fontSize: '13px' }}>${totalPaidUSD.toFixed(2)}</strong>
              </div>
              <div>
                {Math.abs(difference) <= 0.05 ? (
                  <span style={{ color: '#34d399', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Pago Cuadrado
                  </span>
                ) : (
                  <span style={{ color: '#f87171', fontWeight: '700' }}>
                    {difference > 0 ? `Faltan $${difference.toFixed(2)}` : `Sobra $${Math.abs(difference).toFixed(2)}`}
                  </span>
                )}
              </div>
            </div>

            {paymentError && (
              <div style={{ color: '#f87171', fontSize: '12px', marginBottom: '12px', fontWeight: '600' }}>
                {paymentError}
              </div>
            )}

            {/* Datos opcionales del cliente */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label className="form-label">Cliente (Opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '12px' }}
                  placeholder="Nombre del cliente"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">Teléfono (WhatsApp)</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '12px' }}
                  placeholder="0412-0000000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setIsCheckoutOpen(false)}
              >
                Volver
              </button>
              <button
                type="button"
                className="btn-gold"
                style={{ flex: 2 }}
                onClick={handleConfirmSale}
                disabled={Math.abs(difference) > 0.05}
              >
                <CheckCircle2 size={16} />
                Completar Venta (${cartTotalUSD.toFixed(2)})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

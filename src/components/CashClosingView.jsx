import React, { useState, useMemo } from 'react';
import { 
  DollarSign, Calendar, Lock, CheckCircle, AlertTriangle, 
  Share2, Printer, History, RefreshCw, FileText, TrendingUp 
} from 'lucide-react';
import { PAYMENT_METHODS } from '../constants/brandsAndCategories';

export function CashClosingView({
  sales = [],
  cashClosures = [],
  exchangeRate = 62.50,
  onSaveClosure,
  onViewReceipt
}) {
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  const [physicalDivisa, setPhysicalDivisa] = useState('');
  const [physicalEfectivo, setPhysicalEfectivo] = useState('');
  const [closureNotes, setClosureNotes] = useState('');
  const [isConfirmingClosure, setIsConfirmingClosure] = useState(false);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' | 'history'

  // Filter sales for the selected date
  const daySales = useMemo(() => {
    return sales.filter((s) => s.date.slice(0, 10) === selectedDate);
  }, [sales, selectedDate]);

  // Aggregate totals and payment method breakdowns for the selected day
  const daySummary = useMemo(() => {
    let totalUSD = 0;
    let totalBS = 0;
    const methods = {
      efectivo: 0,
      divisa: 0,
      puntoDeVenta: 0,
      pagoMovil: 0,
      cashea: 0,
      weppa: 0
    };

    daySales.forEach((s) => {
      totalUSD += s.totalUSD || 0;
      totalBS += s.totalBS || (s.totalUSD * exchangeRate);

      if (s.payments) {
        methods.efectivo += s.payments.efectivo || 0;
        methods.divisa += s.payments.divisa || 0;
        methods.puntoDeVenta += s.payments.puntoDeVenta || 0;
        methods.pagoMovil += s.payments.pagoMovil || 0;
        methods.cashea += s.payments.cashea || 0;
        methods.weppa += s.payments.weppa || 0;
      }
    });

    return {
      totalUSD,
      totalBS,
      salesCount: daySales.length,
      methods
    };
  }, [daySales, exchangeRate]);

  // Physical cash difference calculation
  const enteredDivisa = parseFloat(physicalDivisa) || 0;
  const divisaDiff = enteredDivisa - daySummary.methods.divisa;

  const enteredEfectivo = parseFloat(physicalEfectivo) || 0;
  const efectivoDiff = enteredEfectivo - daySummary.methods.efectivo;

  // Execute Cash Closing
  const handlePerformClosure = () => {
    const closureData = {
      closureNumber: `CC-${Date.now().toString().slice(-6)}`,
      date: selectedDate,
      closedAt: new Date().toISOString(),
      salesCount: daySummary.salesCount,
      totalUSD: daySummary.totalUSD,
      totalBS: daySummary.totalBS,
      exchangeRate,
      breakdown: { ...daySummary.methods },
      physicalCashCounted: {
        divisa: enteredDivisa,
        efectivo: enteredEfectivo
      },
      difference: {
        divisa: divisaDiff,
        efectivo: efectivoDiff
      },
      status: 'CLOSED',
      notes: closureNotes.trim()
    };

    onSaveClosure(closureData);
    setIsConfirmingClosure(false);
    setPhysicalDivisa('');
    setPhysicalEfectivo('');
    setClosureNotes('');
    alert('¡Cierre de Caja ejecutado y archivado exitosamente!');
  };

  // WhatsApp share generator
  const handleShareWhatsApp = (closure = null) => {
    const data = closure || {
      date: selectedDate,
      totalUSD: daySummary.totalUSD,
      totalBS: daySummary.totalBS,
      salesCount: daySummary.salesCount,
      breakdown: daySummary.methods
    };

    const text = `*📊 CIERRE DE CAJA - MUNDO CELL*
📅 *Fecha:* ${data.date}
🛒 *Ventas Realizadas:* ${data.salesCount} transacciones
💰 *TOTAL VENTAS:* $${data.totalUSD.toFixed(2)} USD (≈ ${(data.totalUSD * exchangeRate).toFixed(2)} Bs)

*DESGLOSE POR MÉTODO DE PAGO:*
💵 *Efectivo:* $${(data.breakdown?.efectivo || 0).toFixed(2)}
💲 *Divisa ($):* $${(data.breakdown?.divisa || 0).toFixed(2)}
💳 *Punto de Venta:* $${(data.breakdown?.puntoDeVenta || 0).toFixed(2)}
📲 *Pago Móvil:* $${(data.breakdown?.pagoMovil || 0).toFixed(2)}
⚡ *Cashea:* $${(data.breakdown?.cashea || 0).toFixed(2)}
🟣 *Weppa:* $${(data.breakdown?.weppa || 0).toFixed(2)}

_Reporte generado automáticamente por Mundo Cell App._`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px 20px' }}>
      {/* Title & Date Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
            Venta del Día y Cierre de Caja
          </h2>
          <p style={{ fontSize: '11.5px', color: '#94a3b8' }}>
            Auditoría de ingresos y desglose por formas de pago
          </p>
        </div>

        {/* Date input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              background: '#0a0e17',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              borderRadius: '10px',
              padding: '6px 8px',
              fontSize: '11.5px',
              fontWeight: '600'
            }}
          />
        </div>
      </div>

      {/* Tabs: Venta del Día vs Historial de Cierres */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '14px',
        padding: '4px',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('daily')}
          style={{
            padding: '8px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'daily' ? '#f59e0b' : 'transparent',
            color: activeTab === 'daily' ? '#000' : '#94a3b8',
            fontWeight: '700',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Venta del Día
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            padding: '8px',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'history' ? '#f59e0b' : 'transparent',
            color: activeTab === 'history' ? '#000' : '#94a3b8',
            fontWeight: '700',
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Historial de Cierres ({cashClosures.length})
        </button>
      </div>

      {activeTab === 'daily' ? (
        <>
          {/* Tarjeta Destacada: TOTAL VENTA DEL DÍA */}
          <div className="fin-card fin-card-highlight">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '800' }}>
                  Total Ventas del Día
                </span>
                <div style={{ fontSize: '28px', fontWeight: '900', color: '#fbbf24', fontFamily: 'Outfit' }}>
                  ${daySummary.totalUSD.toFixed(2)}
                </div>
                <div style={{ fontSize: '12.5px', color: '#cbd5e1' }}>
                  ≈ {daySummary.totalBS.toFixed(2)} Bolívares
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '6px 12px',
                  display: 'inline-block'
                }}>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: '#34d399' }}>
                    {daySummary.salesCount}
                  </span>
                  <div style={{ fontSize: '9px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700' }}>
                    {daySummary.salesCount === 1 ? 'Venta' : 'Ventas'}
                  </div>
                </div>
              </div>
            </div>

            {/* Acciones de reporte */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                onClick={() => handleShareWhatsApp()}
              >
                <Share2 size={14} color="#25D366" />
                <span>Enviar WhatsApp</span>
              </button>
              <button
                className="btn-gold"
                style={{ flex: 1, padding: '8px', fontSize: '12px' }}
                onClick={() => setIsConfirmingClosure(true)}
              >
                <Lock size={14} />
                <span>Cerrar Caja</span>
              </button>
            </div>
          </div>

          {/* DESGLOSE EXACTO POR MÉTODO DE PAGO:
              Efectivo, Divisa, Punto de venta, Pago Movil, Cashea Y Weppa */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>
              Desglose de Ingresos por Método de Pago
            </div>

            <div className="payment-grid">
              {PAYMENT_METHODS.map((m) => {
                const amountUSD = daySummary.methods[m.id] || 0;
                const amountBS = (amountUSD * exchangeRate).toFixed(2);
                const percent = daySummary.totalUSD > 0
                  ? ((amountUSD / daySummary.totalUSD) * 100).toFixed(0)
                  : 0;

                return (
                  <div key={m.id} className="payment-method-card">
                    <div className="payment-method-name">
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: m.color }} />
                      <span style={{ color: '#fff', fontSize: '12px' }}>{m.label}</span>
                    </div>

                    <div className="payment-method-value" style={{ color: m.color }}>
                      ${amountUSD.toFixed(2)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
                      <span>≈ {amountBS} Bs</span>
                      <span style={{ fontWeight: '700', color: '#94a3b8' }}>{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ARQUEO DE CAJA FÍSICO (Auditoría de gaveta) */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '18px',
            padding: '16px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc', marginBottom: '6px' }}>
              Arqueo de Efectivo Físico en Gaveta
            </h4>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '14px' }}>
              Ingresa el conteo físico de dinero en la gaveta para calcular el cuadre:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ color: '#f59e0b' }}>
                  Divisas Físicas ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={physicalDivisa}
                  onChange={(e) => setPhysicalDivisa(e.target.value)}
                />
                <div style={{ fontSize: '11px', marginTop: '4px', color: '#94a3b8' }}>
                  Sistema: ${daySummary.methods.divisa.toFixed(2)}
                </div>
                {physicalDivisa !== '' && (
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: Math.abs(divisaDiff) < 0.05 ? '#34d399' : '#f87171'
                  }}>
                    {Math.abs(divisaDiff) < 0.05
                      ? '✓ Cuadre perfecto'
                      : divisaDiff > 0
                        ? `Sobra: +$${divisaDiff.toFixed(2)}`
                        : `Falta: -$${Math.abs(divisaDiff).toFixed(2)}`}
                  </div>
                )}
              </div>

              <div>
                <label className="form-label" style={{ color: '#10b981' }}>
                  Efectivo Bs en Gaveta ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="0.00"
                  value={physicalEfectivo}
                  onChange={(e) => setPhysicalEfectivo(e.target.value)}
                />
                <div style={{ fontSize: '11px', marginTop: '4px', color: '#94a3b8' }}>
                  Sistema: ${daySummary.methods.efectivo.toFixed(2)}
                </div>
                {physicalEfectivo !== '' && (
                  <div style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: Math.abs(efectivoDiff) < 0.05 ? '#34d399' : '#f87171'
                  }}>
                    {Math.abs(efectivoDiff) < 0.05
                      ? '✓ Cuadre perfecto'
                      : efectivoDiff > 0
                        ? `Sobra: +$${efectivoDiff.toFixed(2)}`
                        : `Falta: -$${Math.abs(efectivoDiff).toFixed(2)}`}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ventas individuales del día */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '8px' }}>
              Transacciones Registradas ({daySales.length})
            </div>

            {daySales.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '24px',
                color: '#64748b',
                fontSize: '12px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '14px'
              }}>
                No hay ventas registradas para el día {selectedDate}.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {daySales.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '14px',
                      padding: '10px 14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                        {s.invoiceNumber} • {s.clientName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {new Date(s.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                        {s.items?.length || 0} ítems
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: '900', color: '#fbbf24', fontFamily: 'Outfit' }}>
                        ${s.totalUSD.toFixed(2)}
                      </div>
                      <button
                        onClick={() => onViewReceipt(s)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#38bdf8',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Ver Recibo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* HISTORIAL DE CIERRES ANTERIORES */
        <div>
          {cashClosures.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '36px 20px',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.02)',
              borderRadius: '16px'
            }}>
              <History size={32} color="#64748b" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>
                No hay cierres archivados
              </h4>
              <p style={{ fontSize: '12px' }}>
                Realiza un Cierre de Caja en la pestaña "Venta del Día" para que aparezca aquí.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cashClosures.slice().reverse().map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '16px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#fbbf24' }}>
                        {c.closureNumber}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '6px' }}>
                        📅 {c.date} ({new Date(c.closedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                      </span>
                    </div>

                    <span style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      fontSize: '10px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '8px'
                    }}>
                      CERRADO
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>Total Recaudado: </span>
                      <strong style={{ fontSize: '17px', color: '#fff', fontFamily: 'Outfit' }}>
                        ${c.totalUSD.toFixed(2)} USD
                      </strong>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {c.salesCount} ventas
                    </span>
                  </div>

                  {/* Resumen de métodos en pastillas */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', fontSize: '10.5px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '6px' }}>
                      Divisa: ${c.breakdown?.divisa?.toFixed(2) || '0.00'}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '6px' }}>
                      Punto: ${c.breakdown?.puntoDeVenta?.toFixed(2) || '0.00'}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '6px' }}>
                      PagoMóvil: ${c.breakdown?.pagoMovil?.toFixed(2) || '0.00'}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '6px' }}>
                      Cashea: ${c.breakdown?.cashea?.toFixed(2) || '0.00'}
                    </span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '6px' }}>
                      Weppa: ${c.breakdown?.weppa?.toFixed(2) || '0.00'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: '4px' }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '11px' }}
                      onClick={() => handleShareWhatsApp(c)}
                    >
                      <Share2 size={12} color="#25D366" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmación para Cierre de Caja */}
      {isConfirmingClosure && (
        <div className="modal-overlay" onClick={() => setIsConfirmingClosure(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Confirmar Cierre de Caja</h3>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '14px' }}>
              Estás a punto de congelar y archivar el <strong>Cierre de Caja para el día {selectedDate}</strong> con un total de <strong>${daySummary.totalUSD.toFixed(2)} USD</strong> y <strong>{daySummary.salesCount} ventas</strong>.
            </p>

            <div className="form-group">
              <label className="form-label">Notas u Observaciones del Turno</label>
              <textarea
                className="form-input"
                style={{ height: '70px', resize: 'none' }}
                placeholder="Observaciones de caja, faltante, sobrante, etc..."
                value={closureNotes}
                onChange={(e) => setClosureNotes(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setIsConfirmingClosure(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-gold"
                style={{ flex: 2 }}
                onClick={handlePerformClosure}
              >
                <Lock size={15} />
                Ejecutar y Guardar Cierre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

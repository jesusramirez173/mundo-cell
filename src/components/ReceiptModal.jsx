import React from 'react';
import { X, Printer, Share2, CheckCircle2 } from 'lucide-react';

export function ReceiptModal({ sale, onClose, settings }) {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const itemsList = sale.items
      ?.map((i) => `• ${i.quantity}x ${i.brand} ${i.model} - $${(i.price * i.quantity).toFixed(2)}`)
      .join('\n') || '';

    const paymentsList = Object.entries(sale.payments || {})
      .filter(([_, val]) => val > 0)
      .map(([k, val]) => `  - ${k}: $${val.toFixed(2)}`)
      .join('\n');

    const message = `*🧾 RECIBO DE COMPRA - MUNDO CELL*
🆔 *Ticket:* ${sale.invoiceNumber}
📅 *Fecha:* ${new Date(sale.date).toLocaleString()}
👤 *Cliente:* ${sale.clientName}

*ARTÍCULOS:*
${itemsList}

💰 *TOTAL USD:* $${sale.totalUSD.toFixed(2)}
💵 *TOTAL BS:* ${(sale.totalBS || sale.totalUSD * (sale.exchangeRate || 62.5)).toFixed(2)} Bs
(Tasa: ${sale.exchangeRate || 62.5} Bs/$)

*FORMAS DE PAGO:*
${paymentsList}

_¡Gracias por su compra en Mundo Cell!_`;

    const encoded = encodeURIComponent(message);
    const phone = sale.clientPhone ? sale.clientPhone.replace(/[^0-9]/g, '') : '';
    const url = phone
      ? `https://api.whatsapp.com/send?phone=${phone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <h3 className="modal-title">Recibo Digital</h3>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Printable Ticket Card */}
        <div style={{
          background: '#fff',
          color: '#000',
          borderRadius: '16px',
          padding: '20px',
          fontFamily: 'monospace',
          fontSize: '12px',
          lineHeight: '1.4',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          marginBottom: '16px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <img
              src="/logo.png"
              alt="Mundo Cell"
              style={{ width: '48px', height: '48px', borderRadius: '10px', margin: '0 auto 6px' }}
            />
            <div style={{ fontWeight: '900', fontSize: '16px', textTransform: 'uppercase' }}>
              {settings?.storeName || 'MUNDO CELL'}
            </div>
            <div style={{ fontSize: '10px', color: '#555' }}>
              Control de Inventario y Ventas
            </div>
            <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Ticket:</span>
            <strong>{sale.invoiceNumber}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span>Fecha:</span>
            <span>{new Date(sale.date).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span>Cliente:</span>
            <span>{sale.clientName}</span>
          </div>

          <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />

          {/* Items */}
          <div style={{ marginBottom: '8px' }}>
            {sale.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                <span>{item.quantity}x {item.brand} {item.model}</span>
                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />

          {/* Totals */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '900', margin: '6px 0' }}>
            <span>TOTAL USD:</span>
            <span>${sale.totalUSD.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '700', marginBottom: '6px' }}>
            <span>TOTAL BS:</span>
            <span>{(sale.totalBS || sale.totalUSD * 62.5).toFixed(2)} Bs</span>
          </div>

          <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />

          {/* Pagos */}
          <div style={{ fontSize: '11px', marginBottom: '6px' }}>
            <strong>Pagado con:</strong>
            {Object.entries(sale.payments || {}).map(([method, amount]) => {
              if (amount <= 0) return null;
              return (
                <div key={method} style={{ display: 'flex', justifyContent: 'space-between', margin: '2px 0' }}>
                  <span style={{ textTransform: 'capitalize' }}>{method}:</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '10px', color: '#555' }}>
            ¡Gracias por preferir a Mundo Cell!
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={handlePrint}>
            <Printer size={15} />
            <span>Imprimir</span>
          </button>
          <button className="btn-gold" style={{ flex: 1.5 }} onClick={handleShareWhatsApp}>
            <Share2 size={15} />
            <span>Enviar WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

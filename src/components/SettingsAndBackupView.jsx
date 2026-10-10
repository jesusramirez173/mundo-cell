import React, { useState } from 'react';
import { 
  Database, Download, Upload, RefreshCw, Save, 
  Trash2, GitBranch, Smartphone, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { db, INITIAL_PRODUCTS } from '../db/db';

export function SettingsAndBackupView({
  settings,
  onUpdateSettings,
  onDatabaseReload
}) {
  const [storeName, setStoreName] = useState(settings?.storeName || 'Mundo Cell');
  const [exchangeRate, setExchangeRate] = useState(settings?.exchangeRate || 62.50);
  const [phone, setPhone] = useState(settings?.phone || '+58 412 000 0000');
  const [address, setAddress] = useState(settings?.address || 'Venezuela');
  const [statusMsg, setStatusMsg] = useState('');

  // Save Settings
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    const updated = {
      id: 'config',
      storeName: storeName.trim(),
      exchangeRate: parseFloat(exchangeRate) || 62.50,
      phone: phone.trim(),
      address: address.trim(),
      currencySymbol: '$',
      secondaryCurrency: 'Bs'
    };
    await db.settings.put(updated);
    onUpdateSettings(updated);
    setStatusMsg('Configuración guardada correctamente.');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // Export full database to JSON
  const handleExportBackup = async () => {
    try {
      const allProducts = await db.products.toArray();
      const allSales = await db.sales.toArray();
      const allClosures = await db.cashClosures.toArray();
      const config = await db.settings.get('config');

      const backupData = {
        app: 'Mundo Cell',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        products: allProducts,
        sales: allSales,
        cashClosures: allClosures,
        settings: config
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `MundoCell_Backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMsg('Copia de seguridad exportada con éxito.');
      setTimeout(() => setStatusMsg(''), 3500);
    } catch (err) {
      alert('Error al exportar la base de datos: ' + err.message);
    }
  };

  // Import / Restore database from JSON
  const handleImportBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported.products || !Array.isArray(imported.products)) {
          throw new Error('El archivo no tiene el formato de copia de seguridad de Mundo Cell.');
        }

        if (confirm(`Se restaurarán ${imported.products.length} productos y ${imported.sales?.length || 0} ventas. ¿Deseas continuar?`)) {
          await db.products.clear();
          await db.products.bulkAdd(imported.products);

          if (imported.sales && Array.isArray(imported.sales)) {
            await db.sales.clear();
            await db.sales.bulkAdd(imported.sales);
          }

          if (imported.cashClosures && Array.isArray(imported.cashClosures)) {
            await db.cashClosures.clear();
            await db.cashClosures.bulkAdd(imported.cashClosures);
          }

          if (imported.settings) {
            await db.settings.put(imported.settings);
            onUpdateSettings(imported.settings);
          }

          onDatabaseReload();
          setStatusMsg('¡Base de datos restaurada con éxito!');
          setTimeout(() => setStatusMsg(''), 4000);
        }
      } catch (err) {
        alert('Error al importar la base de datos: ' + err.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Reset to initial demo database
  const handleResetDemoData = async () => {
    if (confirm('¿Restablecer el inventario con los productos y marcas de prueba de Mundo Cell? (Xiaomi, Motorola, Infinix, Tecno, iPhone y Accesorios)')) {
      await db.products.clear();
      await db.products.bulkAdd(INITIAL_PRODUCTS);
      onDatabaseReload();
      setStatusMsg('Datos de prueba de Mundo Cell cargados.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '14px 16px 24px' }}>
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#f8fafc' }}>
          Ajustes & Base de Datos
        </h2>
        <p style={{ fontSize: '11.5px', color: '#94a3b8' }}>
          Gestión de datos offline, tasas y configuración de Mundo Cell
        </p>
      </div>

      {statusMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          borderRadius: '12px',
          padding: '10px 14px',
          color: '#34d399',
          fontSize: '12.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Tarjeta de Base de Datos */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8'
          }}>
            <Database size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#fff' }}>
              Base de Datos Confiable (Dexie / IndexedDB)
            </h4>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              100% Offline • Sin caídas de internet • Fácil de manipular
            </span>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '14px' }}>
          Tus datos se guardan de forma segura localmente en tu teléfono. Puedes hacer copias de seguridad en un archivo JSON o restaurarlas en cualquier momento.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            type="button"
            className="btn-gold"
            onClick={handleExportBackup}
            style={{ width: '100%' }}
          >
            <Download size={15} />
            <span>Exportar Copia de Seguridad (JSON)</span>
          </button>

          <label
            className="btn-secondary"
            style={{ width: '100%', cursor: 'pointer', textAlign: 'center' }}
          >
            <Upload size={15} />
            <span>Importar / Restaurar Base de Datos</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportBackup}
              style={{ display: 'none' }}
            />
          </label>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleResetDemoData}
            style={{ width: '100%', color: '#fbbf24' }}
          >
            <RefreshCw size={14} />
            <span>Cargar Catálogo Inicial de Mundo Cell</span>
          </button>
        </div>
      </div>

      {/* Configuración de la Tienda */}
      <form
        onSubmit={handleSaveConfig}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '16px'
        }}
      >
        <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginBottom: '14px' }}>
          Datos del Negocio
        </h4>

        <div className="form-group">
          <label className="form-label">Nombre de la Tienda</label>
          <input
            type="text"
            className="form-input"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Tasa de Cambio Referencial (Bs por $1 USD)</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Teléfono de Contacto</label>
          <input
            type="text"
            className="form-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-gold" style={{ width: '100%' }}>
          <Save size={15} />
          <span>Guardar Configuración</span>
        </button>
      </form>

      {/* APK & GitHub info */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '18px',
        padding: '16px',
        fontSize: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Smartphone size={16} color="#f59e0b" />
          <strong style={{ color: '#fff', fontSize: '13px' }}>APK Móvil Android Nativo</strong>
        </div>
        <p style={{ color: '#94a3b8', lineHeight: '1.5', marginBottom: '10px' }}>
          Esta app incluye configuración de <strong>Capacitor Android</strong> y un flujo automático de <strong>GitHub Actions</strong> para compilar el archivo <code>MundoCell.apk</code> directamente en tu repositorio de GitHub.
        </p>
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '8px 12px',
          borderRadius: '10px',
          color: '#fbbf24',
          fontFamily: 'monospace',
          fontSize: '11px'
        }}>
          Package: com.mundocell.app • v1.0.0
        </div>
      </div>
    </div>
  );
}

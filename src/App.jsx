import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkInput, setBulkInput] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await fetch('/api/sites');
      if (res.ok) {
        const data = await res.json();
        setSites(data);
      }
    } catch (err) {
      console.error('خطا در دریافت داده‌ها:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const lines = bulkInput.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    
    if (lines.length < 4) {
      showToast('باید حداقل ۴ خط وارد کنید');
      return;
    }

    const [site, cardSelector, linkSelector, containerSelector] = lines;

    try {
      const res = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site, cardSelector, linkSelector, containerSelector })
      });

      if (res.ok) {
        showToast('سایت اضافه شد');
        setBulkInput('');
        fetchSites();
      } else {
        showToast('خطا در افزودن');
      }
    } catch (err) {
      showToast('خطا در اتصال');
      console.error(err);
    }
  };

  const handleDelete = async (site) => {
    if (!window.confirm(`آیا از حذف ${site} اطمینان دارید؟`)) {
      return;
    }

    try {
      const res = await fetch(`/api/sites?site=${encodeURIComponent(site)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('سایت حذف شد');
        fetchSites();
      } else {
        showToast('خطا در حذف');
      }
    } catch (err) {
      showToast('خطا در اتصال');
      console.error(err);
    }
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      showToast(`کپی شد: ${text}`);
    } catch (err) {
      showToast('خطا در کپی');
      console.error(err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const getVal = (site, key) => {
    const config = sites.find(s => s.site === site);
    return config && config[key] ? config[key] : '';
  };

  if (loading) {
    return <div className="loading">در حال بارگذاری...</div>;
  }

  return (
    <div className="container">
      <h1>مدیریت Selector های گالری</h1>

      <div className="form-section">
        <p className="instruction">
          برای افزودن سایت جدید، چهار خط زیر را در textarea بنویسید (هر خط یک مقدار):
        </p>
        <pre className="example">
site.com
cardSelector
linkSelector
containerSelector
        </pre>

        <form onSubmit={handleAdd}>
          <textarea
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder="definebabe.com&#10;div.models-items__col&#10;a[href]&#10;div.models-items"
            rows="6"
          />
          <button type="submit" className="btn-add">افزودن سایت</button>
        </form>
      </div>

      {sites.length > 0 ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>پارامتر</th>
                {sites.map((config) => (
                  <th key={config.site}>
                    <div className="header-cell">
                      <span>{config.site}</span>
                      <button
                        onClick={() => handleDelete(config.site)}
                        className="btn-delete"
                      >
                        حذف
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="row-label">Card Selector</td>
                {sites.map((config) => (
                  <td
                    key={`${config.site}-card`}
                    className="copyable"
                    onClick={() => copyToClipboard(getVal(config.site, 'cardSelector'))}
                  >
                    {getVal(config.site, 'cardSelector')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="row-label">Link Selector (inside card)</td>
                {sites.map((config) => (
                  <td
                    key={`${config.site}-link`}
                    className="copyable"
                    onClick={() => copyToClipboard(getVal(config.site, 'linkSelector'))}
                  >
                    {getVal(config.site, 'linkSelector')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="row-label">Container Selector (for lazy-load)</td>
                {sites.map((config) => (
                  <td
                    key={`${config.site}-container`}
                    className="copyable"
                    onClick={() => copyToClipboard(getVal(config.site, 'containerSelector'))}
                  >
                    {getVal(config.site, 'containerSelector')}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="empty-state">هنوز سایتی اضافه نشده است.</p>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
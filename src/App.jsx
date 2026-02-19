import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bulkInput, setBulkInput] = useState('');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await fetch('/api/sites');
      if (res.ok) {
        const data = await res.json();
        setSites(data);
        setError('');
      } else {
        const errorData = await res.json();
        setError(`Failed to load sites: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError(`Connection error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const lines = bulkInput.trim().split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    
    if (lines.length < 4) {
      showToast('You must enter at least 4 lines');
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
        showToast('Site added successfully');
        setBulkInput('');
        fetchSites();
      } else {
        const errorData = await res.json();
        showToast(`Error adding site: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      showToast(`Connection error: ${err.message}`);
      console.error(err);
    }
  };

  const handleDelete = async (site) => {
    if (!window.confirm(`Are you sure you want to delete ${site}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/sites?site=${encodeURIComponent(site)}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Site deleted successfully');
        fetchSites();
      } else {
        const errorData = await res.json();
        showToast(`Error deleting site: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      showToast(`Connection error: ${err.message}`);
      console.error(err);
    }
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied: ${text}`);
    } catch (err) {
      showToast('Copy failed');
      console.error(err);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const getVal = (site, key) => {
    const config = sites.find(s => s.site === site);
    return config && config[key] ? config[key] : '';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Gallery Security Selectors Manager</h1>

      {error && (
        <div className="error-banner">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="form-section">
        <p className="instruction">
          To add a new site, enter 4 lines in the textarea below (one value per line):
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
            placeholder="example.com&#10;div.card&#10;a[href]&#10;div.container"
            rows="6"
          />
          <button type="submit" className="btn-add">Add Site</button>
        </form>
      </div>

      {sites.length > 0 ? (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Parameter</th>
                {sites.map((config) => (
                  <th key={config.site}>
                    <div className="header-cell">
                      <span>{config.site}</span>
                      <button
                        onClick={() => handleDelete(config.site)}
                        className="btn-delete"
                      >
                        Delete
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
        <p className="empty-state">No sites added yet.</p>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
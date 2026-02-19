import React, { useState, useEffect } from 'react';

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
      showToast('You must enter at least 4 lines', 'error');
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
        showToast('Site added successfully', 'success');
        setBulkInput('');
        fetchSites();
      } else {
        const errorData = await res.json();
        showToast(`Error: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      showToast(`Connection error: ${err.message}`, 'error');
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
        showToast('Site deleted successfully', 'success');
        fetchSites();
      } else {
        const errorData = await res.json();
        showToast(`Error: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      showToast(`Connection error: ${err.message}`, 'error');
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const copyToClipboard = async (text) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied: ${text}`, 'success');
    } catch (err) {
      showToast('Copy failed', 'error');
      console.error(err);
    }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(''), 3000);
  };

  const getVal = (site, key) => {
    const config = sites.find(s => s.site === site);
    return config && config[key] ? config[key] : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              Gallery Security Selectors
            </h1>
            <p className="text-slate-400 mt-2 text-sm sm:text-base">Manage your site selectors efficiently</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <strong className="text-red-300 font-semibold">Error:</strong>
              <span className="text-red-200 ml-2">{error}</span>
            </div>
          </div>
        )}

        {/* Add Site Form */}
        <div className="mb-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-200">Add New Site</h2>
          </div>
          
          <p className="text-slate-400 text-xs sm:text-sm mb-4">
            Enter 4 lines in the textarea below (one value per line):
          </p>
          
          <div className="bg-slate-950/50 rounded-lg p-3 sm:p-4 mb-4 border border-slate-800 overflow-x-auto">
            <pre className="text-xs text-slate-400 font-mono whitespace-pre">
site.com
cardSelector
linkSelector
containerSelector
            </pre>
          </div>

          <form onSubmit={handleAdd} className="space-y-4">
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="example.com&#10;div.card&#10;a[href]&#10;div.container"
              rows="6"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-xs sm:text-sm resize-none transition-all duration-200"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-primary-500/50 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Site
            </button>
          </form>
        </div>

        {/* Sites Table */}
        {sites.length > 0 ? (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4 sm:p-6 shadow-xl overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-200">Saved Sites</h2>
              <span className="ml-auto text-xs sm:text-sm text-slate-400">{sites.length} site{sites.length !== 1 ? 's' : ''}</span>
            </div>
            
            <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-primary-400 bg-slate-950/50">Parameter</th>
                    {sites.map((config) => (
                      <th key={config.site} className="px-3 sm:px-4 py-3 text-center bg-slate-950/50">
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-slate-200 break-all">{config.site}</span>
                          <button
                            onClick={() => handleDelete(config.site)}
                            className="px-2 sm:px-3 py-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-md transition-all duration-200 text-xs font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 sm:px-4 py-3 font-semibold text-slate-300 text-xs sm:text-sm bg-slate-900/50">Card Selector</td>
                    {sites.map((config) => (
                      <td
                        key={`${config.site}-card`}
                        onClick={() => copyToClipboard(getVal(config.site, 'cardSelector'))}
                        className="px-3 sm:px-4 py-3 text-center cursor-pointer hover:bg-primary-500/10 transition-colors group"
                      >
                        <span className="text-xs sm:text-sm text-slate-300 group-hover:text-primary-400 font-mono break-all">
                          {getVal(config.site, 'cardSelector')}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 sm:px-4 py-3 font-semibold text-slate-300 text-xs sm:text-sm bg-slate-900/50">Link Selector</td>
                    {sites.map((config) => (
                      <td
                        key={`${config.site}-link`}
                        onClick={() => copyToClipboard(getVal(config.site, 'linkSelector'))}
                        className="px-3 sm:px-4 py-3 text-center cursor-pointer hover:bg-primary-500/10 transition-colors group"
                      >
                        <span className="text-xs sm:text-sm text-slate-300 group-hover:text-primary-400 font-mono break-all">
                          {getVal(config.site, 'linkSelector')}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 sm:px-4 py-3 font-semibold text-slate-300 text-xs sm:text-sm bg-slate-900/50">Container Selector</td>
                    {sites.map((config) => (
                      <td
                        key={`${config.site}-container`}
                        onClick={() => copyToClipboard(getVal(config.site, 'containerSelector'))}
                        className="px-3 sm:px-4 py-3 text-center cursor-pointer hover:bg-primary-500/10 transition-colors group"
                      >
                        <span className="text-xs sm:text-sm text-slate-300 group-hover:text-primary-400 font-mono break-all">
                          {getVal(config.site, 'containerSelector')}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 sm:p-12 text-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-slate-400 text-base sm:text-lg">No sites added yet</p>
            <p className="text-slate-500 text-xs sm:text-sm mt-2">Add your first site using the form above</p>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-up ${
          toast.type === 'success' 
            ? 'bg-emerald-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-medium text-sm break-words">{toast.msg}</span>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(1rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
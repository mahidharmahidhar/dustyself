import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/index';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

export default function APIKeys() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Redirect if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = () => {
    // Load from localStorage for demo
    const keys = JSON.parse(localStorage.getItem(`apiKeys_${user.id}`) || '[]');
    setApiKeys(keys);
  };

  const generateApiKey = async (e) => {
    e.preventDefault();
    if (!keyName.trim()) {
      alert('Please enter a key name');
      return;
    }

    setLoading(true);
    try {
      // Simulate API key generation
      const newKey = {
        id: `key_${Date.now()}`,
        name: keyName,
        key: `sk_live_${Math.random().toString(36).substr(2, 32)}`,
        lastUsed: null,
        createdAt: new Date().toISOString(),
        active: true
      };

      const updated = [...apiKeys, newKey];
      setApiKeys(updated);
      localStorage.setItem(`apiKeys_${user.id}`, JSON.stringify(updated));

      setKeyName('');
      setShowForm(false);
      alert('✅ API Key generated successfully!');
    } catch (err) {
      alert('❌ Error generating API key');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (key) => {
    navigator.clipboard.writeText(key);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteKey = (keyId) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      const updated = apiKeys.filter(k => k.id !== keyId);
      setApiKeys(updated);
      localStorage.setItem(`apiKeys_${user.id}`, JSON.stringify(updated));
      alert('✅ API key deleted');
    }
  };

  const toggleKeyStatus = (keyId) => {
    const updated = apiKeys.map(k =>
      k.id === keyId ? { ...k, active: !k.active } : k
    );
    setApiKeys(updated);
    localStorage.setItem(`apiKeys_${user.id}`, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-green to-dark-green text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">🔑 API Keys</h1>
          <p className="text-light-green opacity-90">Manage your API keys for integrations</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Your API Keys</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-brand-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-dark-green transition"
          >
            {showForm ? '✕ Cancel' : '+ Generate New Key'}
          </button>
        </div>

        {/* Generate Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Generate New API Key</h3>
            <form onSubmit={generateApiKey} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Key Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  placeholder="e.g., Production API"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-brand-green focus:outline-none"
                  disabled={loading}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-green text-white py-3 rounded-lg font-bold hover:bg-dark-green transition disabled:opacity-50"
                >
                  {loading ? '⏳ Generating...' : 'Generate Key'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* API Keys List */}
        {apiKeys.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">🔑</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No API Keys Yet</h3>
            <p className="text-gray-600 mb-6">Generate your first API key to get started with integrations</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-brand-green text-white px-8 py-3 rounded-lg font-bold hover:bg-dark-green transition"
            >
              Generate First Key
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div key={apiKey.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">KEY NAME</p>
                    <p className="text-lg font-bold text-gray-900">{apiKey.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">CREATED</p>
                    <p className="text-gray-900">
                      {new Date(apiKey.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-semibold mb-1">STATUS</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${apiKey.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {apiKey.active ? '✓ Active' : '✕ Inactive'}
                    </span>
                  </div>
                  <div className="text-right">
                    {apiKey.lastUsed && (
                      <p className="text-gray-600 text-sm">
                        Last used: {new Date(apiKey.lastUsed).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Key Display */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4 font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <code className="text-gray-700 break-all">{apiKey.key}</code>
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="ml-4 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition whitespace-nowrap"
                    >
                      {copiedId === apiKey.key ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => toggleKeyStatus(apiKey.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${apiKey.active
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                  >
                    {apiKey.active ? '🔒 Deactivate' : '🔓 Activate'}
                  </button>
                  <button
                    onClick={() => deleteKey(apiKey.id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-semibold hover:bg-red-200 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Documentation */}
        <div className="mt-12 bg-blue-50 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📚 API Documentation</h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <h4 className="font-bold mb-2">Base URL:</h4>
              <code className="bg-gray-100 p-2 rounded inline-block">https://api.dustyshelves.in/v1</code>
            </div>
            <div>
              <h4 className="font-bold mb-2">Authentication:</h4>
              <code className="bg-gray-100 p-2 rounded inline-block">Authorization: Bearer YOUR_API_KEY</code>
            </div>
            <div>
              <h4 className="font-bold mb-2">Example Endpoints:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li><code>GET /books</code> - List all books</li>
                <li><code>GET /books/{'{id}'}</code> - Get book details</li>
                <li><code>POST /cart/add</code> - Add item to cart</li>
                <li><code>POST /orders/create</code> - Create new order</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

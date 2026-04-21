import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function SellerDashboard() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    fetchSellerBooks();
  }, []);

  const fetchSellerBooks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/books/seller/my-books');
      if (data.success) {
        setBooks(data.books);
        // Calculate stats
        setStats({
          total: data.books.length,
          active: data.books.filter(b => b.status === 'ACTIVE').length,
          revenue: data.books.reduce((sum, b) => sum + (b.price * (b.soldQty || 0)), 0)
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load books');
      console.error('Error fetching seller books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setEditData({ ...book });
  };

  const handleSaveEdit = async (bookId) => {
    try {
      const { data } = await api.put(`/books/${bookId}`, editData);
      if (data.success) {
        setBooks(books.map(b => b.id === bookId ? data.book : b));
        setEditingId(null);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update book');
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const { data } = await api.delete(`/books/${bookId}`);
      if (data.success) {
        setBooks(books.filter(b => b.id !== bookId));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete book');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">📊 Seller Dashboard</h1>
          <p className="text-orange-100 opacity-90">Manage your book listings and sales</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Listings</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="text-5xl opacity-20">📚</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Active Books</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{stats.active}</p>
              </div>
              <div className="text-5xl opacity-20">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                <p className="text-4xl font-bold text-orange-600 mt-2">₹{stats.revenue.toFixed(0)}</p>
              </div>
              <div className="text-5xl opacity-20">💰</div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/sell')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            + Add New Book
          </button>
        </div>

        {/* Books List */}
        {books.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📕</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Books Listed Yet</h2>
            <p className="text-gray-600 mb-6">Start selling by adding your first book</p>
            <button
              onClick={() => navigate('/sell')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold"
            >
              List Your First Book
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Title</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Author</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Condition</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {books.map(book => (
                    <tr key={book.id} className="hover:bg-gray-50 transition">
                      {editingId === book.id ? (
                        <>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editData.title}
                              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editData.author}
                              onChange={(e) => setEditData({ ...editData, author: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={editData.price}
                              onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={editData.condition}
                              onChange={(e) => setEditData({ ...editData, condition: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                              <option>LIKE_NEW</option>
                              <option>VERY_GOOD</option>
                              <option>GOOD</option>
                              <option>FAIR</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={editData.stockQty}
                              onChange={(e) => setEditData({ ...editData, stockQty: parseInt(e.target.value) })}
                              className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={editData.status}
                              onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                              <option>ACTIVE</option>
                              <option>INACTIVE</option>
                              <option>PENDING</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(book.id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white text-sm rounded transition"
                            >
                              Cancel
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">{book.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{book.author}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-semibold">₹{book.price}</td>
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              {book.condition}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{book.stockQty}</td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${book.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                                book.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {book.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            <button
                              onClick={() => handleEdit(book)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(book.id)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

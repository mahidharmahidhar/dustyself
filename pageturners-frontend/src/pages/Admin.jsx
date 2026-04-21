import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/index';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';

export default function Admin() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('stats');

  if (user?.role !== 'ADMIN') {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 text-xl">Access Denied. Admin only.</p>
      </div>
    );
  }

  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.stats;
    }
  });

  const { data: pendingBooks } = useQuery({
    queryKey: ['pending-books'],
    enabled: tab === 'books',
    queryFn: async () => {
      const res = await api.get('/admin/books/pending');
      return res.data.books;
    }
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    enabled: tab === 'users',
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.users;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">⚙️ Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b">
        {['stats', 'books', 'users'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 font-semibold ${tab === t ? 'text-brand-green border-b-2 border-brand-green' : 'text-gray-600'}`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      {tab === 'stats' && stats && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Books', value: stats.totalBooks },
            { label: 'Total Orders', value: stats.totalOrders },
            { label: 'Total Users', value: stats.totalUsers },
            { label: 'Total Revenue', value: `$${stats.totalRevenue}` }
          ].map(s => (
            <div key={s.label} className="bg-gradient-to-br from-brand-green to-dark-green text-white p-6 rounded-lg">
              <p className="text-gray-200">{s.label}</p>
              <p className="text-3xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pending Books */}
      {tab === 'books' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Pending Books for Approval</h2>
          {pendingBooks?.map(book => (
            <div key={book.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{book.title}</h3>
                <p className="text-gray-600">{book.author} • ${book.price}</p>
                <p className="text-sm text-gray-500">Seller: {book.seller.name}</p>
              </div>
              <button
                onClick={() => api.put(`/admin/books/${book.id}/approve`)}
                className="bg-brand-green text-white px-4 py-2 rounded hover:bg-dark-green transition"
              >
                ✓ Approve
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-light-green">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(user => (
                <tr key={user.id} className="border-b">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2"><span className="bg-brand-green text-white px-2 py-1 rounded text-xs">{user.role}</span></td>
                  <td className="px-4 py-2 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

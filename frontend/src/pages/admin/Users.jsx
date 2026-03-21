import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAdminUsers, 
  deleteUserAdmin, 
  blockUserAdmin, 
  changeUserRoleAdmin 
} from '../../redux/slices/adminSlice';
import { 
  Users, 
  Search, 
  Trash2, 
  UserMinus, 
  UserCheck, 
  ShieldAlert, 
  Loader2,
  Mail,
  Calendar,
  Shield,
  Filter
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    dispatch(getAdminUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleDelete = (user) => {
    if (user.role === 'admin') return alert('Cannot delete an admin');
    if (window.confirm(`Delete user ${user.name}?`)) {
      dispatch(deleteUserAdmin(user._id));
    }
  };

  if (loading && users.length === 0) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader2 className="animate-spin" size={40} color="#0ea5e9" />
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 className="luxury-font" style={{ fontSize: '2.2rem', margin: '0 0 0.5rem 0' }}>User Management</h1>
        <p style={{ color: '#64748b' }}>Control access and roles across the ecosystem.</p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', padding: '0.75rem 1.25rem', borderRadius: '14px', flexGrow: 1, border: '1px solid #e2e8f0' }}>
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ background: 'none', border: 'none', paddingLeft: '1rem', outline: 'none', width: '100%' }} 
            />
          </div>
          <select 
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            style={{ padding: '0.75rem 1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}
          >
            <option value="all">All Roles</option>
            <option value="customer">Customer</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '1.25rem', color: '#64748b' }}>USER</th>
                <th style={{ padding: '1.25rem', color: '#64748b' }}>ROLE</th>
                <th style={{ padding: '1.25rem', color: '#64748b' }}>STATUS</th>
                <th style={{ padding: '1.25rem', color: '#64748b', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={20} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: '700' }}>{user.name}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <select 
                      value={user.role} 
                      onChange={(e) => dispatch(changeUserRoleAdmin({ id: user._id, role: e.target.value }))}
                      disabled={user.role === 'admin'}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    >
                      <option value="customer">Customer</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '30px', 
                      fontSize: '0.7rem', 
                      fontWeight: '800', 
                      background: user.isBlocked ? '#fee2e2' : '#dcfce7',
                      color: user.isBlocked ? '#991b1b' : '#166534'
                    }}>
                      {user.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        onClick={() => dispatch(blockUserAdmin(user._id))}
                        disabled={user.role === 'admin'}
                        style={{ border: 'none', background: '#f1f5f9', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                        title={user.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {user.isBlocked ? <UserCheck size={18} color="#10b981" /> : <UserMinus size={18} color="#f59e0b" />}
                      </button>
                      <button 
                         onClick={() => handleDelete(user)}
                         disabled={user.role === 'admin'}
                         style={{ border: 'none', background: '#fee2e2', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Trash2 size={18} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

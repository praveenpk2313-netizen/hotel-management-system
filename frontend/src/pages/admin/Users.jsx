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
  Filter,
  ArrowRight,
  MoreVertical,
  ChevronDown
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
    const nameStr = u.name || '';
    const emailStr = u.email || '';
    const matchesSearch = nameStr.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emailStr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleDelete = (user) => {
    if (user.role === 'admin') return alert('Cannot delete an admin');
    if (window.confirm(`Delete user ${user.name}? This action is irreversible.`)) {
      dispatch(deleteUserAdmin(user._id));
    }
  };

  if (loading && users.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-xs font-black text-gray-400 font-serif uppercase tracking-widest animate-pulse">Scanning Global Identities...</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-secondary-dark font-black tracking-tight flex items-center gap-3">
             <Shield className="text-primary" size={32} />
             Identity Management
          </h1>
          <p className="text-gray-400 font-medium">Control access and roles across the ecosystem.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
           <button 
             onClick={() => setRoleFilter('all')} 
             className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${roleFilter === 'all' ? 'bg-secondary-dark text-white shadow-lg' : 'text-gray-400 hover:text-secondary'}`}
           >
              All Roles
           </button>
           <button 
             onClick={() => setRoleFilter('customer')} 
             className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${roleFilter === 'customer' ? 'bg-secondary-dark text-white shadow-lg' : 'text-gray-400 hover:text-secondary'}`}
           >
              Customers
           </button>
           <button 
             onClick={() => setRoleFilter('manager')} 
             className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${roleFilter === 'manager' ? 'bg-secondary-dark text-white shadow-lg' : 'text-gray-400 hover:text-secondary'}`}
           >
              Partners
           </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Search Header */}
        <div className="p-8 md:p-10 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="relative w-full max-w-md group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search by identity or email..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full h-14 bg-gray-50/50 border border-gray-100 rounded-2xl pl-14 pr-6 text-sm font-bold text-secondary-dark placeholder:text-gray-300 focus:bg-white focus:border-primary/30 focus:shadow-xl focus:shadow-primary/5 outline-none transition-all"
              />
           </div>
           
           <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-2 rounded-full uppercase tracking-widest">
                 {filteredUsers.length} Active Profiles
              </span>
           </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Authorization</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-serif">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-xl font-serif font-black text-primary border border-gray-100 group-hover:bg-white group-hover:shadow-lg transition-all">
                          {user.name?.charAt(0)}
                       </div>
                       <div>
                          <p className="font-black text-secondary-dark text-lg leading-none mb-1.5">{user.name}</p>
                          <div className="flex items-center gap-1.5 text-gray-400 font-serif text-xs font-bold">
                             <Mail size={12} className="text-primary opacity-60" />
                             {user.email}
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="relative inline-block w-48 group/select">
                       <select 
                         value={user.role} 
                         onChange={(e) => dispatch(changeUserRoleAdmin({ id: user._id, role: e.target.value }))}
                         disabled={user.role === 'admin'}
                         className="w-full h-11 bg-white border border-gray-100 rounded-xl px-4 text-xs font-black uppercase tracking-widest text-secondary-dark appearance-none cursor-pointer focus:border-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                       >
                         <option value="customer">Customer Access</option>
                         <option value="manager">Partner Manager</option>
                         <option value="admin">Executive Admin</option>
                       </select>
                       <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover/select:text-primary transition-colors" size={14} />
                    </div>
                  </td>
                  <td className="px-10 py-8">
                     <div className={`inline-flex items-center gap-2 pl-3 pr-5 py-2 rounded-full border shadow-sm ${user.isBlocked ? 'bg-rose-50 border-rose-100 text-rose-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${user.isBlocked ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                           {user.isBlocked ? 'Access Restricted' : 'Active Channel'}
                        </span>
                     </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                      <button 
                        onClick={() => dispatch(blockUserAdmin(user._id))}
                        disabled={user.role === 'admin'}
                        className={`w-11 h-11 bg-white border rounded-xl flex items-center justify-center transition-all ${user.isBlocked ? 'text-emerald-500 border-emerald-100 hover:bg-emerald-50' : 'text-amber-500 border-amber-100 hover:bg-amber-50'}`}
                        title={user.isBlocked ? 'Unblock' : 'Block'}
                      >
                        {user.isBlocked ? <UserCheck size={20} /> : <UserMinus size={20} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(user)}
                        disabled={user.role === 'admin'}
                        className="w-11 h-11 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center text-center">
               <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-200 mb-8">
                  <Activity size={48} />
               </div>
               <h3 className="text-2xl font-serif text-secondary-dark font-bold mb-2">No Profiles Found</h3>
               <p className="text-gray-400 font-medium max-w-xs">Attempt a different search query or role filter.</p>
            </div>
          )}
        </div>
        
        {/* Table Footer Activity */}
        <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center font-serif">
           <p className="text-xs text-gray-400 font-medium italic">Showing operational stream of all verified platform identities.</p>
           <div className="flex gap-2">
              <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all flex items-center justify-center font-bold">1</button>
              <button className="w-10 h-10 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all flex items-center justify-center">→</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;

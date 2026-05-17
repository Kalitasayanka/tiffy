import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Users, MessageSquare, Activity, LayoutDashboard, ArrowLeft, Settings, Edit, Trash2, Plus, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Admin = () => {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('tiffy_admin_token') || null);
  const [adminName, setAdminName] = useState(localStorage.getItem('tiffy_admin_name') || '');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [logs, setLogs] = useState([]);
  
  const fetchAdmin = async (url, options = {}) => {
    const headers = { ...options.headers, 'Authorization': `Bearer ${adminToken}` };
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('tiffy_admin_token');
      setAdminToken(null);
      throw new Error('Unauthorized');
    }
    return res;
  };
  
  const [activeTab, setActiveTab] = useState(localStorage.getItem('tiffy_admin_tab') || 'overview');
  
  useEffect(() => {
    localStorage.setItem('tiffy_admin_tab', activeTab);
  }, [activeTab]);
  const [analytics, setAnalytics] = useState([]);
  const [users, setUsers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [returning, setReturning] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [features, setFeatures] = useState([]);
  const [settings, setSettings] = useState({ social_facebook: '', social_twitter: '', social_instagram: '', company_address: '', contact_email: '' });
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General' });
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [newPlatformName, setNewPlatformName] = useState('');
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [featureForm, setFeatureForm] = useState({ title: '', description: '', color: 'red', gradient: 'linear-gradient(90deg,#E05252,#FFADAD)' });
  const [searchQuery, setSearchQuery] = useState('');
  const [queryFilter, setQueryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const socket = io(`${API_URL}`);
    const updateData = () => setRefreshKey(prev => prev + 1);
    
    socket.on('users_updated', updateData);
    socket.on('contacts_updated', updateData);
    socket.on('faqs_updated', updateData);
    socket.on('features_updated', updateData);
    socket.on('settings_updated', updateData);
    
    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    Promise.all([
      fetchAdmin(`${API_URL}/api/admin/analytics?year=${year}`).then(r => r.json()),
      fetchAdmin(`${API_URL}/api/admin/users`).then(r => r.json()),
      fetchAdmin(`${API_URL}/api/admin/contacts`).then(r => r.json()),
      fetchAdmin(`${API_URL}/api/admin/retention`).then(r => r.json()),
      fetch(`${API_URL}/api/settings`).then(r => r.json()),
      fetchAdmin(`${API_URL}/api/admin/all-faqs`).then(r => r.json()),
      fetch(`${API_URL}/api/features`).then(r => r.json()),
      fetchAdmin(`${API_URL}/api/admin/logs`).then(r => r.json())
    ]).then(([analyticsData, usersData, contactsData, returningData, settingsData, faqsData, featuresData, logsData]) => {
      setAnalytics(analyticsData);
      setUsers(usersData);
      setContacts(contactsData);
      setReturning(returningData);
      setSettings(settingsData);
      setFaqs(faqsData);
      setFeatures(featuresData);
      setLogs(logsData || []);
    }).catch(e => {
      console.error('Failed to fetch admin data:', e);
    }).finally(() => {
      setLoading(false);
    });
  }, [year, refreshKey]);

  const totalVisits = analytics.reduce((sum, item) => sum + item.visits, 0);

  if (!adminToken) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'var(--bg-main)' }}>
        <div className="card border-0 p-5 shadow-lg" style={{ width: '400px', borderRadius: '24px' }}>
          <h3 className="fw-bold mb-4 text-center">Admin Login</h3>
          {loginError && <div className="alert alert-danger py-2 small">{loginError}</div>}
          <div className="mb-3">
            <label className="form-label small fw-bold">Username</label>
            <input type="text" className="form-control" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold">Password</label>
            <input type="password" className="form-control" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
          </div>
          <button className="btn btn-primary w-100 fw-bold py-2" onClick={async () => {
            try {
              const res = await fetch(`${API_URL}/api/admin/login`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(loginForm) });
              const data = await res.json();
              if (res.ok) {
                localStorage.setItem('tiffy_admin_token', data.token);
                localStorage.setItem('tiffy_admin_name', data.username);
                setAdminToken(data.token);
                setAdminName(data.username);
                setLoginError('');
                window.location.reload();
              } else {
                setLoginError(data.error);
              }
            } catch (e) {
              setLoginError('Server error. Is the backend running?');
            }
          }}>Login to Dashboard</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100" style={{ background: 'var(--bg-main)' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { id: 'users', label: 'Users', icon: <Users size={18} /> },
    { id: 'queries', label: 'Queries', icon: <MessageSquare size={18} /> },
    { id: 'cms', label: 'Content Manager', icon: <Settings size={18} /> },
    { id: 'logs', label: 'Audit Logs', icon: <Activity size={18} /> },
  ];

  return (
    <div className="d-flex vh-100" style={{ background: 'var(--bg-main)', color: 'var(--text-dark)' }}>
      {/* Sidebar */}
      <div className="d-flex flex-column p-4" style={{ width: '280px', background: 'var(--bg-card)', borderRight: '1px solid var(--border-light)' }}>
        <div className="mb-5 d-flex align-items-center gap-2">
          <div className="rounded-circle" style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #CC5500, #FF8C00)' }}></div>
          <h4 className="mb-0 fw-bold" style={{ letterSpacing: '-0.03em', color: 'var(--text-dark)' }}>{adminName}</h4>
        </div>
        
        <div className="d-flex flex-column gap-2 flex-grow-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="btn text-start d-flex align-items-center gap-3 border-0 py-3 px-3 rounded-4"
              style={{
                background: activeTab === item.id ? 'var(--primary-light)' : 'transparent',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-light)',
                fontWeight: activeTab === item.id ? 700 : 500,
                transition: 'all 0.2s'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="btn btn-link text-decoration-none d-flex align-items-center gap-2 px-3 py-3" style={{ color: 'red' }}>Logout</button>
        <Link to="/" className="btn btn-link text-decoration-none d-flex align-items-center gap-2 px-3 pb-3" style={{ color: 'var(--text-light)' }}>
          <ArrowLeft size={16} /> Back to Site
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-5 overflow-auto">
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold mb-0" style={{ letterSpacing: '-0.04em', color: 'var(--text-dark)' }}>
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'users' && 'Registered Users'}
            {activeTab === 'queries' && 'Customer Queries'}
            {activeTab === 'cms' && 'Content Manager'}
            {activeTab === 'logs' && 'Audit Logs'}
          </h2>
          {activeTab !== 'overview' && (
            <div className="d-flex gap-3">
              <input 
                type="text" 
                className="form-control form-control-sm rounded-pill px-4" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '250px', background: 'var(--bg-main)', border: '1px solid var(--border-light)' }}
              />
            </div>
          )}
        </div>

        {activeTab === 'overview' && (
          <div className="d-flex flex-column gap-5">
            {/* Stats */}
            <div className="row g-4">
              <div className="col-12 col-md-4">
                <div className="card border-0 h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="p-2 rounded-circle" style={{ background: 'rgba(40,200,64,0.1)', color: '#28C840' }}><Activity size={20} /></div>
                    <span className="fw-bold" style={{ color: 'var(--text-light)' }}>Total Visits (7 Days)</span>
                  </div>
                  <h1 className="display-5 fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>{totalVisits}</h1>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="p-2 rounded-circle" style={{ background: 'rgba(65,105,225,0.1)', color: '#4169E1' }}><Users size={20} /></div>
                    <span className="fw-bold" style={{ color: 'var(--text-light)' }}>Total Users</span>
                  </div>
                  <h1 className="display-5 fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>{users.length}</h1>
                </div>
              </div>
              <div className="col-12 col-md-4">
                <div className="card border-0 h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="p-2 rounded-circle" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}><MessageSquare size={20} /></div>
                    <span className="fw-bold" style={{ color: 'var(--text-light)' }}>Total Queries</span>
                  </div>
                  <h1 className="display-5 fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>{contacts.length}</h1>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="card border-0 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>Traffic Overview</h5>
                <select 
                  className="form-select form-select-sm w-auto shadow-sm" 
                  value={year} 
                  onChange={e => setYear(e.target.value)}
                  style={{ borderRadius: '10px', border: '1px solid var(--border-light)', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                  <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                </select>
              </div>
              <div style={{ height: 400, width: '100%' }}>
                <ResponsiveContainer>
                  <AreaChart data={analytics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CC5500" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#CC5500" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                    <XAxis dataKey="date" stroke="var(--text-light)" tick={{fill: 'var(--text-light)'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="var(--text-light)" tick={{fill: 'var(--text-light)'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
                      itemStyle={{ color: 'var(--primary)', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="visits" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Retention Bar Graph */}
            <div className="card border-0 p-4 mt-2">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--text-dark)' }}>User Retention (New vs Returning)</h5>
              <div style={{ height: 350, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={returning} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                    <XAxis dataKey="date" stroke="var(--text-light)" tick={{fill: 'var(--text-light)'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="var(--text-light)" tick={{fill: 'var(--text-light)'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}
                      cursor={{ fill: 'var(--bg-elevated)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="newUsers" name="New Users" stackId="a" fill="var(--primary)" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="returningUsers" name="Returning Users" stackId="a" fill="#28C840" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card border-0 overflow-hidden p-0">
            <table className="table table-hover mb-0">
              <thead style={{ background: 'var(--bg-elevated)' }}>
                <tr>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>ID</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Name</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Email</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Joined Date</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-mid)' }}>{u.id}</td>
                    <td className="px-4 py-3 border-bottom fw-bold" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-dark)' }}>{u.name}</td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-mid)' }}>{u.email}</td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-mid)' }}>{u.created_at ? new Date(u.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span 
                        className="badge cursor-pointer" 
                        style={{ background: u.status === 'banned' ? 'rgba(255,0,0,0.1)' : 'rgba(40,200,64,0.1)', color: u.status === 'banned' ? 'red' : '#28C840', cursor: 'pointer' }}
                        onClick={async () => {
                          const newStatus = u.status === 'banned' ? 'active' : 'banned';
                          let reason = '';
                          if (newStatus === 'banned') {
                            reason = window.prompt('Reason for banning this user?');
                            if (reason === null) return;
                          }
                          await fetchAdmin(`${API_URL}/api/admin/users/${u.id}/ban`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: newStatus, reason }) });
                          setUsers(users.map(x => x.id === u.id ? {...x, status: newStatus} : x));
                        }}
                      >
                        {u.status === 'banned' ? 'Banned' : 'Active'}
                      </span>
                      <button className="btn btn-sm text-danger p-0 ms-3" onClick={async () => {
                        if (window.confirm('Permanently delete this user?')) {
                          await fetchAdmin(`${API_URL}/api/admin/users/${u.id}`, { method: 'DELETE' });
                          setUsers(users.filter(x => x.id !== u.id));
                        }
                      }}><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'queries' && (
          <div className="card border-0 overflow-hidden p-0">
            <table className="table table-hover mb-0">
              <thead style={{ background: 'var(--bg-elevated)' }}>
                <tr>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Date</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Name</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Email</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Business</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Type</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Message</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {contacts.filter(c => {
                  if (searchQuery && !c.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) && !c.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) && !c.message?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                  return true;
                }).map(c => (
                  <tr key={c.id}>
                    <td className="px-4 py-3 border-bottom small" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-light)' }}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 border-bottom fw-bold" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-dark)' }}>{c.user_name || 'Guest'}</td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-mid)' }}>{c.user_email}</td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-mid)' }}>{c.business_name || '-'}</td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}><span className="badge" style={{ background: 'var(--bg-main)', color: 'var(--text-dark)' }}>{c.inquiry_type || 'General'}</span></td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-mid)', maxWidth: '250px' }}>{c.message}</td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}>
                      <button 
                        className="btn btn-sm fw-bold rounded-pill border-0 me-2" 
                        onClick={async () => {
                          const newStatus = c.status === 'resolved' ? 'pending' : 'resolved';
                          await fetchAdmin(`${API_URL}/api/admin/contacts/${c.id}/status`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: newStatus }) });
                          setContacts(contacts.map(x => x.id === c.id ? {...x, status: newStatus} : x));
                        }} 
                        style={{ background: c.status === 'resolved' ? 'rgba(40,200,64,0.1)' : 'rgba(204,85,0,0.1)', color: c.status === 'resolved' ? '#28C840' : 'var(--primary)', fontSize: '0.75rem' }}
                      >
                        {c.status === 'resolved' ? 'Resolved' : 'Pending'}
                      </button>
                      <button className="btn btn-sm text-danger p-0" onClick={async () => {
                        if (window.confirm('Delete this query?')) {
                          await fetchAdmin(`${API_URL}/api/admin/contacts/${c.id}`, { method: 'DELETE' });
                          setContacts(contacts.filter(x => x.id !== c.id));
                        }
                      }}><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'cms' && (
          <div className="d-flex flex-column gap-4">
            {/* General Settings */}
            <div className="card border-0 p-4">
              <h5 className="fw-bold mb-4" style={{ color: 'var(--text-dark)' }}>Company Details</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-light)' }}>Company Address</label>
                  <textarea className="form-control" rows="3" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)' }} value={settings.company_address || ''} onChange={e => setSettings({...settings, company_address: e.target.value})} placeholder={"Suite 2, 9 Marsh Street\nBristol, BS1 4AA\nUnited Kingdom"} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold" style={{ color: 'var(--text-light)' }}>General Enquiries Email</label>
                  <input type="email" className="form-control" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)' }} value={settings.contact_email || ''} onChange={e => setSettings({...settings, contact_email: e.target.value})} placeholder="hello@tiffy.io" />
                </div>
                <div className="col-12 mt-4 text-end pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <button className="btn btn-primary px-4 fw-bold" onClick={async () => {
                    await fetchAdmin(`${API_URL}/api/admin/settings`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(settings) });
                    alert('Settings Saved!');
                  }}>
                    <Save size={16} className="me-2" /> Save Company Details
                  </button>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="card border-0 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>Social Media Links</h5>
                <button className="btn btn-dark fw-bold btn-sm px-3 rounded-pill" onClick={() => setShowPlatformModal(true)}>
                  <Plus size={16} className="me-1" /> Add Platform
                </button>
              </div>

              {showPlatformModal && (
                <div className="mb-4 p-4 rounded-4" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
                  <h6 className="fw-bold mb-3">Add New Social Platform</h6>
                  <div className="d-flex gap-3 align-items-end">
                    <div className="flex-grow-1">
                      <label className="form-label small">Platform Name (e.g. TikTok)</label>
                      <input type="text" className="form-control" value={newPlatformName} onChange={e => setNewPlatformName(e.target.value)} />
                    </div>
                    <button className="btn btn-primary fw-bold" onClick={() => {
                      if (newPlatformName.trim()) {
                        const key = 'social_' + newPlatformName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
                        setSettings({ ...settings, [key]: '' });
                        setShowPlatformModal(false);
                        setNewPlatformName('');
                      }
                    }}>Add Link Field</button>
                    <button className="btn btn-light fw-bold" onClick={() => setShowPlatformModal(false)}>Cancel</button>
                  </div>
                </div>
              )}

              <div className="row g-3">
                {Object.keys(settings).filter(k => k.startsWith('social_')).map(key => {
                  const platformName = key.replace('social_', '');
                  const displayName = platformName.charAt(0).toUpperCase() + platformName.slice(1);
                  return (
                    <div className="col-md-4" key={key}>
                      <div className="d-flex justify-content-between align-items-center">
                        <label className="form-label small fw-bold" style={{ color: 'var(--text-light)' }}>{displayName} URL</label>
                        <button className="btn btn-sm text-danger p-0 mb-1" onClick={async () => {
                          if (window.confirm(`Delete ${displayName} link?`)) {
                            await fetchAdmin(`${API_URL}/api/admin/settings/${key}`, { method: 'DELETE' });
                            const newSettings = { ...settings };
                            delete newSettings[key];
                            setSettings(newSettings);
                          }
                        }}><Trash2 size={12}/></button>
                      </div>
                      <input type="text" className="form-control" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)' }} value={settings[key] || ''} onChange={e => setSettings({...settings, [key]: e.target.value})} placeholder={`https://${platformName}.com/...`} />
                    </div>
                  );
                })}
                <div className="col-12 mt-4 text-end pt-3" style={{ borderTop: '1px solid var(--border-light)' }}>
                  <button className="btn btn-primary px-4 fw-bold" onClick={async () => {
                    await fetchAdmin(`${API_URL}/api/admin/settings`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(settings) });
                    alert('Settings Saved!');
                  }}>
                    <Save size={16} className="me-2" /> Save All Links
                  </button>
                </div>
              </div>
            </div>

            {/* FAQs CRUD */}
            <div className="card border-0 p-4 overflow-hidden">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                  <h5 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>FAQs & Pricing Data</h5>
                  <select className="form-select form-select-sm rounded-pill px-3" style={{ width: 'auto', background: 'var(--bg-main)', border: '1px solid var(--border-light)' }} value={queryFilter} onChange={e => setQueryFilter(e.target.value)}>
                    <option value="All">All Categories</option>
                    <option value="General">General</option>
                    <option value="Features">Features</option>
                    <option value="Pricing">Pricing</option>
                  </select>
                </div>
                <button className="btn btn-dark fw-bold btn-sm px-3 rounded-pill" onClick={() => {
                  setEditingFaq(null);
                  setFaqForm({ question: '', answer: '', category: 'General' });
                  setShowFaqModal(true);
                }}>
                  <Plus size={16} className="me-1" /> Add New
                </button>
              </div>
              
              {showFaqModal && (
                <div className="mb-4 p-4 rounded-4" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
                  <h6 className="fw-bold mb-3">{editingFaq ? 'Edit Item' : 'Create New Item'}</h6>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <label className="form-label small">Category</label>
                      <select className="form-select" value={faqForm.category} onChange={e => setFaqForm({...faqForm, category: e.target.value})}>
                        <option value="General">General FAQ</option>
                        <option value="Features">Feature FAQ</option>
                        <option value="Pricing">Pricing</option>
                      </select>
                    </div>
                    <div className="col-md-9">
                      <label className="form-label small">Question / Title</label>
                      <input type="text" className="form-control" value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} />
                    </div>
                    <div className="col-12">
                      <label className="form-label small">Answer / Description</label>
                      <textarea className="form-control" rows="3" value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})}></textarea>
                    </div>
                    <div className="col-12 d-flex gap-2">
                      <button className="btn btn-primary fw-bold" onClick={async () => {
                        if (editingFaq) {
                          await fetchAdmin(`${API_URL}/api/admin/faqs/${editingFaq.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(faqForm) });
                        } else {
                          await fetchAdmin(`${API_URL}/api/admin/faqs`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(faqForm) });
                        }
                        const r = await fetchAdmin(`${API_URL}/api/admin/all-faqs`).then(res => res.json());
                        setFaqs(r);
                        setShowFaqModal(false);
                      }}>Save Item</button>
                      <button className="btn btn-light fw-bold" onClick={() => setShowFaqModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              <table className="table table-hover mb-0">
                <thead style={{ background: 'var(--bg-elevated)' }}>
                  <tr>
                    <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Category</th>
                    <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Question</th>
                    <th className="border-0 px-4 py-3 text-end" style={{ color: 'var(--text-light)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.filter(f => (!searchQuery || f.question.toLowerCase().includes(searchQuery.toLowerCase())) && (queryFilter === 'All' || f.category === queryFilter)).map(f => (
                    <tr key={f.id}>
                      <td className="px-4 py-3 border-bottom"><span className="badge" style={{ background: 'var(--bg-main)', color: 'var(--primary)' }}>{f.category}</span></td>
                      <td className="px-4 py-3 border-bottom fw-bold" style={{ color: 'var(--text-dark)' }}>{f.question}</td>
                      <td className="px-4 py-3 border-bottom text-end">
                        <button className="btn btn-sm btn-light me-2" onClick={() => {
                          setEditingFaq(f);
                          setFaqForm({ question: f.question, answer: f.answer, category: f.category });
                          setShowFaqModal(true);
                        }}><Edit size={14}/></button>
                        <button className="btn btn-sm btn-light text-danger" onClick={async () => {
                          if (window.confirm('Delete this item?')) {
                            await fetchAdmin(`${API_URL}/api/admin/faqs/${f.id}`, { method: 'DELETE' });
                            setFaqs(faqs.filter(x => x.id !== f.id));
                          }
                        }}><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Features CRUD */}
            <div className="card border-0 p-4 overflow-hidden mt-2">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0" style={{ color: 'var(--text-dark)' }}>Features Manager</h5>
                <button className="btn btn-dark fw-bold btn-sm px-3 rounded-pill" onClick={() => {
                  setEditingFeature(null);
                  setFeatureForm({ title: '', description: '', color: 'red', gradient: 'linear-gradient(90deg,#E05252,#FFADAD)' });
                  setShowFeatureModal(true);
                }}>
                  <Plus size={16} className="me-1" /> Add Feature
                </button>
              </div>

              {showFeatureModal && (
                <div className="mb-4 p-4 rounded-4" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-light)' }}>
                  <h6 className="fw-bold mb-3">{editingFeature ? 'Edit Feature' : 'Create New Feature'}</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small">Feature Title</label>
                      <input type="text" className="form-control" value={featureForm.title} onChange={e => setFeatureForm({...featureForm, title: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small">Color/Gradient</label>
                      <select className="form-select" value={featureForm.gradient} onChange={e => setFeatureForm({...featureForm, gradient: e.target.value, color: e.target.options[e.target.selectedIndex].text.toLowerCase()})}>
                        <option value="linear-gradient(90deg,#E05252,#FFADAD)">Red</option>
                        <option value="linear-gradient(90deg,#6B68D4,#C4C3F7)">Purple</option>
                        <option value="linear-gradient(90deg,#CC6B2E,#FFBD8A)">Orange</option>
                        <option value="linear-gradient(90deg,#10B981,#6EE7B7)">Green</option>
                        <option value="linear-gradient(90deg,#3B82F6,#93C5FD)">Blue</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label small">Description</label>
                      <textarea className="form-control" rows="2" value={featureForm.description} onChange={e => setFeatureForm({...featureForm, description: e.target.value})}></textarea>
                    </div>
                    <div className="col-12 d-flex gap-2">
                      <button className="btn btn-primary fw-bold" onClick={async () => {
                        if (editingFeature) {
                          await fetchAdmin(`${API_URL}/api/admin/features/${editingFeature.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(featureForm) });
                        } else {
                          await fetchAdmin(`${API_URL}/api/admin/features`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(featureForm) });
                        }
                        const r = await fetch(`${API_URL}/api/features`).then(res => res.json());
                        setFeatures(r);
                        setShowFeatureModal(false);
                      }}>Save Feature</button>
                      <button className="btn btn-light fw-bold" onClick={() => setShowFeatureModal(false)}>Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              <table className="table table-hover mb-0">
                <thead style={{ background: 'var(--bg-elevated)' }}>
                  <tr>
                    <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Title</th>
                    <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Description</th>
                    <th className="border-0 px-4 py-3 text-end" style={{ color: 'var(--text-light)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {features.filter(f => !searchQuery || f.title.toLowerCase().includes(searchQuery.toLowerCase())).map(f => (
                    <tr key={f.id}>
                      <td className="px-4 py-3 border-bottom fw-bold" style={{ color: 'var(--text-dark)' }}>
                        <div className="d-flex align-items-center gap-2">
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: f.gradient }}></div>
                          {f.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 border-bottom small text-muted text-truncate" style={{ maxWidth: '300px' }}>{f.description}</td>
                      <td className="px-4 py-3 border-bottom text-end">
                        <button className="btn btn-sm btn-light me-2" onClick={() => {
                          setEditingFeature(f);
                          setFeatureForm({ title: f.title, description: f.description, color: f.color, gradient: f.gradient });
                          setShowFeatureModal(true);
                        }}><Edit size={14}/></button>
                        <button className="btn btn-sm btn-light text-danger" onClick={async () => {
                          if (window.confirm('Delete this feature?')) {
                            await fetchAdmin(`${API_URL}/api/admin/features/${f.id}`, { method: 'DELETE' });
                            setFeatures(features.filter(x => x.id !== f.id));
                          }
                        }}><Trash2 size={14}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      
        {activeTab === 'logs' && (
          <div className="card border-0 overflow-hidden p-0">
            <table className="table table-hover mb-0">
              <thead style={{ background: 'var(--bg-elevated)' }}>
                <tr>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Date</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Admin</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Action</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Description</th>
                  <th className="border-0 px-4 py-3" style={{ color: 'var(--text-light)' }}>Reason (if any)</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 border-bottom small" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-mid)' }}>{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3 border-bottom fw-bold" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-dark)' }}>{log.admin_username}</td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)' }}><span className="badge" style={{ background: 'var(--bg-main)', color: 'var(--primary)' }}>{log.action_type}</span></td>
                    <td className="px-4 py-3 border-bottom" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-dark)' }}>{log.description}</td>
                    <td className="px-4 py-3 border-bottom small" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-light)' }}>{log.reason || '-'}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">No audit logs found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

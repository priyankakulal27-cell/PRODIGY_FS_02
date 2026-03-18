import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [employees, setEmployees] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { 
        username: loginUser, 
        password: loginPass 
      });
      if (response.data.success) {
        setIsLoggedIn(true);
        fetchEmployees();
      }
    } catch (err) {
      alert('Access Denied! Incorrect Credentials ❌');
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/employees');
      setEmployees(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/update-employee/${editId}`, { name, position });
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/add-employee', { name, position });
      }
      setName('');
      setPosition('');
      fetchEmployees();
    } catch (err) {
      alert('Operation failed');
    }
  };

  const deleteEmployee = async (id) => {
    if(window.confirm("Delete this record?")) {
      try {
        await axios.delete('http://localhost:5000/delete-employee/' + id);
        fetchEmployees();
      } catch (err) {
        alert('Error deleting');
      }
    }
  };

  // Modern Styles
  const containerStyle = { fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '40px' };
  const cardStyle = { backgroundColor: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '80px auto', textAlign: 'center' };
  const inputStyle = { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
  const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#4A90E2', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' };

  if (!isLoggedIn) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={{ color: '#1a1a1a', marginBottom: '10px' }}>Employee Portal</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Secure Login for Administrators</p>
          <form onSubmit={handleLogin}>
            <input placeholder="Username" style={inputStyle} onChange={(e) => setLoginUser(e.target.value)} />
            <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setLoginPass(e.target.value)} />
            <button type="submit" style={btnStyle}>Sign In</button>
          </form>
          <p style={{ fontSize: '11px', color: '#999', marginTop: '15px' }}>Hint: {loginUser === 'shreyanka' ? 'Correct Username' : 'Enter Username'}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#333' }}>Dashboard</h1>
          <div style={{ textAlign: 'right' }}>
            <span style={{ marginRight: '15px', color: '#666' }}>Welcome, <b>Shreyanka</b></span>
            <button onClick={() => setIsLoggedIn(false)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #dcdcdc', background: '#fff', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '12px', marginBottom: '40px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: 0 }}>{editId ? "Edit Employee" : "Register New Employee"}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '15px' }}>
            <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
            <input placeholder="Position" value={position} onChange={(e) => setPosition(e.target.value)} style={inputStyle} required />
            <button type="submit" style={{ ...btnStyle, width: '180px', backgroundColor: editId ? '#f5a623' : '#2ecc71' }}>
              {editId ? "Update Info" : "Add Record"}
            </button>
          </form>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <thead>
            <tr style={{ backgroundColor: '#4A90E2', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '20px' }}>Name</th>
              <th style={{ padding: '20px' }}>Position</th>
              <th style={{ padding: '20px', textAlign: 'right' }}>Management</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '20px' }}>{emp.name}</td>
                <td style={{ padding: '20px' }}>{emp.position}</td>
                <td style={{ padding: '20px', textAlign: 'right' }}>
                  <button onClick={() => { setName(emp.name); setPosition(emp.position); setEditId(emp._id); }} style={{ marginRight: '15px', border: 'none', background: 'none', color: '#4A90E2', cursor: 'pointer', fontWeight: '600' }}>Edit</button>
                  <button onClick={() => deleteEmployee(emp._id)} style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: '600' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
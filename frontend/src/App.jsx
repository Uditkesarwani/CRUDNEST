
import './App.css'
import { useState, useEffect } from 'react';
function App() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [users, setUsers] = useState([]);
  const [bool, setBool] = useState(false);
  const [id, setId] = useState('');
  const fetchUsers = async () => {
    const response = await fetch('http://localhost:3000/users');
    const data = await response.json();
    setUsers(data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (bool) {
      try {
        const response = await fetch(`http://localhost:3000/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (data) {
          fetchUsers();
        } else {
          alert('Failed to update user');
        }
        setFormData({
          name: '',
          email: '',
          password: ''
        });
        setBool(false);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    } else {
      try {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();

        // console.log(data);
        // Update the users list with the new user
        if (data) {
          fetchUsers();
        } else {
          alert('Failed to create user');
        }
        // Clear the form
        setFormData({
          name: '',
          email: '',
          password: ''
        });
      } catch (error) {
        console.error('Error creating user:', error);
      }
    }
  }

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE'
    });
    // Update the users list after deletion
    setUsers(users.filter(user => user._id !== id));
  }



  return (
    <>
      <h1>CRUD Application with NestJS and React</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button type="submit">{bool ? 'Update' : 'Create'} User</button>
        </div>
      </form>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user._id} className="user-item">
            {user.name} - {user.email}
            <button onClick={() => handleDelete(user._id)}>Delete User</button>
            <button onClick={() => { setFormData({ name: user.name, email: user.email, password: '' }), setBool(true), setId(user._id) }}>Update User</button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default App

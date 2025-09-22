import { useDispatch } from 'react-redux';
import { setToken } from '../store/authSlice.js';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css'; // ✅ This is the line you're asking about

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/signup', { username, password });
      const token = res.data.token;
      localStorage.setItem('jwt', token);
      dispatch(setToken(token));
      toast.success('Account created! Minions are ready.');
      setTimeout(() => navigate('/reserved'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="login-form">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className={`w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 ${loading ? 'animate-bounce' : ''}`}>
        <img src="/images/villain-avatar.png" alt="Villain Avatar" className="w-full h-full object-cover" />
      </div>
      <h2 className="text-3xl font-bold text-villainPurple mb-6 text-center">Create Your Villain Account</h2>
      <input
        className="login-input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoFocus
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="login-button"
      >
        {loading ? 'Summoning Minions...' : 'Create Account'}
      </button>
    </form>
  );
}
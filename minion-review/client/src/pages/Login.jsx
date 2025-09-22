import { useDispatch } from 'react-redux';
import { setToken } from '../store/authSlice.js';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ FIXED: Correct backend route
      const res = await axios.post('http://localhost:4000/api/login', { username, password });
      const token = res.data.token;
      localStorage.setItem('jwt', token);
      dispatch(setToken(token));
      toast.success('Minions deployed successfully!');
      setTimeout(() => navigate('/reserved'), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md relative">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* === Animated Villain Avatar === */}
      <div className={`w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 transition-transform ${loading ? 'animate-bounce' : ''}`}>
        <img src="/images/villain-avatar.png" alt="Villain Avatar" className="w-full h-full object-cover" />
      </div>

      <h2 className="text-3xl font-bold text-villainPurple mb-6 text-center">Villain Login</h2>

      <input
        className="border border-gray-300 p-3 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-villainPurple"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoFocus
      />

      <input
        className="border border-gray-300 p-3 mb-4 w-full rounded focus:outline-none focus:ring-2 focus:ring-villainPurple"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded font-bold text-white transition-transform ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-villainPurple hover:scale-105'
        }`}
      >
        {loading ? 'Deploying Minions...' : 'Login'}
      </button>
    </form>
  );
}
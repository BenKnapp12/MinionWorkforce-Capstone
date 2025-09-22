import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Reviews from "./pages/Reviews.jsx";
import Submit from "./pages/Submit.jsx";
import Login from "./pages/Login.jsx";
import TopMinions from "./pages/TopMinions.jsx";
import Signup from "./pages/Signup.jsx"; // ✅ NEW
import './styles/base.css';
import './styles/navbar.css';
import './styles/minions.css';
import './styles/reviews.css';
import './styles/forms.css';
import './styles/home.css';

function App() {
  return (
    <BrowserRouter>
      <nav className="main-nav">
        <Link to="/" className="nav-link">🏠 Home</Link>
        <Link to="/reviews" className="nav-link">📝 Reviews</Link>
        <Link to="/submit" className="nav-link">🚀 Submit</Link>
        <Link to="/login" className="nav-link">🔐 Login</Link>
        <Link to="/signup" className="nav-link">🧪 Signup</Link> {/* ✅ NEW */}
        <Link to="/top-minions" className="nav-link highlight-link">🔥 Top Minions</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> {/* ✅ NEW */}
        <Route path="/top-minions" element={<TopMinions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
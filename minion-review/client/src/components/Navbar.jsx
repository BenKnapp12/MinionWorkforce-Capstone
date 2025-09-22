import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-villainPurple text-white p-4 flex gap-4">
      <Link to="/">Home</Link>
      <Link to="/reviews">Reviews</Link>
      <Link to="/submit">Submit</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}

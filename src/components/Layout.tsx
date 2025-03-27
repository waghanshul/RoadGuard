import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleReportClick = () => {
    if (isAuthenticated) {
      navigate('/report');
    } else {
      navigate('/signin');
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <nav className="bg-secondary-900 text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-primary-500 icon-spin" />
            <span className="text-2xl font-bold">RoadGuard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/how-it-works" className="nav-link">How It Works</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/faq" className="nav-link">FAQs</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="nav-link">Sign In</Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
            
            <button
              onClick={handleReportClick}
              className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors"
            >
              Report Violation
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link to="/" className="block py-2">Home</Link>
            <Link to="/how-it-works" className="block py-2">How It Works</Link>
            <Link to="/about" className="block py-2">About</Link>
            <Link to="/faq" className="block py-2">FAQs</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2">Dashboard</Link>
                <button
                  onClick={signOut}
                  className="w-full text-left py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/signin" className="block py-2">Sign In</Link>
                <Link to="/signup" className="block py-2">Sign Up</Link>
              </>
            )}
            
            <button
              onClick={handleReportClick}
              className="w-full py-2 rounded-lg bg-primary-500 hover:bg-primary-600 transition-colors"
            >
              Report Violation
            </button>
          </div>
        )}
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="bg-secondary-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About RoadGuard</h3>
              <p className="text-secondary-300">Making roads safer through citizen engagement and modern technology.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/how-it-works" className="text-secondary-300 hover:text-white">How It Works</Link></li>
                <li><Link to="/about" className="text-secondary-300 hover:text-white">About Us</Link></li>
                <li><Link to="/faq" className="text-secondary-300 hover:text-white">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-secondary-300 hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-secondary-300 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-secondary-300">support@roadguard.com</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-secondary-700 text-center text-secondary-300">
            <p>&copy; {new Date().getFullYear()} RoadGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

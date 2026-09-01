import { Link } from 'react-router-dom';
import { MapPin, Heart, User, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <MapPin size={24} />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">
                TN<span className="text-primary-600">Eats</span>
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-900 font-medium hover:text-primary-600 transition-colors">Home</Link>
            <Link to="/restaurants" className="text-gray-500 hover:text-primary-600 transition-colors">Explore</Link>
            <a href="#" className="text-gray-500 hover:text-primary-600 transition-colors">Favorites</a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-primary-600 p-2 hidden sm:block">
              <Search size={20} />
            </button>
            <button className="text-gray-500 hover:text-primary-600 p-2">
              <Heart size={20} />
            </button>
            <button className="flex items-center gap-2 bg-primary-50 text-primary-700 hover:bg-primary-100 px-4 py-2 rounded-full font-medium transition-colors">
              <User size={18} />
              <span className="hidden sm:inline">Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

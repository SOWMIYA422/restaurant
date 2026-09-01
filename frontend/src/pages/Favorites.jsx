import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const loadFavorites = () => {
    const savedFavs = JSON.parse(localStorage.getItem('restaurant_favorites') || '[]');
    setFavorites(savedFavs);
  };

  useEffect(() => {
    loadFavorites();
    
    // Listen for changes from RestaurantCard toggles
    window.addEventListener('favorites_updated', loadFavorites);
    return () => window.removeEventListener('favorites_updated', loadFavorites);
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-32">
      {/* Header */}
      <div className="bg-slate-900 pt-12 pb-8 px-6 text-white border-b-4 border-primary-500 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="bg-red-500/20 p-3 rounded-2xl text-red-500">
            <Heart size={32} className="fill-red-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-1 tracking-tight font-serif text-white">Your Favorites</h1>
            <p className="text-slate-300 font-medium text-sm md:text-base">Saved spots you love</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map(restaurant => (
              <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-8">
            <div className="bg-red-50 p-6 rounded-full mb-6">
              <Heart size={48} className="text-red-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No favorites yet</h3>
            <p className="text-slate-500 max-w-sm mb-8 text-lg">
              You haven't saved any restaurants to your favorites. Start exploring to find places you love!
            </p>
            <button 
              onClick={() => navigate('/restaurants')}
              className="bg-primary-500 hover:bg-primary-400 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-primary-500/20 flex items-center gap-2"
            >
              <Search size={20} />
              Explore Restaurants
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

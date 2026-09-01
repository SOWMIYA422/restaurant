import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SlidersHorizontal, Map as MapIcon, List, Search as SearchIcon } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { searchRestaurants } from '../services/api';

const RestaurantListing = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const area = searchParams.get('area') || 'Tamil Nadu';

  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  // Filters state
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchRestaurants(area);
        setRestaurants(data);
      } catch (err) {
        setError('Failed to fetch restaurants. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, [area]);

  // Apply filters
  const filteredRestaurants = restaurants.filter(r => {
    if (selectedRating > 0 && (r.rating || 0) < selectedRating) return false;
    
    // Simplistic price filter mapping since API returns strings/enums
    if (selectedPrice === 'cheap' && r.price_level !== 'PRICE_LEVEL_INEXPENSIVE' && r.price_level !== 1) return false;
    if (selectedPrice === 'moderate' && r.price_level !== 'PRICE_LEVEL_MODERATE' && r.price_level !== 2) return false;
    if (selectedPrice === 'expensive' && r.price_level !== 'PRICE_LEVEL_EXPENSIVE' && r.price_level !== 3) return false;
    
    if (selectedCuisine && !r.types?.includes(selectedCuisine)) return false;
    
    return true;
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Header & Search Summary */}
      <div className="bg-slate-900 pt-12 pb-8 px-6 text-white border-b-4 border-primary-500 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight font-serif text-white">Restaurants in {area}</h1>
          <p className="text-slate-300 font-medium text-base md:text-lg">{filteredRestaurants.length} exceptional places to dine</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Section (Sidebar on Desktop, Stacked on Mobile) */}
        <div className="w-full lg:w-72 flex-shrink-0">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-slate-200 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 uppercase tracking-widest text-sm">
                <SlidersHorizontal size={18} className="text-primary-600" />
                Filters
              </h2>
              <button 
                onClick={() => { setSelectedRating(0); setSelectedPrice(''); setSelectedCuisine(''); }}
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-primary-600 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Rating</h3>
              <div className="space-y-2">
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="rating" 
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      checked={selectedRating === rating}
                      onChange={() => setSelectedRating(rating)}
                    />
                    <span className="text-gray-700 group-hover:text-primary-600 transition-colors">{rating}+ Stars</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-widest">Price Range</h3>
              <div className="flex gap-2">
                {[
                  { id: 'cheap', label: '₹' },
                  { id: 'moderate', label: '₹₹' },
                  { id: 'expensive', label: '₹₹₹' }
                ].map(price => (
                  <button
                    key={price.id}
                    onClick={() => setSelectedPrice(selectedPrice === price.id ? '' : price.id)}
                    className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all border ${
                      selectedPrice === price.id 
                        ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-[1.02]' 
                        : 'bg-transparent text-slate-600 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    {price.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisine Filter (Simplified for MVP) */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Cuisine</h3>
              <div className="space-y-2">
                {[
                  { id: 'indian_restaurant', label: 'Indian' },
                  { id: 'south_indian_restaurant', label: 'South Indian' },
                  { id: 'vegetarian_restaurant', label: 'Vegetarian' },
                  { id: 'chinese_restaurant', label: 'Chinese' },
                  { id: 'fast_food_restaurant', label: 'Fast Food' }
                ].map(cuisine => (
                  <label key={cuisine.id} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="cuisine" 
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      checked={selectedCuisine === cuisine.id}
                      onChange={() => setSelectedCuisine(cuisine.id)}
                    />
                    <span className="text-gray-700 group-hover:text-primary-600 transition-colors">{cuisine.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 pb-4">
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-6 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
            <div className="relative pl-2">
               <select className="bg-transparent border-none text-slate-900 font-bold focus:ring-0 cursor-pointer text-sm pr-8 outline-none appearance-none">
                 <option>Recommended</option>
                 <option>Highest Rated</option>
               </select>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={20} />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-primary-600 border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MapIcon size={20} />
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
              <p className="font-semibold text-lg">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-2xl h-80 border border-gray-100 overflow-hidden shadow-sm">
                  <div className="bg-gray-200 h-48 w-full"></div>
                  <div className="p-5">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-10 bg-gray-100 rounded-xl w-full mt-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results State */}
          {!isLoading && !error && (
            <>
              {viewMode === 'list' ? (
                <>
                  {filteredRestaurants.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRestaurants.map(restaurant => (
                        <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                      <div className="bg-gray-50 p-4 rounded-full mb-4">
                        <SearchIcon size={32} className="text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">No restaurants found</h3>
                      <p className="text-gray-500 max-w-md mb-6">
                        We couldn't find any restaurants matching your current filters in this area.
                      </p>
                      <button 
                        onClick={() => { setSelectedRating(0); setSelectedPrice(''); setSelectedCuisine(''); }}
                        className="bg-primary-50 text-primary-700 px-6 py-2 rounded-xl font-medium hover:bg-primary-100 transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-200 rounded-2xl h-[600px] flex items-center justify-center border border-gray-300">
                  <p className="text-gray-600 font-medium">Map View (Integration pending in this phase)</p>
                  {/* Note: @react-google-maps/api would be implemented here */}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantListing;

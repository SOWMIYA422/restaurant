import { useState } from 'react';
import { Search, Compass } from 'lucide-react';
import { searchRestaurants } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

const Explore = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // searchRestaurants hits GET /api/restaurants?area={query}
      // The backend will append "restaurants in {query}" and query Google Places
      const data = await searchRestaurants(query);
      setResults(data);
    } catch (err) {
      setError('Failed to fetch restaurants. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-32">
      {/* Header & Search Bar */}
      <div className="bg-slate-900 pt-12 pb-12 px-6 text-white border-b-4 border-primary-500 shadow-lg relative rounded-b-[40px]">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="bg-primary-500/20 p-3 rounded-2xl text-primary-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Compass size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 tracking-tight font-serif text-white">
            Explore Places
          </h1>
          <p className="text-slate-300 font-medium text-sm md:text-base">
            Type the name of any restaurant to find its details (e.g. "Buhari", "A2B T Nagar")
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative z-10 -mb-20">
          <div className="bg-white p-2 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100">
            <div className="pl-4 text-slate-400">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none text-slate-900 text-lg py-3 focus:outline-none placeholder-slate-400 font-medium"
              placeholder="Search for a specific restaurant..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button 
              type="submit"
              disabled={!query.trim() || isLoading}
              className="bg-primary-500 hover:bg-primary-400 text-slate-950 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8">
        
        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl text-center max-w-2xl mx-auto">
            <p className="font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 border border-slate-100 shadow-sm">
                <div className="bg-slate-200 h-48 w-full rounded-t-2xl"></div>
                <div className="p-5">
                  <div className="h-5 bg-slate-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-slate-100 rounded w-1/2 mb-4"></div>
                  <div className="h-10 bg-slate-50 rounded-xl w-full mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results State */}
        {!isLoading && !error && hasSearched && (
          <>
            {results.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">Search Results for "{query}"</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map(restaurant => (
                    <RestaurantCard key={restaurant.place_id} restaurant={restaurant} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center max-w-2xl mx-auto mt-8">
                <div className="bg-slate-50 p-5 rounded-full mb-5 text-slate-400 mx-auto w-fit">
                  <Search size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-500">
                  We couldn't find any restaurants matching "{query}". Try a different name or location.
                </p>
              </div>
            )}
          </>
        )}

        {/* Empty State / Prompt */}
        {!isLoading && !error && !hasSearched && (
          <div className="text-center mt-16 max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-4 opacity-60 pointer-events-none filter blur-sm">
               <div className="bg-slate-200 h-32 rounded-2xl"></div>
               <div className="bg-slate-200 h-32 rounded-2xl"></div>
            </div>
            <p className="text-slate-500 font-medium mt-6 text-lg">
              Type the name of a restaurant above to see its ratings, price, and location.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Explore;

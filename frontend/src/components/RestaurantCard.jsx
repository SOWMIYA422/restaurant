import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if favorite on mount
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('restaurant_favorites') || '[]');
    setIsFavorite(favorites.some(fav => fav.place_id === restaurant.place_id));
  }, [restaurant.place_id]);

  const toggleFavorite = (e) => {
    e.preventDefault(); // Prevent navigating to details page
    const favorites = JSON.parse(localStorage.getItem('restaurant_favorites') || '[]');
    let newFavorites;
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.place_id !== restaurant.place_id);
    } else {
      newFavorites = [...favorites, restaurant];
    }
    
    localStorage.setItem('restaurant_favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
    
    // Dispatch event so Favorites page can update if we're on it
    window.dispatchEvent(new Event('favorites_updated'));
  };

  // Generate deterministic unique images based on restaurant name
  const getUniqueImages = (name) => {
    const seed = name ? (name.length + name.charCodeAt(0) + name.charCodeAt(name.length - 1)) : 0;
    const pool = [
      'https://picsum.photos/seed/food1/400/300',
      'https://picsum.photos/seed/food2/400/300',
      'https://picsum.photos/seed/food3/400/300',
      'https://picsum.photos/seed/food4/400/300',
      'https://picsum.photos/seed/food5/400/300',
      'https://picsum.photos/seed/food6/400/300',
      'https://picsum.photos/seed/food7/400/300',
      'https://picsum.photos/seed/food8/400/300',
      'https://picsum.photos/seed/food9/400/300',
      'https://picsum.photos/seed/food10/400/300'
    ];
    
    return [
      pool[(seed) % pool.length],
      pool[(seed + 3) % pool.length],
      pool[(seed + 7) % pool.length]
    ];
  };

  const carouselImages = getUniqueImages(restaurant.name);

  const nextImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
  };

  // Format price level to ₹ symbols
  const renderPriceLevel = (level) => {
    if (level === "PRICE_LEVEL_INEXPENSIVE" || level === 1) return "₹";
    if (level === "PRICE_LEVEL_MODERATE" || level === 2) return "₹₹";
    if (level === "PRICE_LEVEL_EXPENSIVE" || level === 3) return "₹₹₹";
    if (level === "PRICE_LEVEL_VERY_EXPENSIVE" || level === 4) return "₹₹₹₹";
    return "₹₹"; // default
  };

  // Format types for display (e.g. "south_indian_restaurant" -> "South Indian")
  const formatType = (type) => {
    if (!type) return '';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(' Restaurant', '');
  };

  const displayTypes = restaurant.types?.slice(0, 2).map(formatType).join(' • ') || 'Restaurant';

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-primary-200 hover:border-primary-400 flex flex-col h-full group transform hover:-translate-y-1">
      {/* Image Carousel */}
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <img 
          src={carouselImages[currentImageIndex]} 
          alt={restaurant.name} 
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            e.target.src = 'https://picsum.photos/seed/fallback/400/300';
          }}
        />
        
        {/* Carousel Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={prevImage} className="bg-slate-900/60 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-primary-500 active:scale-90 transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextImage} className="bg-slate-900/60 text-white p-1.5 rounded-full backdrop-blur-sm hover:bg-primary-500 active:scale-90 transition-all">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
          {carouselImages.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-primary-400' : 'w-1.5 bg-white/50'}`}></div>
          ))}
        </div>

        {restaurant.open_now !== undefined && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md ${restaurant.open_now ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {restaurant.open_now ? 'OPEN' : 'CLOSED'}
          </div>
        )}

        {/* Favorite Button */}
        <button 
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-md transition-all active:scale-90 group/fav"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          <Heart 
            size={18} 
            className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/fav:text-red-500'}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-primary-600 transition-colors line-clamp-1">
            {restaurant.name}
          </h3>
          {restaurant.rating && (
            <div className="flex items-center bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md">
              <span className="font-bold text-sm mr-1">{restaurant.rating}</span>
              <Star size={14} className="fill-green-600" />
            </div>
          )}
        </div>

        <div className="text-sm text-slate-500 mb-3 flex items-center gap-2 font-medium">
          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">{renderPriceLevel(restaurant.price_level)}</span>
          <span className="text-slate-300">•</span>
          <span className="truncate">{displayTypes}</span>
        </div>

        <div className="flex items-start text-sm text-slate-500 mb-5 mt-auto">
          <MapPin size={16} className="text-primary-500 mr-1 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-2 leading-snug">{restaurant.formatted_address}</span>
        </div>

        {/* Action Button */}
        <Link 
          to={`/restaurant/${restaurant.place_id}`}
          className="block w-full text-center border border-primary-500 hover:bg-primary-500 hover:text-white text-primary-600 font-bold py-3 rounded-lg transition-all duration-300 uppercase tracking-wider text-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;

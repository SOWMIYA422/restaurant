import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Globe, Clock, Heart, ArrowLeft, Share2 } from 'lucide-react';
import { getRestaurantDetails } from '../services/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getRestaurantDetails(id);
        setRestaurant(data);
      } catch (err) {
        setError('Failed to load restaurant details.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="h-[400px] bg-gray-200 rounded-3xl mb-8"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Restaurant not found'}</h2>
        <Link to="/" className="text-primary-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const imageUrl = restaurant.photo_reference 
    ? `https://places.googleapis.com/v1/${restaurant.photo_reference}/media?maxHeightPx=800&maxWidthPx=1200&key=YOUR_API_KEY` 
    : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';

  const formatType = (type) => {
    if (!type) return '';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace(' Restaurant', '');
  };
  const displayTypes = restaurant.types?.map(formatType).join(' • ');

  const renderPriceLevel = (level) => {
    if (level === "PRICE_LEVEL_INEXPENSIVE" || level === 1) return "₹";
    if (level === "PRICE_LEVEL_MODERATE" || level === 2) return "₹₹";
    if (level === "PRICE_LEVEL_EXPENSIVE" || level === 3) return "₹₹₹";
    if (level === "PRICE_LEVEL_VERY_EXPENSIVE" || level === 4) return "₹₹₹₹";
    return "₹₹";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Navigation */}
      <div className="mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-gray-500 hover:text-primary-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to results
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-lg mb-10 group">
        <img 
          src={imageUrl} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute top-4 right-4 flex gap-3">
          <button className="bg-white/90 backdrop-blur text-gray-900 p-3 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors shadow-sm">
            <Share2 size={20} />
          </button>
          <button className="bg-white/90 backdrop-blur text-gray-900 p-3 rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors shadow-sm">
            <Heart size={20} />
          </button>
        </div>
        
        {/* Name overlaid on image for impact */}
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-md">
                {restaurant.name}
              </h1>
              <p className="text-lg text-gray-200 font-medium drop-shadow-sm flex items-center flex-wrap gap-2">
                <span>{displayTypes}</span>
                <span className="text-white/50">•</span>
                <span className="text-green-400 font-bold tracking-widest">{renderPriceLevel(restaurant.price_level)}</span>
              </p>
            </div>
            {restaurant.rating && (
              <div className="flex items-center bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
                <span className="text-green-700 font-bold text-2xl mr-2">{restaurant.rating}</span>
                <div>
                  <div className="flex text-green-500">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} size={16} fill={star <= Math.round(restaurant.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {restaurant.user_ratings_total} reviews
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Section */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Overview</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-primary-50 p-3 rounded-xl mr-4 text-primary-600 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600 leading-relaxed">{restaurant.formatted_address}</p>
                  {restaurant.url && (
                    <a href={restaurant.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm font-medium mt-2 inline-block">
                      Get Directions
                    </a>
                  )}
                </div>
              </div>

              {restaurant.formatted_phone_number && (
                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-xl mr-4 text-primary-600 shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">{restaurant.formatted_phone_number}</p>
                  </div>
                </div>
              )}

              {restaurant.website && (
                <div className="flex items-start">
                  <div className="bg-primary-50 p-3 rounded-xl mr-4 text-primary-600 shrink-0">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                      Visit Website
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Opening Hours */}
          {restaurant.opening_hours && restaurant.opening_hours.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock size={20} className="mr-2 text-primary-600" />
                Opening Hours
              </h3>
              <ul className="space-y-3">
                {restaurant.opening_hours.map((day, index) => {
                  const [dayName, ...timeArr] = day.split(': ');
                  const time = timeArr.join(': ');
                  // Highlight today (simplified logic)
                  const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === dayName;
                  
                  return (
                    <li key={index} className={`flex justify-between text-sm ${isToday ? 'font-bold text-primary-700 bg-primary-50 p-2 rounded-lg -mx-2' : 'text-gray-600'}`}>
                      <span>{dayName}</span>
                      <span>{time}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Action Card */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 rounded-3xl text-white shadow-lg shadow-primary-900/20 text-center">
             <h3 className="text-2xl font-bold mb-2">Ready to eat?</h3>
             <p className="text-primary-100 mb-6 text-sm">Save this place for later or get directions now.</p>
             <button className="w-full bg-white text-primary-700 font-bold py-3 rounded-xl mb-3 hover:bg-gray-50 transition-colors">
               Add to Favorites
             </button>
             {restaurant.url && (
               <a 
                 href={restaurant.url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="block w-full border border-primary-400 hover:bg-primary-500 text-white font-semibold py-3 rounded-xl transition-colors"
               >
                 View on Google Maps
               </a>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;

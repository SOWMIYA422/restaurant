import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ChevronRight } from 'lucide-react';
import { getCities, getAreas } from '../services/api';

const Home = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const citiesData = await getCities();
        setCities(citiesData);
        // Pre-select Chennai by default if available
        if (citiesData.length > 0) {
          const chennai = citiesData.find(c => c.name.toLowerCase() === 'chennai');
          setSelectedCity(chennai ? chennai.id : citiesData[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch cities", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchAreas = async () => {
      if (!selectedCity) return;
      try {
        const areasData = await getAreas(selectedCity);
        setAreas(areasData);
        if (areasData.length > 0) {
          setSelectedArea(areasData[0].name);
        } else {
          setSelectedArea('');
        }
      } catch (error) {
        console.error("Failed to fetch areas", error);
      }
    };
    fetchAreas();
  }, [selectedCity]);

  const handleExplore = () => {
    if (selectedArea) {
      navigate(`/restaurants?area=${encodeURIComponent(selectedArea)}`);
    }
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-slate-900 mb-12">
        
        {/* Semi-Dark Royal Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-primary-600 rounded-full mix-blend-overlay filter blur-[100px] opacity-40"></div>
          <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-slate-500 rounded-full mix-blend-overlay filter blur-[100px] opacity-20"></div>
          <div className="absolute -bottom-24 left-1/3 w-[400px] h-[400px] bg-primary-800 rounded-full mix-blend-overlay filter blur-[80px] opacity-30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto mt-[-30px]">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-xl font-serif">
            Discover the Royal Tastes<br />
            <span className="text-primary-400 italic">of Tamil Nadu</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-12 font-medium max-w-2xl mx-auto drop-shadow-sm leading-relaxed">
            A curated journey through the finest culinary hotspots, iconic dishes, and legendary restaurants across the state.
          </p>

          {/* Search Box - Premium American Style */}
          <div className="bg-white/10 p-2 md:p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl mx-auto backdrop-blur-md border border-white/10 relative z-20">
            {/* City Selector */}
            <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 md:py-4 cursor-pointer hover:bg-slate-800 transition-colors group">
              <div className="bg-slate-800 p-2 rounded-lg mr-3 text-primary-400 group-hover:scale-110 transition-transform">
                <MapPin size={22} />
              </div>
              <div className="flex-1 text-left">
                <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Select City</label>
                <select 
                  className="w-full bg-transparent border-none text-white text-base md:text-lg font-bold focus:ring-0 cursor-pointer outline-none appearance-none p-0"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <option className="bg-slate-900 text-white">Loading...</option>
                  ) : (
                    cities.map(city => (
                      <option className="bg-slate-900 text-white" key={city.id} value={city.id}>{city.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Area Selector */}
            <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 md:py-4 cursor-pointer hover:bg-slate-800 transition-colors group">
              <div className="bg-slate-800 p-2 rounded-lg mr-3 text-primary-400 group-hover:scale-110 transition-transform">
                <MapPin size={22} />
              </div>
              <div className="flex-1 text-left">
                <label className="block text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Select Area</label>
                <select 
                  className="w-full bg-transparent border-none text-white text-base md:text-lg font-bold focus:ring-0 cursor-pointer outline-none appearance-none p-0"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  disabled={areas.length === 0}
                >
                  {areas.length === 0 ? (
                    <option className="bg-slate-900 text-white" value="">No areas available</option>
                  ) : (
                    areas.map(area => (
                      <option className="bg-slate-900 text-white" key={area.id} value={area.name}>{area.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              onClick={handleExplore}
              disabled={!selectedArea}
              className="bg-primary-500 hover:bg-primary-400 text-slate-950 px-6 py-4 rounded-xl font-bold text-lg md:text-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 w-full md:w-auto"
            >
              <Search size={22} />
              <span className="hidden md:inline">Explore</span>
            </button>
          </div>
        </div>
      </section>

      {/* All Districts */}
      <section className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-3 tracking-tight">Explore Tamil Nadu</h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">Discover iconic restaurants across all {cities.length} districts of the state</p>
          <div className="w-16 h-1 bg-primary-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {isLoading ? (
          <div className="text-center text-slate-500 py-10">Loading districts...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {cities.map((city) => (
              <div 
                key={city.id} 
                onClick={() => navigate(`/areas?city_id=${city.id}&city_name=${encodeURIComponent(city.name)}`)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white border border-slate-100 hover:border-primary-400"
              >
                <div className="aspect-[4/3] bg-slate-200">
                  <img 
                    src={`https://picsum.photos/seed/${city.name.toLowerCase()}/300/200`} 
                    alt={city.name} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-sm md:text-base font-bold text-white mb-1 drop-shadow-md truncate">{city.name}</h3>
                  <div className="w-8 h-0.5 bg-primary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

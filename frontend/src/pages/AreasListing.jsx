import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAreas } from '../services/api';
import { MapPin, ChevronRight, Compass } from 'lucide-react';

const AreasListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const cityId = searchParams.get('city_id');
  const cityName = searchParams.get('city_name') || 'the city';

  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAreasData = async () => {
      if (!cityId) {
        setError('No city selected.');
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAreas(cityId);
        if (data.length === 0) {
          // Fallback to local data mapping if DB has no areas seeded
          const districtAreas = {
            "Ariyalur": ["Ariyalur", "Jayankondam", "Andimadam", "Sendurai", "Udayarpalayam", "T.Palur", "Tirumanur", "Varadarajanpettai", "Meensurutti"],
            "Chengalpattu": ["Chengalpattu", "Tambaram", "Pallavaram", "Guduvanchery", "Maraimalai Nagar", "Singaperumal Koil", "Kelambakkam", "Vandalur", "Madurantakam", "Mahabalipuram"],
            "Chennai": ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "Guindy", "Mylapore", "Nungambakkam", "Egmore", "Saidapet", "Tambaram", "Perambur", "Ambattur", "Porur", "Royapettah", "Triplicane", "Kodambakkam", "Sholinganallur"],
            "Coimbatore": ["Coimbatore", "Pollachi", "Mettupalayam", "Sulur", "Valparai", "Annur", "Kinathukadavu", "Perur", "Karamadai"],
            "Cuddalore": ["Cuddalore", "Chidambaram", "Panruti", "Virudhachalam", "Neyveli", "Tittakudi", "Bhuvanagiri", "Parangipettai", "Kattumannarkoil"],
            "Dharmapuri": ["Dharmapuri", "Harur", "Pennagaram", "Palacode", "Pappireddipatti", "Karimangalam"],
            "Dindigul": ["Dindigul", "Palani", "Kodaikanal", "Oddanchatram", "Vedasandur", "Nilakottai", "Natham", "Batlagundu"],
            "Erode": ["Erode", "Bhavani", "Gobichettipalayam", "Sathyamangalam", "Perundurai", "Anthiyur", "Chennimalai", "Kodumudi", "Modakurichi"],
            "Kallakurichi": ["Kallakurichi", "Chinnasalem", "Sankarapuram", "Ulundurpet", "Tirukkoilur", "Kalvarayan Hills"],
            "Kanchipuram": ["Kancheepuram", "Sriperumbudur", "Kundrathur", "Walajabad", "Uthiramerur", "Sunguvarchatram"],
            "Kanyakumari": ["Nagercoil", "Kanyakumari", "Kuzhithurai", "Marthandam", "Colachel", "Thuckalay", "Suchindram", "Eraniel"],
            "Karur": ["Karur", "Kulithalai", "Aravakurichi", "Krishnarayapuram", "Pugalur", "Velayuthampalayam"],
            "Krishnagiri": ["Krishnagiri", "Hosur", "Denkanikottai", "Uthangarai", "Pochampalli", "Bargur", "Kelamangalam"],
            "Madurai": ["Madurai", "Melur", "Tirumangalam", "Usilampatti", "Vadipatti", "Peraiyur", "Thirupparankundram"],
            "Mayiladuthurai": ["Mayiladuthurai", "Sirkazhi", "Poompuhar", "Kuthalam", "Kollidam", "Vaitheeswarankoil"],
            "Nagapattinam": ["Nagapattinam", "Vedaranyam", "Kilvelur", "Tharangambadi", "Velankanni", "Thirukkuvalai"],
            "Namakkal": ["Namakkal", "Tiruchengode", "Rasipuram", "Paramathi-Velur", "Komarapalayam", "Sendamangalam", "Kolli Hills"],
            "Perambalur": ["Perambalur", "Kunnam", "Veppanthattai", "Alathur", "Labbaikudikadu"],
            "Pudukkottai": ["Pudukkottai", "Aranthangi", "Alangudi", "Keeranur", "Iluppur", "Gandarvakottai", "Avudaiyarkoil"],
            "Ramanathapuram": ["Ramanathapuram", "Rameswaram", "Paramakudi", "Mandapam", "Keelakarai", "Kamuthi", "Mudukulathur", "Sayalkudi"],
            "Ranipet": ["Ranipet", "Arcot", "Walajapet", "Arakkonam", "Sholinghur", "Melvisharam"],
            "Salem": ["Salem", "Mettur", "Attur", "Edappadi", "Sankari", "Omalur", "Vazhapadi", "Yercaud", "Gangavalli"],
            "Sivaganga": ["Sivaganga", "Karaikudi", "Devakottai", "Manamadurai", "Ilayangudi", "Tirupattur", "Kalayarkoil"],
            "Tenkasi": ["Tenkasi", "Sankarankovil", "Kadayanallur", "Shenkottai", "Surandai", "Alangulam", "Vasudevanallur"],
            "Thanjavur": ["Thanjavur", "Kumbakonam", "Pattukkottai", "Papanasam", "Peravurani", "Orathanadu", "Thiruvaiyaru", "Budalur"],
            "Theni": ["Theni", "Periyakulam", "Bodinayakanur", "Cumbum", "Uthamapalayam", "Andipatti", "Chinnamanur"],
            "Thoothukudi": ["Thoothukudi", "Kovilpatti", "Tiruchendur", "Srivaikuntam", "Vilathikulam", "Ettayapuram", "Kayalpattinam", "Arumuganeri"],
            "Tiruchirappalli": ["Tiruchirappalli", "Srirangam", "Manapparai", "Musiri", "Thuraiyur", "Lalgudi", "Thottiyam", "Manachanallur"],
            "Tirunelveli": ["Tirunelveli", "Palayamkottai", "Ambasamudram", "Tenkasi", "Sankarankovil", "Nanguneri", "Valliyur", "Kalakkad", "Cheranmahadevi"],
            "Tirupathur": ["Tirupathur", "Vaniyambadi", "Ambur", "Natrampalli", "Alangayam"],
            "Tiruppur": ["Tiruppur", "Udumalpet", "Dharapuram", "Kangeyam", "Palladam", "Avinashi", "Mulanur", "Kundadam"],
            "Tiruvallur": ["Tiruvallur", "Avadi", "Ponneri", "Tiruttani", "Gummidipoondi", "Ambattur", "Poonamallee", "Uthukkottai", "Red Hills"],
            "Tiruvannamalai": ["Tiruvannamalai", "Arani", "Polur", "Cheyyar", "Vandavasi", "Chengam", "Kalasapakkam", "Chetpet"],
            "Tiruvarur": ["Tiruvarur", "Mannargudi", "Nannilam", "Thiruuthuraipoondi", "Needamangalam", "Kodavasal", "Muthupet"],
            "Vellore": ["Vellore", "Katpadi", "Gudiyatham", "Pernambut", "Kaniyambadi", "Anaicut", "Vellore city"],
            "Viluppuram": ["Viluppuram", "Tindivanam", "Gingee", "Kallakurichi", "Tirukkoilur", "Marakkanam", "Vikravandi", "Ulundurpet"],
            "Virudhunagar": ["Virudhunagar", "Sivakasi", "Rajapalayam", "Aruppukkottai", "Srivilliputhur", "Sattur", "Kariapatti", "Vembakottai"],
            "Nilgiris": ["Ooty (Udhagamandalam)", "Coonoor", "Gudalur", "Kotagiri", "Wellington", "Lovedale", "Avalanche", "Pykara"],
            "The Nilgiris": ["Ooty (Udhagamandalam)", "Coonoor", "Gudalur", "Kotagiri", "Wellington", "Lovedale", "Avalanche", "Pykara"]
          };
          
          const fallbackList = districtAreas[cityName] || [`${cityName} City Center`, `North ${cityName}`, `South ${cityName}`];
          const actualAreas = fallbackList.map((name, index) => ({
            id: `d${index}`,
            name: name
          }));
          
          setAreas(actualAreas);
        } else {
          setAreas(data);
        }
      } catch (err) {
        setError('Failed to fetch areas. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAreasData();
  }, [cityId, cityName]);

  return (
    <div className="w-full bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-slate-900 pt-12 pb-8 px-6 text-white border-b-4 border-primary-500 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="bg-primary-500/20 p-3 rounded-2xl text-primary-400">
            <Compass size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-1 tracking-tight font-serif text-white">Areas in {cityName}</h1>
            <p className="text-slate-300 font-medium text-sm md:text-base">Select a neighborhood to explore its restaurants</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 text-red-700 p-6 rounded-2xl flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-10 shadow-sm border border-red-100">
            <p className="font-semibold text-lg">{error}</p>
            <button onClick={() => navigate(-1)} className="mt-4 text-red-700 underline font-bold text-sm">Go Back</button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white rounded-2xl h-24 border border-slate-100 shadow-sm flex items-center p-4">
                <div className="w-12 h-12 bg-slate-200 rounded-full mr-4"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results State */}
        {!isLoading && !error && (
          <>
            {areas.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {areas.map(area => (
                  <div 
                    key={area.id}
                    onClick={() => navigate(`/restaurants?area=${encodeURIComponent(area.name)}`)}
                    className="group bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-primary-500 cursor-pointer flex items-center justify-between transform hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 group-hover:bg-primary-100 text-slate-500 group-hover:text-primary-600 p-3 rounded-xl transition-colors">
                        <MapPin size={22} />
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary-700 transition-colors">{area.name}</h3>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-8">
                <div className="bg-slate-50 p-5 rounded-full mb-5 text-slate-400">
                  <Compass size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">No areas found</h3>
                <p className="text-slate-500 max-w-sm mb-8 text-lg">
                  We don't have any specific areas listed for {cityName} yet.
                </p>
                <button 
                  onClick={() => navigate(`/restaurants?area=${encodeURIComponent(cityName)}`)}
                  className="bg-primary-500 hover:bg-primary-400 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-primary-500/20"
                >
                  Search whole city instead
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AreasListing;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RestaurantListing from './pages/RestaurantListing';
import RestaurantDetails from './pages/RestaurantDetails';
import AreasListing from './pages/AreasListing';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="bg-slate-50 min-h-screen flex flex-col relative">
        <main className="flex-grow overflow-y-auto pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/areas" element={<AreasListing />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/restaurants" element={<RestaurantListing />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
          </Routes>
        </main>
        {/* Navigation - visible at bottom on mobile, maybe styled differently on desktop later */}
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;

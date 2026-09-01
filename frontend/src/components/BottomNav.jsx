import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, User } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'explore', label: 'Explore', icon: Compass, path: '/explore' },
    { id: 'favorites', label: 'Favorites', icon: Heart, path: '/favorites' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-3 px-6 pb-6 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.id} 
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 transition-all duration-300 ${isActive ? 'scale-110' : ''}`}
            >
              <div className={`p-2 rounded-full mb-1 transition-colors ${isActive ? 'bg-primary-500 text-slate-900 shadow-lg shadow-primary-500/30' : 'text-slate-400'}`}>
                <Icon size={isActive ? 22 : 24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;

import { useState } from 'react';
import { User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const Profile = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="w-full bg-slate-50 min-h-screen pb-32">
      {/* Header */}
      <div className="bg-slate-900 pt-12 pb-24 px-6 text-white border-b-4 border-primary-500 shadow-lg relative rounded-b-[40px]">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-black mb-2 tracking-tight font-serif text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-300 font-medium text-sm">
            {isLogin ? 'Sign in to access your saved restaurants and reviews' : 'Join us to discover the best food in Tamil Nadu'}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-md mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-100">
          
          <div className="flex justify-center mb-8">
            <div className="bg-primary-50 p-4 rounded-full text-primary-600 border-4 border-white shadow-md">
              <User size={40} />
            </div>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1.5 ml-1 mr-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                {isLogin && <a href="#" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot?</a>}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button className="w-full bg-primary-500 hover:bg-primary-400 text-slate-950 font-bold py-4 rounded-xl mt-6 flex justify-center items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary-500/30">
              {isLogin ? (
                <><LogIn size={20} /> Sign In</>
              ) : (
                <><UserPlus size={20} /> Create Account</>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500 font-medium">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="ml-2 text-primary-600 font-bold hover:underline"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;

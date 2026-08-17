import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ChefHat, 
  Sparkles, 
  PackageOpen, 
  Bookmark, 
  ShoppingCart, 
  LayoutDashboard, 
  LogOut, 
  LogIn, 
  UserPlus, 
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  onOpenInterviewGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInterviewGuide }) => {
  const { user, login, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleQuickDemoLogin = async () => {
    setIsDemoLoggingIn(true);
    try {
      await login('demo@example.com', 'password123');
      navigate('/dashboard');
      setMobileMenuOpen(false);
    } catch (err) {
      console.error('Navbar demo login error:', err);
      navigate('/login');
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <ChefHat className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
                AI Recipe Generator
                <span className="text-[10px] uppercase font-mono font-semibold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  v1.0
                </span>
              </span>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">Cook smarter with Gemini</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {user && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className={`w-3.5 h-3.5 ${isActive('/dashboard') ? 'text-indigo-600' : 'text-slate-400'}`} />
                Dashboard
              </Link>
            )}

            <Link
              to="/generate"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isActive('/generate')
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${isActive('/generate') ? 'text-indigo-600' : 'text-slate-400'}`} />
              Generate Recipe
            </Link>

            <Link
              to="/pantry"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isActive('/pantry')
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PackageOpen className={`w-3.5 h-3.5 ${isActive('/pantry') ? 'text-indigo-600' : 'text-slate-400'}`} />
              Pantry
            </Link>

            <Link
              to="/recipes"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isActive('/recipes')
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isActive('/recipes') ? 'text-indigo-600' : 'text-slate-400'}`} />
              Saved Recipes
            </Link>

            <Link
              to="/shopping-list"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                isActive('/shopping-list')
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ShoppingCart className={`w-3.5 h-3.5 ${isActive('/shopping-list') ? 'text-indigo-600' : 'text-slate-400'}`} />
              Shopping List
            </Link>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* Placement Interview Cheat Sheet Button */}
            <button
              onClick={onOpenInterviewGuide}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors shadow-2xs cursor-pointer"
              title="Open the Interview Preparation Cheat Sheet"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              Interview Guide
            </button>

            {user ? (
              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono leading-tight">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleQuickDemoLogin}
                  disabled={isDemoLoggingIn}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer disabled:opacity-50"
                  title="Log in immediately as Demo user"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  {isDemoLoggingIn ? 'Logging in...' : 'Demo Login'}
                </button>
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-2xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenInterviewGuide}
              className="p-1.5 rounded-md text-indigo-700 bg-indigo-50 border border-indigo-200 text-xs flex items-center gap-1"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1.5">
          {user ? (
            <>
              <div className="pb-2 mb-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                <p className="text-[10px] text-slate-500 font-mono">{user.email}</p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                Dashboard
              </Link>
              <Link
                to="/generate"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Generate Recipe
              </Link>
              <Link
                to="/pantry"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <PackageOpen className="w-4 h-4 text-indigo-600" />
                Pantry
              </Link>
              <Link
                to="/recipes"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Bookmark className="w-4 h-4 text-indigo-600" />
                Saved Recipes
              </Link>
              <Link
                to="/shopping-list"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <ShoppingCart className="w-4 h-4 text-indigo-600" />
                Shopping List
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 px-4 rounded-md border border-slate-300 text-slate-700 font-semibold text-xs"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center py-2 px-4 rounded-md bg-indigo-600 text-white font-semibold text-xs shadow-2xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

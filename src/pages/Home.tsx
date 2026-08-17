import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  PackageOpen, 
  Bookmark, 
  ShoppingCart, 
  ChefHat, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Utensils,
  LogIn,
  Zap
} from 'lucide-react';

interface HomeProps {
  onOpenInterviewGuide: () => void;
}

export const Home: React.FC<HomeProps> = ({ onOpenInterviewGuide }) => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);

  const handleQuickDemoLogin = async () => {
    setIsDemoLoggingIn(true);
    try {
      await login('demo@example.com', 'password123');
      navigate('/dashboard');
    } catch (err) {
      console.error('Quick demo login error:', err);
      navigate('/login');
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-12 md:pt-16 md:pb-18 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-mono font-semibold border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Powered by Google Gemini & PostgreSQL / Local DB</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Cook smarter with <span className="text-indigo-600">AI</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Turn the ingredients in your kitchen into delicious recipes with step-by-step cooking instructions, ingredient tracking, and shopping lists.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            {user ? (
              <Link
                to="/generate"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Generate Recipe Now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <button
                  onClick={handleQuickDemoLogin}
                  disabled={isDemoLoggingIn}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  {isDemoLoggingIn ? 'Logging in Demo...' : '1-Click Demo Login'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              </>
            )}

            <button
              onClick={onOpenInterviewGuide}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Placement Interview Guide
            </button>
          </div>

        </div>
      </section>

      {/* Interactive Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Explore Application Modules
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Click any module below to interact with it directly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Feature 1 */}
          <Link
            to="/generate"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-indigo-100">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                AI Recipe Generator
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Input any kitchen ingredients and let Gemini formulate cooking instructions and nutritional estimates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 gap-1">
              <span>Open Generator</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Feature 2 */}
          <Link
            to="/pantry"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-indigo-100">
                <PackageOpen className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                Kitchen Pantry
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Track your on-hand ingredients with quantities and load them directly into the generator in one click.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 gap-1">
              <span>Manage Pantry</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Feature 3 */}
          <Link
            to="/recipes"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-indigo-100">
                <Bookmark className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                Saved Recipes
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Browse, search, and manage your collection of saved AI recipes persisted in your database.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 gap-1">
              <span>View Recipes</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Feature 4 */}
          <Link
            to="/shopping-list"
            className="group bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-indigo-100">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                Shopping List
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Automatically import missing ingredients from generated recipes into an interactive checklist.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 gap-1">
              <span>Open Shopping List</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 border border-slate-800 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-indigo-400 text-[11px] font-mono font-semibold uppercase tracking-wider">3-Step Workflow</span>
            <h2 className="text-lg sm:text-xl font-bold mt-1 text-white">How AI Recipe Generation Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div className="space-y-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-bold text-xs text-white">Input Ingredients</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add what you have or import your stocked pantry items in one click.
              </p>
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-bold text-xs text-white">Set Preferences</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Specify dietary goals (High Protein, Vegan, Low Carb), cuisine style, and time.
              </p>
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-slate-800/60 border border-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-bold text-xs text-white">Generate & Cook</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini returns precise quantities, instructions, prep times, and nutrition info.
              </p>
            </div>

          </div>

          <div className="mt-6 text-center">
            {user ? (
              <Link
                to="/generate"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-2xs"
              >
                <ChefHat className="w-4 h-4" />
                Launch Recipe Generator
              </Link>
            ) : (
              <button
                onClick={handleQuickDemoLogin}
                disabled={isDemoLoggingIn}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-2xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                {isDemoLoggingIn ? 'Logging in Demo...' : 'Try Demo Recipe Generator'}
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};

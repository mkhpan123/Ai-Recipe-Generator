import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Recipe, PantryItem, ShoppingItem } from '../types';
import api from '../services/api';
import { RecipeCard } from '../components/RecipeCard';
import { Loading } from '../components/Loading';
import { 
  Sparkles, 
  PackageOpen, 
  Bookmark, 
  ShoppingCart, 
  Plus, 
  ArrowRight, 
  ChefHat, 
  Utensils, 
  AlertCircle 
} from 'lucide-react';

interface DashboardProps {
  onSelectRecipeForDetails?: (recipe: Recipe) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectRecipeForDetails }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [pantryCount, setPantryCount] = useState<number>(0);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [shoppingCount, setShoppingCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError(null);

        const [pantryRes, recipesRes, shoppingRes] = await Promise.all([
          api.pantry.getAll(),
          api.recipes.getAll(),
          api.shopping.getAll()
        ]);

        setPantryCount(pantryRes.items.length);
        setRecipes(recipesRes.recipes);
        setShoppingCount(shoppingRes.items.length);
      } catch (err: any) {
        console.error('Failed to load dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleDeleteRecipe = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this saved recipe?')) return;
    try {
      await api.recipes.delete(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete recipe.');
    }
  };

  const handleViewRecipe = (recipe: Recipe) => {
    if (onSelectRecipeForDetails) {
      onSelectRecipeForDetails(recipe);
    } else {
      navigate(`/recipes?id=${recipe.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loading message="Loading your kitchen dashboard..." />
      </div>
    );
  }

  const recentRecipes = recipes.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-xl p-5 sm:p-6 text-white border border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[11px] font-mono font-semibold border border-indigo-500/30">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Ready to cook</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Welcome, {user?.name || 'Chef'}!
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            You have <strong className="text-white font-semibold font-mono">{pantryCount} items</strong> in your pantry. Ready to generate a tailored meal?
          </p>
        </div>

        <div>
          <Link
            to="/generate"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs shadow-2xs hover:bg-indigo-700 transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            Generate Recipe
            <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        
        {/* Pantry Count Card */}
        <Link
          to="/pantry"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PackageOpen className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-900">{pantryCount}</span>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Pantry Items</p>
          </div>
        </Link>

        {/* Saved Recipes Count Card */}
        <Link
          to="/recipes"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Bookmark className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-900">{recipes.length}</span>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Saved Recipes</p>
          </div>
        </Link>

        {/* Shopping Items Count Card */}
        <Link
          to="/shopping-list"
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-300 hover:shadow-xs transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
              View <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold font-mono text-slate-900">{shoppingCount}</span>
            <p className="text-xs font-medium text-slate-500 mt-0.5">Shopping Items</p>
          </div>
        </Link>

      </div>

      {/* Recent Saved Recipes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-indigo-600" />
              Recent Recipes
            </h2>
            <p className="text-xs text-slate-500">Your most recently saved AI recipes</p>
          </div>
          {recipes.length > 0 && (
            <Link
              to="/recipes"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all ({recipes.length})
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        {recentRecipes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Utensils className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">No saved recipes yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Generate your first recipe from ingredients in your fridge and click "Save Recipe".
            </p>
            <Link
              to="/generate"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate First Recipe
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onView={handleViewRecipe}
                onDelete={handleDeleteRecipe}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Hints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
            <PackageOpen className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Manage Your Pantry</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Keep your ingredients updated so you can click "Use My Pantry" anytime to generate meals.
            </p>
            <Link to="/pantry" className="text-xs font-semibold text-indigo-600 hover:underline mt-1 inline-block">
              Open Pantry &rarr;
            </Link>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-start gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Interactive Grocery Checklist</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Missing items from any AI recipe can be added to your shopping list with a single click.
            </p>
            <Link to="/shopping-list" className="text-xs font-semibold text-indigo-600 hover:underline mt-1 inline-block">
              Open Shopping List &rarr;
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

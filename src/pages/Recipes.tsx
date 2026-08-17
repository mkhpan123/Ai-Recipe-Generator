import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Recipe } from '../types';
import api from '../services/api';
import { RecipeCard } from '../components/RecipeCard';
import { Loading } from '../components/Loading';
import { 
  Bookmark, 
  Search, 
  Sparkles, 
  Utensils, 
  X, 
  Clock, 
  Flame, 
  Users, 
  ChefHat, 
  ShoppingCart, 
  CheckCircle2, 
  Trash2 
} from 'lucide-react';

export const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected recipe for modal
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isAddingShopping, setIsAddingShopping] = useState(false);
  const [isShoppingAdded, setIsShoppingAdded] = useState(false);

  const [searchParams] = useSearchParams();

  const loadRecipes = async (search?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.recipes.getAll(search);
      setRecipes(res.recipes);

      // If URL has ?id=..., auto-open that recipe
      const idParam = searchParams.get('id');
      if (idParam) {
        const found = res.recipes.find(r => String(r.id) === idParam);
        if (found) setSelectedRecipe(found);
      }
    } catch (err: any) {
      console.error('Failed to load saved recipes:', err);
      setError(err.message || 'Failed to load saved recipes.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes(searchQuery);
  }, [searchQuery]);

  const handleDeleteRecipe = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this saved recipe?')) return;

    try {
      await api.recipes.delete(id);
      setRecipes(prev => prev.filter(r => r.id !== id));
      if (selectedRecipe && selectedRecipe.id === id) {
        setSelectedRecipe(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete recipe.');
    }
  };

  const handleAddModalIngredientsToShopping = async () => {
    if (!selectedRecipe) return;
    try {
      setIsAddingShopping(true);
      const itemsToAdd = selectedRecipe.ingredients.map(ing => ({
        name: ing,
        quantity: 1,
        unit: ''
      }));
      await api.shopping.addBulk(itemsToAdd);
      setIsShoppingAdded(true);
      setTimeout(() => setIsShoppingAdded(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to add items to shopping list.');
    } finally {
      setIsAddingShopping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header with Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-indigo-600" />
            Saved Recipes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Access and cook your collection of saved AI recipes anytime.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes by title, cuisine..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Link
            to="/generate"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate New
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      {isLoading ? (
        <div className="py-16 flex justify-center">
          <Loading message="Loading saved recipes..." />
        </div>
      ) : error ? (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {error}
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3 max-w-md mx-auto shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Utensils className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {searchQuery ? 'No recipes match your search.' : 'No saved recipes yet'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {searchQuery 
              ? 'Try searching with a different keyword or clear your query.' 
              : 'Create customized meals from the items in your fridge and save them for later.'}
          </p>
          <Link
            to="/generate"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate a Recipe
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={(r) => setSelectedRecipe(r)}
              onDelete={handleDeleteRecipe}
            />
          ))}
        </div>
      )}

      {/* Selected Recipe Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-150">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-5 text-white relative border-b border-slate-800">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute right-3.5 top-3.5 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-mono font-semibold">
                  {selectedRecipe.cuisine}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono font-semibold">
                  {selectedRecipe.difficulty}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{selectedRecipe.title}</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                {selectedRecipe.description}
              </p>

              {/* Time & Servings stats */}
              <div className="flex items-center gap-4 mt-3 pt-2.5 border-t border-slate-800 text-xs font-mono">
                <div className="flex items-center gap-1 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Prep: {selectedRecipe.prep_time || 15}m | Cook: {selectedRecipe.cook_time || 20}m</span>
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedRecipe.servings || 2} servings</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-1">
              
              {/* Ingredients */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-4 h-4 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono flex items-center justify-center font-bold">1</span>
                    Ingredients ({selectedRecipe.ingredients?.length || 0})
                  </h3>
                  <button
                    onClick={handleAddModalIngredientsToShopping}
                    disabled={isAddingShopping}
                    className="text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    {isShoppingAdded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5 text-indigo-600" />
                        Add to Shopping List
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedRecipe.ingredients?.map((ing, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center gap-2 font-medium"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                  <span className="w-4 h-4 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono flex items-center justify-center font-bold">2</span>
                  Instructions
                </h3>

                <div className="space-y-2">
                  {selectedRecipe.instructions?.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed"
                    >
                      <span className="w-4 h-4 rounded-full bg-indigo-600 text-white font-bold text-[10px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="flex-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDeleteRecipe(selectedRecipe.id)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 px-2.5 py-1 rounded-md hover:bg-rose-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Recipe
              </button>

              <button
                onClick={() => setSelectedRecipe(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneratedRecipe } from '../types';
import api from '../services/api';
import { 
  Sparkles, 
  Plus, 
  X, 
  PackageOpen, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  Bookmark, 
  ShoppingCart, 
  RotateCcw, 
  Check, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

const COMMON_INGREDIENTS = [
  'Chicken', 'Rice', 'Tomato', 'Onion', 'Garlic', 
  'Eggs', 'Pasta', 'Potato', 'Cheese', 'Bell Pepper', 'Spinach'
];

const DIETARY_OPTIONS = ['None', 'Vegetarian', 'Vegan', 'High Protein', 'Low Carb'];
const CUISINE_OPTIONS = ['Any', 'Indian', 'Italian', 'Chinese', 'Mexican', 'Japanese', 'Mediterranean', 'American'];
const TIME_OPTIONS = ['Under 15 minutes', '15–30 minutes', '30–60 minutes'];
const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard'];
const SERVINGS_OPTIONS = [1, 2, 3, 4, 5];

export const GenerateRecipe: React.FC = () => {
  const navigate = useNavigate();

  // Generator form states
  const [ingredients, setIngredients] = useState<string[]>(['Chicken', 'Rice', 'Tomato', 'Onion']);
  const [currentInput, setCurrentInput] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('None');
  const [cuisine, setCuisine] = useState('Any');
  const [cookingTime, setCookingTime] = useState('15–30 minutes');
  const [difficulty, setDifficulty] = useState('Easy');
  const [servings, setServings] = useState(2);

  // Status states
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  
  // Action feedback states
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAddingShopping, setIsAddingShopping] = useState(false);
  const [isShoppingAdded, setIsShoppingAdded] = useState(false);
  const [isLoadingPantry, setIsLoadingPantry] = useState(false);

  // Add ingredient to list
  const handleAddIngredient = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const item = currentInput.trim();
    if (!item) return;

    if (!ingredients.some(ing => ing.toLowerCase() === item.toLowerCase())) {
      setIngredients(prev => [...prev, item]);
    }
    setCurrentInput('');
  };

  // Remove ingredient
  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, idx) => idx !== index));
  };

  // Quick chip click
  const handleQuickAdd = (item: string) => {
    if (!ingredients.some(ing => ing.toLowerCase() === item.toLowerCase())) {
      setIngredients(prev => [...prev, item]);
    }
  };

  // "Use My Pantry" button action
  const handleUseMyPantry = async () => {
    try {
      setIsLoadingPantry(true);
      setError(null);
      const res = await api.pantry.getAll();
      if (res.items.length === 0) {
        setError('Your pantry is currently empty. Add items in the Pantry tab first!');
        return;
      }

      const pantryNames = res.items.map(item => item.name);
      // Merge unique ingredients
      const merged = Array.from(new Set([...ingredients, ...pantryNames]));
      setIngredients(merged);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pantry items.');
    } finally {
      setIsLoadingPantry(false);
    }
  };

  // Main Generate Recipe Action
  const handleGenerate = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      setGeneratedRecipe(null);
      setIsSaved(false);
      setIsShoppingAdded(false);

      const res = await api.recipes.generate({
        ingredients,
        dietaryPreference,
        cuisine,
        cookingTime,
        difficulty,
        servings
      });

      setGeneratedRecipe(res.recipe);
    } catch (err: any) {
      console.error('Generation failed:', err);
      setError(err.message || 'Unable to generate recipe right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Save Recipe Action
  const handleSaveRecipe = async () => {
    if (!generatedRecipe || isSaved) return;

    try {
      setIsSaving(true);
      await api.recipes.save({
        title: generatedRecipe.title,
        description: generatedRecipe.description,
        ingredients: generatedRecipe.ingredients,
        instructions: generatedRecipe.instructions,
        cuisine: generatedRecipe.cuisine || cuisine,
        difficulty: generatedRecipe.difficulty || difficulty,
        prep_time: generatedRecipe.prepTime,
        cook_time: generatedRecipe.cookTime,
        servings: generatedRecipe.servings
      });
      setIsSaved(true);
    } catch (err: any) {
      alert(err.message || 'Failed to save recipe.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add Ingredients to Shopping List Action
  const handleAddToShoppingList = async () => {
    if (!generatedRecipe || isShoppingAdded) return;

    try {
      setIsAddingShopping(true);
      const itemsToAdd = generatedRecipe.ingredients.map(ing => ({
        name: ing,
        quantity: 1,
        unit: ''
      }));

      await api.shopping.addBulk(itemsToAdd);
      setIsShoppingAdded(true);
    } catch (err: any) {
      alert(err.message || 'Failed to add items to shopping list.');
    } finally {
      setIsAddingShopping(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gemini-Powered Chef</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          AI Recipe Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter what you have in your kitchen or import directly from your pantry.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Generator Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 sm:p-6 space-y-5">
        
        {/* Ingredients Input Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
              1. Ingredients You Have ({ingredients.length})
            </label>
            <button
              type="button"
              onClick={handleUseMyPantry}
              disabled={isLoadingPantry}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-md transition-colors"
            >
              <PackageOpen className="w-3.5 h-3.5 text-indigo-600" />
              {isLoadingPantry ? 'Importing Pantry...' : 'Use My Pantry'}
            </button>
          </div>

          {/* Add Ingredient Form */}
          <form onSubmit={handleAddIngredient} className="flex gap-2">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="e.g. Chicken breast, Garlic, Olive oil, Spinach..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>

          {/* Active Ingredients Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5 min-h-[38px] p-2 bg-slate-50 rounded-lg border border-slate-200 items-center">
            {ingredients.length === 0 ? (
              <span className="text-xs text-slate-400 italic">
                No ingredients added yet. Type an ingredient above or select from suggestions below.
              </span>
            ) : (
              ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 bg-white text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs"
                >
                  {ing}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Quick Add Suggestions */}
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mr-1">Quick Add:</span>
            {COMMON_INGREDIENTS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickAdd(item)}
                className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 transition-colors"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          
          {/* Dietary Preference */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Dietary Goal
            </label>
            <select
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {DIETARY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Cuisine */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cuisine Style
            </label>
            <select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {CUISINE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Cooking Time */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Time Available
            </label>
            <select
              value={cookingTime}
              onChange={(e) => setCookingTime(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {TIME_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Skill Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {DIFFICULTY_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* Servings */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Servings
            </label>
            <select
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            >
              {SERVINGS_OPTIONS.map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || ingredients.length === 0}
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-2xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2 text-xs">
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Gemini is crafting your recipe...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate AI Recipe
              </>
            )}
          </button>
        </div>

      </div>

      {/* Loading state indicator */}
      {isGenerating && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center space-y-2.5 shadow-2xs">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-2xs">
            <ChefHat className="w-5 h-5 animate-bounce" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Analyzing Your Kitchen Ingredients...</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Google Gemini is pairing your ingredients, calculating cook times, and preparing clear step-by-step instructions.
          </p>
        </div>
      )}

      {/* Generated Recipe Result Card */}
      {generatedRecipe && !isGenerating && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          
          {/* Result Header */}
          <div className="bg-slate-900 p-5 sm:p-6 text-white border-b border-slate-800">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[11px] font-mono font-semibold">
                {generatedRecipe.cuisine} Cuisine
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-mono font-semibold">
                {generatedRecipe.difficulty} Difficulty
              </span>
              {dietaryPreference !== 'None' && (
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-mono font-semibold">
                  {dietaryPreference}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{generatedRecipe.title}</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {generatedRecipe.description}
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Prep: <strong className="text-white">{generatedRecipe.prepTime}m</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Cook: <strong className="text-white">{generatedRecipe.cookTime}m</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Servings: <strong className="text-white">{generatedRecipe.servings}</strong></span>
              </div>
              {generatedRecipe.nutritionSummary && (
                <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-[11px] text-slate-300">
                  <span>{generatedRecipe.nutritionSummary}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recipe Content (Ingredients & Instructions) */}
          <div className="p-5 sm:p-6 space-y-6">
            
            {/* Ingredients Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs flex items-center justify-center font-bold font-mono">
                    1
                  </span>
                  Ingredients Needed
                </h3>
                <button
                  type="button"
                  onClick={handleAddToShoppingList}
                  disabled={isAddingShopping || isShoppingAdded}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors ${
                    isShoppingAdded
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  {isShoppingAdded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Added to Shopping List!
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
                {generatedRecipe.ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{ing}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2.5">
                <span className="w-5 h-5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs flex items-center justify-center font-bold font-mono">
                  2
                </span>
                Step-by-Step Instructions
              </h3>

              <div className="space-y-2">
                {generatedRecipe.instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-white border border-slate-200 shadow-2xs hover:border-indigo-200 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Action Bar Footer */}
          <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            
            <button
              onClick={handleGenerate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              Generate Another Recipe
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleAddToShoppingList}
                disabled={isAddingShopping || isShoppingAdded}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 font-semibold text-xs transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5 text-indigo-600" />
                {isShoppingAdded ? 'In Shopping List' : 'Add to Shopping List'}
              </button>

              <button
                type="button"
                onClick={handleSaveRecipe}
                disabled={isSaving || isSaved}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-xs transition-colors shadow-2xs ${
                  isSaved
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Recipe Saved in Database!
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5" />
                    {isSaving ? 'Saving...' : 'Save Recipe'}
                  </>
                )}
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

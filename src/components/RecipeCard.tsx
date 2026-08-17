import React from 'react';
import { Recipe } from '../types';
import { Clock, Users, Flame, Trash2, Eye, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onDelete?: (id: number) => void;
  isDeleting?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onView,
  onDelete,
  isDeleting = false
}) => {
  const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-indigo-200 hover:shadow-xs transition-all duration-150 flex flex-col justify-between overflow-hidden group">
      <div className="p-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ChefHat className="w-3 h-3 text-indigo-600" />
            {recipe.cuisine || 'Global'}
          </span>
          <span className={`text-[10px] font-semibold font-mono uppercase px-1.5 py-0.5 rounded border ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty || 'Easy'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {recipe.description || 'A delicious home-cooked meal prepared with fresh ingredients.'}
        </p>

        {/* Metadata info: Time & Servings */}
        <div className="flex items-center gap-3.5 mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-1" title="Total preparation & cooking time">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{totalTime > 0 ? `${totalTime}m` : `${recipe.cook_time || 20}m`}</span>
          </div>

          <div className="flex items-center gap-1" title="Number of servings">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{recipe.servings || 2} serv.</span>
          </div>

          <div className="flex items-center gap-1 text-slate-500">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{recipe.ingredients?.length || 0} ingr.</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onView(recipe)}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-md text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-colors shadow-2xs"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-600" />
          View Recipe
        </button>

        {onDelete && (
          <button
            onClick={() => onDelete(recipe.id)}
            disabled={isDeleting}
            title="Delete this saved recipe"
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

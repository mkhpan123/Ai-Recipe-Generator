import React, { useEffect, useState } from 'react';
import { ShoppingItem } from '../types';
import api from '../services/api';
import { Loading } from '../components/Loading';
import { 
  ShoppingCart, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  CheckCheck, 
  AlertCircle, 
  Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShoppingList: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadShoppingList = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.shopping.getAll();
      setItems(res.items);
    } catch (err: any) {
      console.error('Failed to load shopping list:', err);
      setError(err.message || 'Failed to load shopping list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShoppingList();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.shopping.add({
        name: name.trim(),
        quantity: quantity ? Number(quantity) : 1,
        unit: unit.trim()
      });

      setItems(prev => [...prev, res.item]);
      setName('');
      setQuantity('1');
      setUnit('');
    } catch (err: any) {
      alert(err.message || 'Failed to add shopping item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePurchased = async (id: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      // Optimistic update in UI
      setItems(prev => prev.map(it => it.id === id ? { ...it, is_purchased: newStatus } : it));
      await api.shopping.togglePurchased(id, newStatus);
    } catch (err: any) {
      // Revert on failure
      setItems(prev => prev.map(it => it.id === id ? { ...it, is_purchased: currentStatus } : it));
      alert(err.message || 'Failed to update item status.');
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await api.shopping.delete(id);
      setItems(prev => prev.filter(it => it.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete item.');
    }
  };

  const unpurchasedItems = items.filter(i => !i.is_purchased);
  const purchasedItems = items.filter(i => i.is_purchased);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-indigo-600" />
            Shopping List
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep track of missing ingredients needed for your recipes.
          </p>
        </div>

        <Link
          to="/generate"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate Recipe
        </Link>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Item Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-5">
        <h2 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
          <Plus className="w-3.5 h-3.5 text-indigo-600" />
          Add Item to Buy
        </h2>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-6">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name (e.g. Olive Oil, Greek Yogurt)"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <input
              type="number"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unit (bottle, kg)"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-colors shadow-2xs disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </form>
      </div>

      {/* Shopping List Container */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        
        {/* Active Checklist Section */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            To Buy ({unpurchasedItems.length})
          </span>
        </div>

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loading message="Loading your shopping list..." />
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Your shopping list is clear</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When generating a recipe, click "Add Ingredients to Shopping List" to import missing items.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {unpurchasedItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleTogglePurchased(item.id, item.is_purchased)}
                className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    className="text-slate-300 group-hover:text-indigo-600 transition-colors"
                  >
                    <Circle className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-900">{item.name}</span>
                  {(item.quantity || item.unit) && (
                    <span className="text-xs text-slate-500 font-mono">
                      — {item.quantity} {item.unit}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                  className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {/* Completed / Purchased Items section */}
            {purchasedItems.length > 0 && (
              <>
                <div className="px-4 py-2.5 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5 border-t border-slate-100">
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Purchased Items ({purchasedItems.length})
                </div>

                {purchasedItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleTogglePurchased(item.id, item.is_purchased)}
                    className="px-4 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer opacity-60 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <button type="button" className="text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-medium line-through text-slate-500">{item.name}</span>
                      {(item.quantity || item.unit) && (
                        <span className="text-xs text-slate-400 font-mono">
                          — {item.quantity} {item.unit}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

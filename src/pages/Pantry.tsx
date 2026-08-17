import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PantryItem } from '../types';
import api from '../services/api';
import { Loading } from '../components/Loading';
import { 
  PackageOpen, 
  Plus, 
  Trash2, 
  Edit2, 
  Sparkles, 
  X, 
  Check, 
  AlertCircle 
} from 'lucide-react';

export const Pantry: React.FC = () => {
  const navigate = useNavigate();

  const [items, setItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for adding
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnit, setEditUnit] = useState('');

  const loadPantry = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.pantry.getAll();
      setItems(res.items);
    } catch (err: any) {
      console.error('Failed to load pantry:', err);
      setError(err.message || 'Failed to load pantry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPantry();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await api.pantry.add({
        name: name.trim(),
        quantity: quantity ? Number(quantity) : undefined,
        unit: unit.trim()
      });

      setItems(prev => [res.item, ...prev]);
      setName('');
      setQuantity('');
      setUnit('');
    } catch (err: any) {
      alert(err.message || 'Failed to add pantry item.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (item: PantryItem) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditQuantity(item.quantity ? String(item.quantity) : '');
    setEditUnit(item.unit || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditQuantity('');
    setEditUnit('');
  };

  const handleUpdateItem = async (id: number) => {
    if (!editName.trim()) return;

    try {
      const res = await api.pantry.update(id, {
        name: editName.trim(),
        quantity: editQuantity ? Number(editQuantity) : undefined,
        unit: editUnit.trim()
      });

      setItems(prev => prev.map(item => item.id === id ? res.item : item));
      cancelEdit();
    } catch (err: any) {
      alert(err.message || 'Failed to update item.');
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await api.pantry.delete(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete item.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <PackageOpen className="w-5 h-5 text-indigo-600" />
            Kitchen Pantry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track your on-hand ingredients and generate AI recipes instantly.
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={() => navigate('/generate')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Recipe from Pantry
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add New Item Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 sm:p-5">
        <h2 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
          <Plus className="w-3.5 h-3.5 text-indigo-600" />
          Add Ingredient to Pantry
        </h2>

        <form onSubmit={handleAddItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-6">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ingredient name (e.g. Chicken breast, Rice, Eggs)"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <input
              type="number"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Qty (e.g. 500)"
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <input
              type="text"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unit (g, kg, pcs, cups)"
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
              Add Item
            </button>
          </div>
        </form>
      </div>

      {/* Pantry Items List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Available Stock ({items.length} items)
          </span>
        </div>

        {isLoading ? (
          <div className="py-8 flex justify-center">
            <Loading message="Loading pantry items..." />
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <PackageOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-900">Your pantry is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add the groceries you currently have at home so you can create instant recipes without shopping.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="px-4 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                {editingId === item.id ? (
                  /* Inline Edit Mode */
                  <div className="flex-1 flex items-center gap-2 mr-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-2.5 py-1 rounded border border-slate-300 text-xs"
                    />
                    <input
                      type="number"
                      step="any"
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      placeholder="Qty"
                      className="w-16 px-2.5 py-1 rounded border border-slate-300 text-xs"
                    />
                    <input
                      type="text"
                      value={editUnit}
                      onChange={(e) => setEditUnit(e.target.value)}
                      placeholder="Unit"
                      className="w-20 px-2.5 py-1 rounded border border-slate-300 text-xs"
                    />
                    <button
                      onClick={() => handleUpdateItem(item.id)}
                      className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1 rounded bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  /* Display Mode */
                  <>
                    <div className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      <div>
                        <span className="text-xs font-semibold text-slate-900">{item.name}</span>
                        {(item.quantity || item.unit) && (
                          <span className="text-xs text-slate-500 ml-1.5 font-mono">
                            — {item.quantity} {item.unit}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(item)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit ingredient"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete ingredient"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

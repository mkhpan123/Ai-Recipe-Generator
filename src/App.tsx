import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { InterviewGuideModal } from './components/InterviewGuideModal';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { GenerateRecipe } from './pages/GenerateRecipe';
import { Pantry } from './pages/Pantry';
import { Recipes } from './pages/Recipes';
import { ShoppingList } from './pages/ShoppingList';
import { ChefHat, Heart, HelpCircle } from 'lucide-react';

export function App() {
  const [isInterviewGuideOpen, setIsInterviewGuideOpen] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 text-xs sm:text-sm antialiased">
          
          {/* Top Sticky Navigation Bar */}
          <Navbar onOpenInterviewGuide={() => setIsInterviewGuideOpen(true)} />

          {/* Main Application Routes Viewport */}
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home onOpenInterviewGuide={() => setIsInterviewGuideOpen(true)} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Core Application Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/generate"
                element={
                  <ProtectedRoute>
                    <GenerateRecipe />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pantry"
                element={
                  <ProtectedRoute>
                    <Pantry />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/recipes"
                element={
                  <ProtectedRoute>
                    <Recipes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/shopping-list"
                element={
                  <ProtectedRoute>
                    <ShoppingList />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Placement Interview Cheat Sheet Modal */}
          <InterviewGuideModal
            isOpen={isInterviewGuideOpen}
            onClose={() => setIsInterviewGuideOpen(false)}
          />

          {/* Clean High Density Application Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-indigo-600" />
                <span className="font-semibold text-slate-800">AI Recipe Generator</span>
                <span className="text-slate-400">— Full-Stack Architecture (5/10)</span>
              </div>

              <div className="flex items-center gap-4 text-slate-500">
                <button
                  onClick={() => setIsInterviewGuideOpen(true)}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 hover:underline flex items-center gap-1 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Placement Interview Q&A
                </button>
                <span className="text-slate-300">|</span>
                <span className="font-mono text-[11px] text-slate-500">React • Node.js • Express • PostgreSQL • Gemini AI</span>
              </div>
            </div>
          </footer>

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

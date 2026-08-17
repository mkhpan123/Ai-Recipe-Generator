import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Sparkles, 
  Code2, 
  BookOpen, 
  Copy, 
  Check 
} from 'lucide-react';

interface InterviewGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InterviewGuideModal: React.FC<InterviewGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pitch' | 'qa' | 'architecture' | 'crud'>('pitch');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const elevatorPitch = `This is a full-stack AI recipe generator. I built the frontend using React and TypeScript, and the backend using Node.js and Express. PostgreSQL stores user information, pantry items, saved recipes, and shopping-list items. I implemented JWT authentication with bcrypt for secure login. When a user enters ingredients and preferences, the frontend sends them to my Express backend. The backend creates a prompt and sends it to the Gemini API. Gemini generates the recipe, which is returned to the frontend and can then be saved in PostgreSQL. I also added pantry management and a shopping list using REST APIs and CRUD operations.`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Placement Interview Preparation Cheat Sheet
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Target: 5/10 Easy-to-Medium
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Clear, jargon-free explanations designed for placement interviews.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-6 gap-2">
          <button
            onClick={() => setActiveTab('pitch')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'pitch'
                ? 'border-amber-600 text-amber-900 bg-white -mb-px'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            2-Minute Pitch
          </button>

          <button
            onClick={() => setActiveTab('qa')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'qa'
                ? 'border-amber-600 text-amber-900 bg-white -mb-px'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Core Q&A by Topic
          </button>

          <button
            onClick={() => setActiveTab('architecture')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-amber-600 text-amber-900 bg-white -mb-px'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            System Architecture
          </button>

          <button
            onClick={() => setActiveTab('crud')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'crud'
                ? 'border-amber-600 text-amber-900 bg-white -mb-px'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            CRUD & Security
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 text-sm">
          
          {/* TAB 1: ELEVATOR PITCH */}
          {activeTab === 'pitch' && (
            <div className="space-y-6">
              <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    How to Describe Your Project in 2 Minutes
                  </h3>
                  <button
                    onClick={() => copyToClipboard(elevatorPitch, 'pitch')}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-white border border-amber-300 rounded text-amber-900 hover:bg-amber-100 transition-colors"
                  >
                    {copiedSection === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedSection === 'pitch' ? 'Copied' : 'Copy Pitch'}
                  </button>
                </div>
                <blockquote className="italic text-stone-700 leading-relaxed font-serif text-sm bg-white/80 p-4 rounded-lg border border-amber-100">
                  "{elevatorPitch}"
                </blockquote>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Resume Bullet Points (Honest & Strong)
                </h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Full-Stack Architecture:</strong> Developed an end-to-end recipe generator using React, TypeScript, Node.js, Express, and PostgreSQL with RESTful APIs.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Generative AI Integration:</strong> Integrated Google Gemini API server-side with structured JSON schemas to produce personalized culinary recipes.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Authentication & Security:</strong> Built JWT-based stateless authentication and bcrypt password hashing with protected route authorization.</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs bg-stone-50 p-3 rounded-lg border border-stone-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>CRUD Data Management:</strong> Implemented pantry tracking, saved recipe collections, and interactive shopping list with single-click ingredient import.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: CORE Q&A BY TOPIC */}
          {activeTab === 'qa' && (
            <div className="space-y-4">
              
              {/* React Section */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
                  <Code2 className="w-4 h-4" />
                  React Questions
                </div>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <p className="font-semibold text-stone-900">Q: Why did you use React?</p>
                    <p className="text-stone-600">"React uses a component-based architecture and a virtual DOM. It allows us to break the UI into reusable pieces (like RecipeCard and Navbar) and efficiently re-renders only the changed parts of the screen."</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Q: What is useState and useEffect?</p>
                    <p className="text-stone-600">"<code>useState</code> stores dynamic local state in a functional component (e.g., list of ingredients or loading state). <code>useEffect</code> executes side effects, such as fetching data from our Express backend when a component first mounts."</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Q: How does React communicate with your backend?</p>
                    <p className="text-stone-600">"React sends HTTP REST requests (GET, POST, PUT, DELETE) using standard fetch/async-await. In the request headers, we attach our JWT token (<code>Authorization: Bearer &lt;token&gt;</code>)."</p>
                  </div>
                </div>
              </div>

              {/* Express & Node Section */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
                  <Cpu className="w-4 h-4" />
                  Express & Backend Questions
                </div>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <p className="font-semibold text-stone-900">Q: Why did you use Express?</p>
                    <p className="text-stone-600">"Express is a lightweight web framework for Node.js. It gives us a clean middleware pipeline and routing system to create REST API endpoints like <code>/api/auth</code> and <code>/api/recipes</code>."</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Q: What happens when <code>/api/recipes/generate</code> is called?</p>
                    <p className="text-stone-600">"1) The auth middleware checks the JWT. 2) The controller validates the ingredients array. 3) The backend builds a prompt with dietary options and calls Google Gemini API. 4) Gemini returns structured JSON. 5) Express sends the JSON recipe back to React."</p>
                  </div>
                </div>
              </div>

              {/* PostgreSQL & Database Section */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
                  <Database className="w-4 h-4" />
                  PostgreSQL & Database Questions
                </div>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <p className="font-semibold text-stone-900">Q: What tables did you create and how are they related?</p>
                    <p className="text-stone-600">"We created 4 tables: <code>users</code>, <code>pantry_items</code>, <code>recipes</code>, and <code>shopping_items</code>. The relationship is One-to-Many (1:N): one user can have many pantry items, saved recipes, and shopping list items via the <code>user_id</code> foreign key."</p>
                  </div>
                </div>
              </div>

              {/* JWT & bcrypt Section */}
              <div className="border border-stone-200 rounded-xl p-4 bg-white">
                <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  JWT & Security Questions
                </div>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <p className="font-semibold text-stone-900">Q: Why bcrypt and not plain text?</p>
                    <p className="text-stone-600">"We never store plaintext passwords because a database breach would expose credentials. Bcrypt hashes the password with 10 salt rounds, making it one-way and immune to rainbow-table lookups."</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Q: How does JWT work?</p>
                    <p className="text-stone-600">"After verifying the user's password, the server signs a token containing the user's ID. The client stores it in localStorage and includes it with every request. The server verifies the signature without needing a database lookup for every single session check."</p>
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Q: Why don't you call Gemini directly from React?</p>
                    <p className="text-stone-600">"Because frontend JavaScript is completely public. Calling Gemini from React would expose our <code>GEMINI_API_KEY</code> in the browser where anyone could steal it."</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Whiteboard System Architecture Diagram
                </h4>
                <div className="bg-stone-900 text-amber-400 p-4 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto border border-stone-800">
                  <pre>{`[ React Frontend (Vite + Tailwind) ]
         │
         │  HTTP REST (with Authorization: Bearer JWT)
         ▼
[ Express REST API Server (Node.js) ]
  ├── 1. authMiddleware.ts   -> Validates JWT signature & gets req.user.id
  ├── 2. authController.ts   -> Handles login/register with bcrypt
  ├── 3. recipeController.ts ─┬─> Calls Google Gemini API (gemini-3.7-flash)
  ├── 4. pantryController.ts  │   for structured recipe generation
  └── 5. shoppingController.ts│
                              ▼
                [ PostgreSQL Database / Data Store ]
                  ├── users (id, name, email, password)
                  ├── pantry_items (id, user_id, name, quantity, unit)
                  ├── recipes (id, user_id, title, ingredients, instructions)
                  └── shopping_items (id, user_id, name, is_purchased)`}</pre>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="font-bold text-stone-900 mb-1">Frontend Layer</p>
                  <p className="text-stone-600">React 19, TypeScript, Tailwind CSS, Lucide icons, and React Router with centralized AuthContext.</p>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                  <p className="font-bold text-stone-900 mb-1">Backend Layer</p>
                  <p className="text-stone-600">Express.js on Node.js, structured controllers, route handlers, and JWT authentication middleware.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CRUD & SECURITY */}
          {activeTab === 'crud' && (
            <div className="space-y-4">
              <div className="bg-stone-50 border border-stone-200 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-stone-900 mb-2 uppercase tracking-wide">
                  Complete CRUD Operation Example (Pantry Items)
                </h4>
                <div className="space-y-2 text-xs font-mono bg-white p-3 rounded-lg border border-stone-200 text-stone-800">
                  <p><strong>C (Create):</strong> <code>POST /api/pantry</code> &rarr; <code>INSERT INTO pantry_items (user_id, name, quantity, unit) VALUES ($1, $2, $3, $4)</code></p>
                  <p><strong>R (Read):</strong>   <code>GET /api/pantry</code> &rarr; <code>SELECT * FROM pantry_items WHERE user_id = $1</code></p>
                  <p><strong>U (Update):</strong> <code>PUT /api/pantry/:id</code> &rarr; <code>UPDATE pantry_items SET name=$1, quantity=$2 WHERE id=$3 AND user_id=$4</code></p>
                  <p><strong>D (Delete):</strong> <code>DELETE /api/pantry/:id</code> &rarr; <code>DELETE FROM pantry_items WHERE id=$1 AND user_id=$2</code></p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Authorization Isolation Rule
                </h4>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Every SQL query on user data includes <code>WHERE user_id = req.user.id</code>. This ensures User A can never read, modify, or delete items owned by User B, even if they guess their IDs.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            Keep this open during interview practice for instant reference!
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};

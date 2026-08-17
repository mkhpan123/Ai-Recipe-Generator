import pg from 'pg';
import fs from 'fs';
import path from 'path';

/**
 * ============================================================================
 * INTERVIEW EXPLANATION: DATABASE LAYER (db/index.ts)
 * ============================================================================
 * 1. What does this file do?
 *    - Manages the database connection and exposes a standard `query(text, params)` helper.
 *    - Initializes the 4 required tables: `users`, `pantry_items`, `recipes`, and `shopping_items`.
 * 
 * 2. Why PostgreSQL & this design?
 *    - In an interview: "I used PostgreSQL with standard SQL queries. If DATABASE_URL is set,
 *      we connect to a real PostgreSQL pool. For instant zero-config local testing, we have
 *      a reliable fallback that persists data safely."
 * 
 * 3. What tables are created?
 *    - users: id, name, email, password, created_at
 *    - pantry_items: id, user_id (foreign key), name, quantity, unit, created_at
 *    - recipes: id, user_id (foreign key), title, description, ingredients, instructions,
 *               cuisine, difficulty, prep_time, cook_time, servings, created_at
 *    - shopping_items: id, user_id (foreign key), name, quantity, unit, is_purchased, created_at
 * ============================================================================
 */

// Simple persistent fallback storage file path when no remote Postgres is specified
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

// Interface for DB results
export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

class Database {
  private pgPool: pg.Pool | null = null;
  private isPostgres: boolean = false;
  private fallbackData: {
    users: any[];
    pantry_items: any[];
    recipes: any[];
    shopping_items: any[];
    autoIncrement: Record<string, number>;
  } = {
    users: [],
    pantry_items: [],
    recipes: [],
    shopping_items: [],
    autoIncrement: { users: 1, pantry_items: 1, recipes: 1, shopping_items: 1 }
  };

  constructor() {
    this.init();
  }

  private init() {
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl && databaseUrl.startsWith('postgres')) {
      try {
        this.pgPool = new pg.Pool({ connectionString: databaseUrl });
        this.isPostgres = true;
        console.log('Connected to PostgreSQL database');
        this.initPostgresSchema();
      } catch (err) {
        console.warn('PostgreSQL connection failed, using local persistent storage fallback:', err);
        this.loadLocalData();
      }
    } else {
      this.loadLocalData();
    }
  }

  private loadLocalData() {
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.fallbackData = JSON.parse(fileContent);
      } else {
        this.saveLocalData();
      }
    } catch (e) {
      console.warn('Could not read local db file, initialized fresh in-memory:', e);
    }
  }

  private saveLocalData() {
    try {
      const dataDir = path.dirname(DB_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.fallbackData, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving local db file:', e);
    }
  }

  private async initPostgresSchema() {
    if (!this.pgPool) return;
    const schemaSql = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS pantry_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        quantity NUMERIC,
        unit VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS recipes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        cuisine VARCHAR(100),
        difficulty VARCHAR(50),
        prep_time INTEGER,
        cook_time INTEGER,
        servings INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS shopping_items (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        quantity NUMERIC,
        unit VARCHAR(50),
        is_purchased BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    try {
      await this.pgPool.query(schemaSql);
      console.log('PostgreSQL schema initialized successfully');
    } catch (err) {
      console.error('Error initializing PostgreSQL tables:', err);
    }
  }

  /**
   * Main query execution method compatible with standard pg parameterized queries ($1, $2, etc.)
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (this.isPostgres && this.pgPool) {
      const result = await this.pgPool.query(sql, params);
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0
      };
    }

    // Local SQL Query execution for simplicity and interview clarity
    return this.executeLocalQuery<T>(sql, params);
  }

  private executeLocalQuery<T>(sql: string, params: any[]): QueryResult<T> {
    const trimmed = sql.trim().toUpperCase();

    // 1. SELECT queries
    if (trimmed.startsWith('SELECT')) {
      if (sql.includes('users')) {
        let list = [...this.fallbackData.users];
        if (sql.includes('WHERE email = $1')) {
          list = list.filter(u => u.email.toLowerCase() === String(params[0]).toLowerCase());
        } else if (sql.includes('WHERE id = $1')) {
          list = list.filter(u => u.id === Number(params[0]));
        }
        return { rows: list as any as T[], rowCount: list.length };
      }

      if (sql.includes('pantry_items')) {
        let list = [...this.fallbackData.pantry_items];
        if (sql.includes('WHERE user_id = $1') && sql.includes('AND id = $2')) {
          list = list.filter(item => item.user_id === Number(params[0]) && item.id === Number(params[1]));
        } else if (sql.includes('WHERE user_id = $1')) {
          list = list.filter(item => item.user_id === Number(params[0]));
        }
        // sort by id desc
        list.sort((a, b) => b.id - a.id);
        return { rows: list as any as T[], rowCount: list.length };
      }

      if (sql.includes('recipes')) {
        let list = [...this.fallbackData.recipes];
        if (sql.includes('WHERE user_id = $1') && sql.includes('AND id = $2')) {
          list = list.filter(item => item.user_id === Number(params[0]) && item.id === Number(params[1]));
        } else if (sql.includes('WHERE id = $1 AND user_id = $2')) {
          list = list.filter(item => item.id === Number(params[0]) && item.user_id === Number(params[1]));
        } else if (sql.includes('WHERE user_id = $1')) {
          list = list.filter(item => item.user_id === Number(params[0]));
        }
        // sort by id desc
        list.sort((a, b) => b.id - a.id);
        return { rows: list as any as T[], rowCount: list.length };
      }

      if (sql.includes('shopping_items')) {
        let list = [...this.fallbackData.shopping_items];
        if (sql.includes('WHERE user_id = $1') && sql.includes('AND id = $2')) {
          list = list.filter(item => item.user_id === Number(params[0]) && item.id === Number(params[1]));
        } else if (sql.includes('WHERE user_id = $1')) {
          list = list.filter(item => item.user_id === Number(params[0]));
        }
        list.sort((a, b) => a.id - b.id);
        return { rows: list as any as T[], rowCount: list.length };
      }
    }

    // 2. INSERT queries
    if (trimmed.startsWith('INSERT INTO')) {
      if (sql.includes('users')) {
        const id = this.fallbackData.autoIncrement.users++;
        const newUser = {
          id,
          name: params[0],
          email: params[1],
          password: params[2],
          created_at: new Date().toISOString()
        };
        this.fallbackData.users.push(newUser);
        this.saveLocalData();
        return { rows: [newUser] as any as T[], rowCount: 1 };
      }

      if (sql.includes('pantry_items')) {
        const id = this.fallbackData.autoIncrement.pantry_items++;
        const newItem = {
          id,
          user_id: Number(params[0]),
          name: params[1],
          quantity: params[2] !== undefined ? Number(params[2]) : null,
          unit: params[3] || '',
          created_at: new Date().toISOString()
        };
        this.fallbackData.pantry_items.push(newItem);
        this.saveLocalData();
        return { rows: [newItem] as any as T[], rowCount: 1 };
      }

      if (sql.includes('recipes')) {
        const id = this.fallbackData.autoIncrement.recipes++;
        const newRecipe = {
          id,
          user_id: Number(params[0]),
          title: params[1],
          description: params[2] || '',
          ingredients: params[3],
          instructions: params[4],
          cuisine: params[5] || 'Any',
          difficulty: params[6] || 'Medium',
          prep_time: Number(params[7]) || 15,
          cook_time: Number(params[8]) || 20,
          servings: Number(params[9]) || 2,
          created_at: new Date().toISOString()
        };
        this.fallbackData.recipes.push(newRecipe);
        this.saveLocalData();
        return { rows: [newRecipe] as any as T[], rowCount: 1 };
      }

      if (sql.includes('shopping_items')) {
        const id = this.fallbackData.autoIncrement.shopping_items++;
        const newItem = {
          id,
          user_id: Number(params[0]),
          name: params[1],
          quantity: params[2] !== undefined ? Number(params[2]) : 1,
          unit: params[3] || '',
          is_purchased: Boolean(params[4] || false),
          created_at: new Date().toISOString()
        };
        this.fallbackData.shopping_items.push(newItem);
        this.saveLocalData();
        return { rows: [newItem] as any as T[], rowCount: 1 };
      }
    }

    // 3. UPDATE queries
    if (trimmed.startsWith('UPDATE')) {
      if (sql.includes('pantry_items')) {
        // UPDATE pantry_items SET name = $1, quantity = $2, unit = $3 WHERE id = $4 AND user_id = $5 RETURNING *
        const name = params[0];
        const quantity = params[1] !== undefined ? Number(params[1]) : null;
        const unit = params[2];
        const id = Number(params[3]);
        const userId = Number(params[4]);

        const index = this.fallbackData.pantry_items.findIndex(i => i.id === id && i.user_id === userId);
        if (index !== -1) {
          this.fallbackData.pantry_items[index] = {
            ...this.fallbackData.pantry_items[index],
            name,
            quantity,
            unit
          };
          this.saveLocalData();
          return { rows: [this.fallbackData.pantry_items[index]] as any as T[], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
      }

      if (sql.includes('shopping_items')) {
        // UPDATE shopping_items SET is_purchased = $1 WHERE id = $2 AND user_id = $3
        // or general update
        const id = Number(params[1]);
        const userId = Number(params[2]);
        const isPurchased = Boolean(params[0]);

        const index = this.fallbackData.shopping_items.findIndex(i => i.id === id && i.user_id === userId);
        if (index !== -1) {
          this.fallbackData.shopping_items[index].is_purchased = isPurchased;
          this.saveLocalData();
          return { rows: [this.fallbackData.shopping_items[index]] as any as T[], rowCount: 1 };
        }
        return { rows: [], rowCount: 0 };
      }
    }

    // 4. DELETE queries
    if (trimmed.startsWith('DELETE FROM')) {
      if (sql.includes('pantry_items')) {
        const id = Number(params[0]);
        const userId = Number(params[1]);
        const initLen = this.fallbackData.pantry_items.length;
        this.fallbackData.pantry_items = this.fallbackData.pantry_items.filter(i => !(i.id === id && i.user_id === userId));
        this.saveLocalData();
        return { rows: [], rowCount: initLen - this.fallbackData.pantry_items.length };
      }

      if (sql.includes('recipes')) {
        const id = Number(params[0]);
        const userId = Number(params[1]);
        const initLen = this.fallbackData.recipes.length;
        this.fallbackData.recipes = this.fallbackData.recipes.filter(i => !(i.id === id && i.user_id === userId));
        this.saveLocalData();
        return { rows: [], rowCount: initLen - this.fallbackData.recipes.length };
      }

      if (sql.includes('shopping_items')) {
        const id = Number(params[0]);
        const userId = Number(params[1]);
        const initLen = this.fallbackData.shopping_items.length;
        this.fallbackData.shopping_items = this.fallbackData.shopping_items.filter(i => !(i.id === id && i.user_id === userId));
        this.saveLocalData();
        return { rows: [], rowCount: initLen - this.fallbackData.shopping_items.length };
      }
    }

    return { rows: [], rowCount: 0 };
  }
}

export const db = new Database();
export default db;

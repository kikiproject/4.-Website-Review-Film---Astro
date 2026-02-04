// MySQL Database Connection
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: import.meta.env.DB_HOST || 'localhost',
  port: parseInt(import.meta.env.DB_PORT || '3306'),
  user: import.meta.env.DB_USER || 'root',
  password: import.meta.env.DB_PASSWORD || '',
  database: import.meta.env.DB_NAME || 'astro_movie',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
let pool: mysql.Pool | null = null;

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

// Execute query helper
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows as T[];
  } finally {
    connection.release();
  }
}

// Execute single query
export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

// Execute insert and return insertId
export async function insert(sql: string, params: any[] = []): Promise<number> {
  const connection = await getPool().getConnection();
  try {
    const [result] = await connection.query(sql, params) as any;
    return result.insertId;
  } finally {
    connection.release();
  }
}

// Execute update and return affected rows
export async function update(sql: string, params: any[] = []): Promise<number> {
  const connection = await getPool().getConnection();
  try {
    const [result] = await connection.query(sql, params) as any;
    return result.affectedRows;
  } finally {
    connection.release();
  }
}

// Transaction helper
export async function transaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Database Schema Types
export interface DBUser {
  id: number;
  uuid: string;
  email: string;
  username: string;
  display_name: string;
  password_hash: string;
  avatar_url: string | null;
  bio: string | null;
  role: 'admin' | 'user' | 'vtuber';
  is_verified: boolean;
  is_active: boolean;
  vtuber_name: string | null;
  vtuber_avatar: string | null;
  vtuber_debut_date: Date | null;
  vtuber_agency: string | null;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
}

export interface DBMovie {
  id: number;
  tmdb_id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  runtime: number | null;
  status: string | null;
  tagline: string | null;
  genres: string; // JSON string
  created_at: Date;
  updated_at: Date;
}

export interface DBReview {
  id: number;
  user_id: number;
  movie_id: number;
  rating: number;
  content: string;
  is_spoiler: boolean;
  status: 'pending' | 'approved' | 'rejected';
  likes_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface DBWatchParty {
  id: number;
  uuid: string;
  host_id: number;
  movie_id: number | null;
  tmdb_id: number | null;
  title: string;
  description: string | null;
  movie_url: string | null;
  scheduled_at: Date;
  started_at: Date | null;
  ended_at: Date | null;
  max_participants: number;
  is_vtuber_event: boolean;
  is_public: boolean;
  status: 'scheduled' | 'live' | 'ended' | 'cancelled';
  created_at: Date;
}

export interface DBWatchPartyParticipant {
  id: number;
  party_id: number;
  user_id: number;
  joined_at: Date;
  left_at: Date | null;
  is_co_host: boolean;
}

export interface DBFavorite {
  id: number;
  user_id: number;
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  created_at: Date;
}

export interface DBWatchlist {
  id: number;
  user_id: number;
  tmdb_id: number;
  media_type: 'movie' | 'tv';
  created_at: Date;
}

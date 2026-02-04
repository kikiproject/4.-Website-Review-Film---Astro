// Authentication Service
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne, insert, update } from './database';
import type { DBUser } from './database';

const JWT_SECRET = import.meta.env.JWT_SECRET || 'astro-movie-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';
const REFRESH_TOKEN_EXPIRES_IN = '30d';

// User types for frontend
export interface AuthUser {
  id: number;
  uuid: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  role: 'admin' | 'user' | 'vtuber';
  isVerified: boolean;
  vtuberName?: string | null;
  vtuberAvatar?: string | null;
  vtuberAgency?: string | null;
  vtuberIsLive?: boolean;
  vtuberFollowersCount?: number;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  token?: string;
  refreshToken?: string;
  error?: string;
}

// Transform DB user to AuthUser
function transformUser(dbUser: DBUser): AuthUser {
  return {
    id: dbUser.id,
    uuid: dbUser.uuid,
    email: dbUser.email,
    username: dbUser.username,
    displayName: dbUser.display_name,
    avatarUrl: dbUser.avatar_url,
    bio: dbUser.bio,
    role: dbUser.role,
    isVerified: dbUser.is_verified,
    vtuberName: dbUser.vtuber_name,
    vtuberAvatar: dbUser.vtuber_avatar,
    vtuberAgency: dbUser.vtuber_agency,
  };
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate tokens
export function generateTokens(user: AuthUser): { token: string; refreshToken: string } {
  const token = jwt.sign(
    { userId: user.id, uuid: user.uuid, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id, uuid: user.uuid, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
  );
  
  return { token, refreshToken };
}

// Verify token
export function verifyToken(token: string): { userId: number; uuid: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { userId: decoded.userId, uuid: decoded.uuid, role: decoded.role };
  } catch {
    return null;
  }
}

// Register user
export async function registerUser(
  email: string,
  username: string,
  password: string,
  displayName: string
): Promise<AuthResponse> {
  try {
    // Check if email exists
    const existingEmail = await queryOne<DBUser>('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail) {
      return { success: false, error: 'Email sudah terdaftar' };
    }
    
    // Check if username exists
    const existingUsername = await queryOne<DBUser>('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsername) {
      return { success: false, error: 'Username sudah digunakan' };
    }
    
    // Hash password and create user
    const passwordHash = await hashPassword(password);
    const uuid = uuidv4();
    
    const userId = await insert(
      `INSERT INTO users (uuid, email, username, display_name, password_hash, role, is_verified, is_active)
       VALUES (?, ?, ?, ?, ?, 'user', FALSE, TRUE)`,
      [uuid, email, username, displayName, passwordHash]
    );
    
    // Get created user
    const user = await queryOne<DBUser>('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return { success: false, error: 'Gagal membuat akun' };
    }
    
    const authUser = transformUser(user);
    const { token, refreshToken } = generateTokens(authUser);
    
    // Save session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await insert(
      `INSERT INTO user_sessions (user_id, token, refresh_token, expires_at) VALUES (?, ?, ?, ?)`,
      [userId, token, refreshToken, expiresAt]
    );
    
    return { success: true, user: authUser, token, refreshToken };
  } catch (error: any) {
    console.error('Register error:', error);
    return { success: false, error: 'Terjadi kesalahan saat mendaftar' };
  }
}

// Login user
export async function loginUser(emailOrUsername: string, password: string): Promise<AuthResponse> {
  try {
    // Find user
    const user = await queryOne<DBUser>(
      'SELECT * FROM users WHERE (email = ? OR username = ?) AND is_active = TRUE',
      [emailOrUsername, emailOrUsername]
    );
    
    if (!user) {
      return { success: false, error: 'Email/username atau password salah' };
    }
    
    // Check password
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      return { success: false, error: 'Email/username atau password salah' };
    }
    
    // Update last login
    await update('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);
    
    const authUser = transformUser(user);
    const { token, refreshToken } = generateTokens(authUser);
    
    // Save session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await insert(
      `INSERT INTO user_sessions (user_id, token, refresh_token, expires_at) VALUES (?, ?, ?, ?)`,
      [user.id, token, refreshToken, expiresAt]
    );
    
    return { success: true, user: authUser, token, refreshToken };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'Terjadi kesalahan saat login' };
  }
}

// Get user by token
export async function getUserByToken(token: string): Promise<AuthUser | null> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return null;
    
    const user = await queryOne<DBUser>(
      'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
      [decoded.userId]
    );
    
    if (!user) return null;
    return transformUser(user);
  } catch {
    return null;
  }
}

// Logout user
export async function logoutUser(token: string): Promise<boolean> {
  try {
    await update('DELETE FROM user_sessions WHERE token = ?', [token]);
    return true;
  } catch {
    return false;
  }
}

// Create VTuber account (admin only)
export async function createVTuberAccount(
  adminUserId: number,
  email: string,
  username: string,
  password: string,
  displayName: string,
  vtuberName: string,
  vtuberAgency?: string
): Promise<AuthResponse> {
  try {
    // Check if admin
    const admin = await queryOne<DBUser>('SELECT role FROM users WHERE id = ?', [adminUserId]);
    if (!admin || admin.role !== 'admin') {
      return { success: false, error: 'Tidak memiliki akses admin' };
    }
    
    // Check if email exists
    const existingEmail = await queryOne<DBUser>('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail) {
      return { success: false, error: 'Email sudah terdaftar' };
    }
    
    const passwordHash = await hashPassword(password);
    const uuid = uuidv4();
    
    const userId = await insert(
      `INSERT INTO users (uuid, email, username, display_name, password_hash, role, is_verified, is_active, vtuber_name, vtuber_agency, vtuber_debut_date)
       VALUES (?, ?, ?, ?, ?, 'vtuber', TRUE, TRUE, ?, ?, NOW())`,
      [uuid, email, username, displayName, passwordHash, vtuberName, vtuberAgency || null]
    );
    
    const user = await queryOne<DBUser>('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) {
      return { success: false, error: 'Gagal membuat akun VTuber' };
    }
    
    return { success: true, user: transformUser(user) };
  } catch (error: any) {
    console.error('Create VTuber error:', error);
    return { success: false, error: 'Terjadi kesalahan saat membuat akun VTuber' };
  }
}

// Get all users (admin)
export async function getAllUsers(page: number = 1, limit: number = 20, role?: string): Promise<{ users: AuthUser[]; total: number }> {
  try {
    let whereClause = '';
    const params: any[] = [];
    
    if (role) {
      whereClause = 'WHERE role = ?';
      params.push(role);
    }
    
    const offset = (page - 1) * limit;
    const users = await query<DBUser>(
      `SELECT * FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    const countResult = await queryOne<{ total: number }>(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      params
    );
    
    return {
      users: users.map(transformUser),
      total: countResult?.total || 0
    };
  } catch (error) {
    console.error('Get users error:', error);
    return { users: [], total: 0 };
  }
}

// Get all VTubers (public)
export async function getAllVTubers(): Promise<AuthUser[]> {
  try {
    const vtubers = await query<DBUser>(
      `SELECT * FROM users WHERE role = 'vtuber' AND is_active = TRUE ORDER BY vtuber_followers_count DESC`
    );
    return vtubers.map(transformUser);
  } catch (error) {
    console.error('Get VTubers error:', error);
    return [];
  }
}

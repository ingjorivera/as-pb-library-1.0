// Type definitions for appsmith-pocketbase v1.1.0
// Project: https://github.com/ingjorivera/as-pb-library-1.0
// Definitions by: Jorge Rivera

export interface AppsmithPBConfig {
  environment?: 'development' | 'staging' | 'production';
  APP_NAME?: string;
  POCKETBASE_URL?: string;
  API_BASE_URL?: string;
  ENABLE_DEBUG?: boolean;
  ENABLE_ANALYTICS?: boolean;
  ENABLE_ERROR_REPORTING?: boolean;
  SHOW_PERFORMANCE_METRICS?: boolean;
  DEFAULT_PAGE_SIZE?: number;
  MAX_PAGE_SIZE?: number;
  CACHE_TTL_MINUTES?: number;
  JWT_EXPIRY_HOURS?: number;
  REFRESH_TOKEN_EXPIRY_DAYS?: number;
  SESSION_TIMEOUT_MINUTES?: number;
  MAX_FILE_SIZE_MB?: number;
  ALLOWED_FILE_TYPES?: string[];
  DB_TIMEOUT_MS?: number;
  ENABLE_DB_LOGGING?: boolean;
  AUTO_REFRESH_SESSION?: boolean;
}

export interface PBUser {
  id: string;
  created: string;
  updated: string;
  email: string;
  verified: boolean;
  [key: string]: any;
}

export interface PBAuthData {
  token: string;
  record: PBUser;
}

export interface PBListResult<T = any> {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export interface PBRecord {
  id: string;
  created: string;
  updated: string;
  [key: string]: any;
}

export interface SystemInfo {
  version: string;
  environment: string;
  pocketbaseUrl: string;
  isAuthenticated: boolean;
  currentUser: PBUser | null;
  platform: string;
  config: {
    debugEnabled: boolean;
    analyticsEnabled: boolean;
  };
}

export interface UniversalEnvironment {
  configure(config: AppsmithPBConfig): boolean;
  get(key: string, defaultValue?: any): any;
  has(key: string): boolean;
  getEnvironment(): string;
  setEnvironment(env: 'development' | 'staging' | 'production'): boolean;
  isDevelopment(): boolean;
  isStaging(): boolean;
  isProduction(): boolean;
  getAll(): AppsmithPBConfig;
  validateRequiredConfig(requiredKeys: string[]): boolean;
  getExampleConfig(): AppsmithPBConfig;
}

export interface UniversalPocketBase {
  init(): any;
  getClient(): any;
  login(email: string, password: string): Promise<PBAuthData>;
  logout(): Promise<boolean>;
  validateSession(): Promise<boolean>;
  getCurrentUser(): PBUser | null;
  isAuthenticated(): boolean;
  create<T = PBRecord>(collection: string, data: any): Promise<T>;
  read<T = PBRecord>(collection: string, page?: number, perPage?: number, filter?: string, sort?: string): Promise<PBListResult<T>>;
  getById<T = PBRecord>(collection: string, id: string, expand?: string): Promise<T>;
  update<T = PBRecord>(collection: string, id: string, data: any): Promise<T>;
  delete(collection: string, id: string): Promise<boolean>;
  checkConnection(): Promise<boolean>;
  getSystemInfo(): SystemInfo;
}

export interface AppsmithPB {
  version: string;
  Environment: UniversalEnvironment;
  PocketBaseManager: UniversalPocketBase;
  
  // Configuration
  configure(config: AppsmithPBConfig): boolean;
  getConfigExample(): AppsmithPBConfig;
  checkConfig(): boolean;
  setEnvironment(environment: 'development' | 'staging' | 'production'): boolean;
  
  // Environment functions
  env(key: string, defaultValue?: any): any;
  isDev(): boolean;
  isStaging(): boolean;
  isProd(): boolean;
  getEnvironment(): string;
  
  // Authentication
  login(email: string, password: string): Promise<PBAuthData>;
  logout(): Promise<boolean>;
  validateSession(): Promise<boolean>;
  getCurrentUser(): PBUser | null;
  isAuthenticated(): boolean;
  
  // CRUD operations
  create<T = PBRecord>(collection: string, data: any): Promise<T>;
  read<T = PBRecord>(collection: string, page?: number, perPage?: number, filter?: string, sort?: string): Promise<PBListResult<T>>;
  getById<T = PBRecord>(collection: string, id: string, expand?: string): Promise<T>;
  update<T = PBRecord>(collection: string, id: string, data: any): Promise<T>;
  delete(collection: string, id: string): Promise<boolean>;
  
  // Utilities
  checkConnection(): Promise<boolean>;
  getSystemInfo(): SystemInfo;
  getPocketBaseClient(): any;
}

declare const AppsmithPB: AppsmithPB;

export default AppsmithPB;

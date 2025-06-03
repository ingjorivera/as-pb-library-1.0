/**
 * Appsmith PocketBase Library - UMD Version
 * Compatible con Appsmith, CDN, y npm
 * 
 * Versión: 1.1.0-umd
 * GitHub: https://github.com/ingjorivera/as-pb-library-1.0
 * CDN: https://cdn.jsdelivr.net/gh/ingjorivera/as-pb-library-1.0@main/appsmith-pb.js
 */

(function (root, factory) {
  // UMD pattern para máxima compatibilidad
  if (typeof define === 'function' && define.amd) {
    // AMD (RequireJS)
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node.js/CommonJS
    module.exports = factory();
  } else {
    // Browser globals (incluye Appsmith)
    root.AppsmithPB = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const VERSION = '1.1.0-umd';
  
  // ================================================================
  // CONFIGURACIONES BASE
  // ================================================================
  
  const environmentConfigs = {
    development: {
      APP_VERSION: VERSION,
      THEME_COLOR: '#ff6b6b',
      ENABLE_DEBUG: true,
      ENABLE_ANALYTICS: false,
      ENABLE_ERROR_REPORTING: false,
      SHOW_PERFORMANCE_METRICS: true,
      DEFAULT_PAGE_SIZE: 10,
      MAX_PAGE_SIZE: 100,
      CACHE_TTL_MINUTES: 5,
      JWT_EXPIRY_HOURS: 24,
      REFRESH_TOKEN_EXPIRY_DAYS: 7,
      SESSION_TIMEOUT_MINUTES: 60,
      MAX_FILE_SIZE_MB: 10,
      ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      DB_TIMEOUT_MS: 5000,
      ENABLE_DB_LOGGING: true,
      AUTO_REFRESH_SESSION: true,
    },
    
    staging: {
      APP_VERSION: VERSION,
      THEME_COLOR: '#feca57',
      ENABLE_DEBUG: true,
      ENABLE_ANALYTICS: true,
      ENABLE_ERROR_REPORTING: true,
      SHOW_PERFORMANCE_METRICS: true,
      DEFAULT_PAGE_SIZE: 20,
      MAX_PAGE_SIZE: 200,
      CACHE_TTL_MINUTES: 15,
      JWT_EXPIRY_HOURS: 12,
      REFRESH_TOKEN_EXPIRY_DAYS: 3,
      SESSION_TIMEOUT_MINUTES: 30,
      MAX_FILE_SIZE_MB: 50,
      ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
      DB_TIMEOUT_MS: 8000,
      ENABLE_DB_LOGGING: true,
      AUTO_REFRESH_SESSION: true,
    },
    
    production: {
      APP_VERSION: VERSION,
      THEME_COLOR: '#5f27cd',
      ENABLE_DEBUG: false,
      ENABLE_ANALYTICS: true,
      ENABLE_ERROR_REPORTING: true,
      SHOW_PERFORMANCE_METRICS: false,
      DEFAULT_PAGE_SIZE: 50,
      MAX_PAGE_SIZE: 500,
      CACHE_TTL_MINUTES: 60,
      JWT_EXPIRY_HOURS: 2,
      REFRESH_TOKEN_EXPIRY_DAYS: 30,
      SESSION_TIMEOUT_MINUTES: 15,
      MAX_FILE_SIZE_MB: 100,
      ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'zip'],
      DB_TIMEOUT_MS: 10000,
      ENABLE_DB_LOGGING: false,
      AUTO_REFRESH_SESSION: true,
    }
  };
  
  // ================================================================
  // STORAGE COMPATIBLE CON APPSMITH
  // ================================================================
  
  function createCompatibleStorage() {
    // Detectar el entorno
    const isAppsmith = typeof appsmith !== 'undefined';
    const hasLocalStorage = typeof localStorage !== 'undefined';
    
    return {
      setItem: function(key, value) {
        try {
          // Prioridad 1: Appsmith storeValue
          if (isAppsmith && typeof storeValue === 'function') {
            storeValue(key, value, true);
            return true;
          }
          
          // Prioridad 2: localStorage (si está disponible)
          if (hasLocalStorage) {
            localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
            return true;
          }
          
          // Fallback: memoria (solo para esta sesión)
          this._memoryStorage = this._memoryStorage || {};
          this._memoryStorage[key] = value;
          return true;
          
        } catch (error) {
          console.warn('[AppsmithPB] Storage setItem failed:', error);
          return false;
        }
      },
      
      getItem: function(key) {
        try {
          // Prioridad 1: Appsmith store
          if (isAppsmith && typeof appsmith !== 'undefined' && appsmith.store && appsmith.store[key] !== undefined) {
            return appsmith.store[key];
          }
          
          // Prioridad 2: localStorage
          if (hasLocalStorage && localStorage.getItem(key) !== null) {
            return localStorage.getItem(key);
          }
          
          // Fallback: memoria
          if (this._memoryStorage && this._memoryStorage[key] !== undefined) {
            return this._memoryStorage[key];
          }
          
          return null;
          
        } catch (error) {
          console.warn('[AppsmithPB] Storage getItem failed:', error);
          return null;
        }
      },
      
      removeItem: function(key) {
        try {
          // Appsmith
          if (isAppsmith && typeof storeValue === 'function') {
            storeValue(key, null, true);
          }
          
          // localStorage
          if (hasLocalStorage) {
            localStorage.removeItem(key);
          }
          
          // memoria
          if (this._memoryStorage) {
            delete this._memoryStorage[key];
          }
          
        } catch (error) {
          console.warn('[AppsmithPB] Storage removeItem failed:', error);
        }
      }
    };
  }
  
  // ================================================================
  // CLASE DE CONFIGURACIÓN UNIVERSAL
  // ================================================================
  
  class UniversalEnvironment {
    constructor(config = {}) {
      this.currentEnv = config.environment || 'development';
      this.customConfig = config;
      this.mergedConfig = { ...environmentConfigs[this.currentEnv], ...config };
      this.version = VERSION;
      this.storage = createCompatibleStorage();
      
      this.logEnvironmentInfo();
    }
    
    configure(config) {
      this.customConfig = { ...this.customConfig, ...config };
      this.mergedConfig = { ...environmentConfigs[this.currentEnv], ...this.customConfig };
      
      this.log('Configuración actualizada', Object.keys(config));
      return true;
    }
    
    get(key, defaultValue = null) {
      return this.mergedConfig.hasOwnProperty(key) ? this.mergedConfig[key] : defaultValue;
    }
    
    has(key) {
      return this.mergedConfig.hasOwnProperty(key);
    }
    
    getEnvironment() {
      return this.currentEnv;
    }
    
    setEnvironment(env) {
      if (['development', 'staging', 'production'].includes(env)) {
        this.currentEnv = env;
        this.mergedConfig = { ...environmentConfigs[env], ...this.customConfig };
        this.log(`Entorno cambiado a: ${env}`);
        return true;
      }
      return false;
    }
    
    isDevelopment() {
      return this.currentEnv === 'development';
    }
    
    isStaging() {
      return this.currentEnv === 'staging';
    }
    
    isProduction() {
      return this.currentEnv === 'production';
    }
    
    getAll() {
      return { ...this.mergedConfig };
    }
    
    validateRequiredConfig(requiredKeys) {
      const missing = requiredKeys.filter(key => !this.has(key));
      
      if (missing.length > 0) {
        const error = new Error(`Configuración faltante: ${missing.join(', ')}`);
        this.log('Validación falló:', error.message);
        throw error;
      }
      
      return true;
    }
    
    log(message, data = null) {
      if (!this.get('ENABLE_DEBUG')) return;
      console.log(`🌍 [AppsmithPB v${VERSION}] ${message}`, data || '');
    }
    
    logEnvironmentInfo() {
      if (!this.get('ENABLE_DEBUG')) return;
      
      const platform = typeof appsmith !== 'undefined' ? 'Appsmith' : 
                      typeof window !== 'undefined' ? 'Browser' : 'Node.js';
      
      console.log(`🚀 AppsmithPB v${VERSION} inicializado en ${platform}`);
      console.log(`📍 Entorno: ${this.currentEnv.toUpperCase()}`);
      console.log(`🎨 Theme Color: ${this.get('THEME_COLOR')}`);
    }
    
    getExampleConfig() {
      return {
        environment: 'development',
        APP_NAME: 'Mi App Appsmith',
        POCKETBASE_URL: 'https://tu-pocketbase.fly.dev',
        API_BASE_URL: 'https://tu-api.herokuapp.com/api',
      };
    }
  }
  
  // ================================================================
  // CLASE POCKETBASE MANAGER UNIVERSAL
  // ================================================================
  
  class UniversalPocketBase {
    constructor(env) {
      this.env = env;
      this.pbClient = null;
      this.isInitialized = false;
      this.authInfo = null;
    }
    
    init() {
      if (this.isInitialized) return this.pbClient;
      
      if (typeof PocketBase === 'undefined') {
        throw new Error('[AppsmithPB] PocketBase library no está disponible. Instálala primero.');
      }
      
      const pbUrl = this.env.get('POCKETBASE_URL');
      if (!pbUrl) {
        throw new Error('[AppsmithPB] POCKETBASE_URL no configurado. Usar configure() primero.');
      }
      
      this.pbClient = new PocketBase(pbUrl);
      this.setupTimeout();
      this.isInitialized = true;
      
      this.log('PocketBase inicializado', { url: this.maskUrl(pbUrl) });
      
      return this.pbClient;
    }
    
    maskUrl(url) {
      if (!url) return 'No configurado';
      
      try {
        const urlObj = new URL(url);
        return `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}`;
      } catch {
        return 'URL inválida';
      }
    }
    
    setupTimeout() {
      const timeout = this.env.get('DB_TIMEOUT_MS', 10000);
      const originalSend = this.pbClient.send;
      
      this.pbClient.send = function(path, config = {}) {
        return Promise.race([
          originalSend.call(this, path, config),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('[AppsmithPB] Timeout de conexión')), timeout)
          )
        ]);
      };
    }
    
    getClient() {
      if (!this.isInitialized) {
        this.init();
      }
      return this.pbClient;
    }
    
    // ================================================================
    // AUTENTICACIÓN
    // ================================================================
    
    async login(email, password) {
      const pb = this.getClient();
      
      try {
        this.log('Iniciando login', { email });
        
        const authData = await pb.collection('users').authWithPassword(email, password);
        
        const jwtExpiry = this.env.get('JWT_EXPIRY_HOURS', 2) * 60 * 60 * 1000;
        const refreshExpiry = this.env.get('REFRESH_TOKEN_EXPIRY_DAYS', 7) * 24 * 60 * 60 * 1000;
        
        this.authInfo = {
          token: authData.token,
          user: authData.record,
          expiresAt: Date.now() + jwtExpiry,
          refreshExpiresAt: Date.now() + refreshExpiry,
          environment: this.env.getEnvironment(),
          loginTime: Date.now()
        };
        
        // Guardar en storage compatible
        this.env.storage.setItem('appsmith_pb_auth', JSON.stringify(this.authInfo));
        this.env.storage.setItem('pb_token', authData.token);
        this.env.storage.setItem('pb_user', JSON.stringify(authData.record));
        this.env.storage.setItem('pb_auth_env', this.env.getEnvironment());
        
        this.log('Login exitoso', { userId: authData.record.id });
        
        return authData;
        
      } catch (error) {
        this.logError('Error en login', error);
        throw error;
      }
    }
    
    async logout() {
      const pb = this.getClient();
      
      try {
        pb.authStore.clear();
        
        // Limpiar storage
        this.env.storage.removeItem('appsmith_pb_auth');
        this.env.storage.removeItem('pb_token');
        this.env.storage.removeItem('pb_user');
        this.env.storage.removeItem('pb_auth_env');
        
        this.authInfo = null;
        this.log('Logout exitoso');
        
        return true;
        
      } catch (error) {
        this.logError('Error en logout', error);
        throw error;
      }
    }
    
    async validateSession() {
      const pb = this.getClient();
      
      try {
        const storedAuth = this.env.storage.getItem('appsmith_pb_auth');
        if (!storedAuth) return false;
        
        this.authInfo = JSON.parse(storedAuth);
        
        if (this.authInfo.environment !== this.env.getEnvironment()) {
          this.log('Entorno cambió, limpiando sesión');
          await this.logout();
          return false;
        }
        
        const now = Date.now();
        
        if (now > this.authInfo.refreshExpiresAt) {
          this.log('Refresh token expirado');
          await this.logout();
          return false;
        }
        
        if (now > this.authInfo.expiresAt) {
          this.log('Token expirado, intentando refresh');
          
          try {
            pb.authStore.save(this.authInfo.token, this.authInfo.user);
            await pb.collection('users').authRefresh();
            
            const jwtExpiry = this.env.get('JWT_EXPIRY_HOURS', 2) * 60 * 60 * 1000;
            this.authInfo.token = pb.authStore.token;
            this.authInfo.user = pb.authStore.model;
            this.authInfo.expiresAt = Date.now() + jwtExpiry;
            
            this.env.storage.setItem('appsmith_pb_auth', JSON.stringify(this.authInfo));
            this.env.storage.setItem('pb_token', this.authInfo.token);
            this.env.storage.setItem('pb_user', JSON.stringify(this.authInfo.user));
            
            this.log('Token refrescado exitosamente');
            return true;
            
          } catch (refreshError) {
            this.logError('Error al refrescar token', refreshError);
            await this.logout();
            return false;
          }
        }
        
        pb.authStore.save(this.authInfo.token, this.authInfo.user);
        this.log('Sesión válida');
        return true;
        
      } catch (error) {
        this.logError('Error validando sesión', error);
        await this.logout();
        return false;
      }
    }
    
    getCurrentUser() {
      return this.authInfo?.user || null;
    }
    
    isAuthenticated() {
      return !!(this.authInfo && Date.now() < this.authInfo.refreshExpiresAt);
    }
    
    // ================================================================
    // CRUD OPERATIONS
    // ================================================================
    
    async create(collection, data) {
      const pb = this.getClient();
      
      try {
        this.log(`Creando registro en ${collection}`, data);
        const record = await pb.collection(collection).create(data);
        this.log(`Registro creado en ${collection}`, { id: record.id });
        return record;
      } catch (error) {
        this.logError(`Error creando en ${collection}`, error);
        throw error;
      }
    }
    
    async read(collection, page = 1, perPage = null, filter = '', sort = '') {
      const pb = this.getClient();
      
      if (!perPage) {
        perPage = this.env.get('DEFAULT_PAGE_SIZE', 20);
      }
      
      const maxPageSize = this.env.get('MAX_PAGE_SIZE', 500);
      if (perPage > maxPageSize) {
        perPage = maxPageSize;
      }
      
      try {
        this.log(`Leyendo ${collection}`, { page, perPage, filter, sort });
        
        const records = await pb.collection(collection).getList(page, perPage, {
          filter: filter,
          sort: sort || '-created'
        });
        
        if (this.env.get('SHOW_PERFORMANCE_METRICS')) {
          console.log(`📊 [PocketBase] ${records.items.length} registros de ${collection} (página ${records.page}/${records.totalPages})`);
        }
        
        return records;
        
      } catch (error) {
        this.logError(`Error leyendo ${collection}`, error);
        throw error;
      }
    }
    
    async getById(collection, id, expand = '') {
      const pb = this.getClient();
      
      try {
        this.log(`Obteniendo ${collection}/${id}`);
        const record = await pb.collection(collection).getOne(id, { expand: expand });
        this.log(`Registro obtenido: ${collection}/${id}`);
        return record;
      } catch (error) {
        this.logError(`Error obteniendo ${collection}/${id}`, error);
        throw error;
      }
    }
    
    async update(collection, id, data) {
      const pb = this.getClient();
      
      try {
        this.log(`Actualizando ${collection}/${id}`, data);
        const record = await pb.collection(collection).update(id, data);
        this.log(`Registro actualizado: ${collection}/${id}`);
        return record;
      } catch (error) {
        this.logError(`Error actualizando ${collection}/${id}`, error);
        throw error;
      }
    }
    
    async delete(collection, id) {
      const pb = this.getClient();
      
      try {
        this.log(`Eliminando ${collection}/${id}`);
        await pb.collection(collection).delete(id);
        this.log(`Registro eliminado: ${collection}/${id}`);
        return true;
      } catch (error) {
        this.logError(`Error eliminando ${collection}/${id}`, error);
        throw error;
      }
    }
    
    // ================================================================
    // UTILIDADES
    // ================================================================
    
    async checkConnection() {
      try {
        const pb = this.getClient();
        await pb.health.check();
        return true;
      } catch (error) {
        this.logError('Error de conexión a PocketBase', error);
        return false;
      }
    }
    
    getSystemInfo() {
      return {
        version: VERSION,
        environment: this.env.getEnvironment(),
        pocketbaseUrl: this.maskUrl(this.env.get('POCKETBASE_URL')),
        isAuthenticated: this.isAuthenticated(),
        currentUser: this.getCurrentUser(),
        platform: typeof appsmith !== 'undefined' ? 'Appsmith' : 
                  typeof window !== 'undefined' ? 'Browser' : 'Node.js',
        config: {
          debugEnabled: this.env.get('ENABLE_DEBUG'),
          analyticsEnabled: this.env.get('ENABLE_ANALYTICS')
        }
      };
    }
    
    log(message, data = null) {
      if (!this.env.get('ENABLE_DB_LOGGING') && !this.env.get('ENABLE_DEBUG')) return;
      console.log(`🗄️ [PocketBase] ${message}`, data || '');
    }
    
    logError(message, error) {
      if (!this.env.get('ENABLE_DB_LOGGING') && !this.env.get('ENABLE_DEBUG')) return;
      console.error(`❌ [PocketBase] ${message}`, error);
    }
  }
  
  // ================================================================
  // INICIALIZACIÓN
  // ================================================================
  
  const Environment = new UniversalEnvironment();
  const PocketBaseManager = new UniversalPocketBase(Environment);
  
  // ================================================================
  // API PÚBLICA
  // ================================================================
  
  const AppsmithPB = {
    version: VERSION,
    
    Environment,
    PocketBaseManager,
    
    // Configuración
    configure: function(config) {
      const success = Environment.configure(config);
      
      if (success) {
        console.log('✅ [AppsmithPB] Configuración actualizada exitosamente');
        
        try {
          Environment.validateRequiredConfig(['POCKETBASE_URL']);
          console.log('✅ [AppsmithPB] Configuración mínima completa');
        } catch (error) {
          console.warn('⚠️ [AppsmithPB]', error.message);
          console.log('💡 Ejemplo:', Environment.getExampleConfig());
        }
      }
      
      return success;
    },
    
    getConfigExample: function() {
      return Environment.getExampleConfig();
    },
    
    checkConfig: function() {
      const config = Environment.getAll();
      
      console.group('🔧 Estado de Configuración AppsmithPB');
      console.log('Entorno actual:', Environment.getEnvironment());
      console.log('Variables configuradas:', Object.keys(config).length);
      
      const requiredKeys = ['POCKETBASE_URL'];
      const missingKeys = requiredKeys.filter(key => !Environment.has(key));
      
      if (missingKeys.length > 0) {
        console.warn('⚠️ Variables faltantes:', missingKeys);
        console.log('💡 Configurar con: AppsmithPB.configure({ POCKETBASE_URL: "..." })');
      } else {
        console.log('✅ Configuración mínima completa');
      }
      
      console.groupEnd();
      
      return missingKeys.length === 0;
    },
    
    setEnvironment: function(environment) {
      return Environment.setEnvironment(environment);
    },
    
    // Funciones de entorno
    env: function(key, defaultValue) {
      return Environment.get(key, defaultValue);
    },
    
    isDev: function() {
      return Environment.isDevelopment();
    },
    
    isStaging: function() {
      return Environment.isStaging();
    },
    
    isProd: function() {
      return Environment.isProduction();
    },
    
    getEnvironment: function() {
      return Environment.getEnvironment();
    },
    
    // Autenticación
    login: async function(email, password) {
      return await PocketBaseManager.login(email, password);
    },
    
    logout: async function() {
      return await PocketBaseManager.logout();
    },
    
    validateSession: async function() {
      return await PocketBaseManager.validateSession();
    },
    
    getCurrentUser: function() {
      return PocketBaseManager.getCurrentUser();
    },
    
    isAuthenticated: function() {
      return PocketBaseManager.isAuthenticated();
    },
    
    // CRUD
    create: async function(collection, data) {
      return await PocketBaseManager.create(collection, data);
    },
    
    read: async function(collection, page, perPage, filter, sort) {
      return await PocketBaseManager.read(collection, page, perPage, filter, sort);
    },
    
    getById: async function(collection, id, expand) {
      return await PocketBaseManager.getById(collection, id, expand);
    },
    
    update: async function(collection, id, data) {
      return await PocketBaseManager.update(collection, id, data);
    },
    
    delete: async function(collection, id) {
      return await PocketBaseManager.delete(collection, id);
    },
    
    // Utilidades
    checkConnection: async function() {
      return await PocketBaseManager.checkConnection();
    },
    
    getSystemInfo: function() {
      return PocketBaseManager.getSystemInfo();
    },
    
    getPocketBaseClient: function() {
      return PocketBaseManager.getClient();
    }
  };
  
  // Log de inicialización
  console.log(`🚀 AppsmithPB v${VERSION} (UMD) cargado exitosamente`);
  
  return AppsmithPB;
}));

/**
 * Appsmith PocketBase Library - VERSIÓN COMPATIBLE CON APPSMITH
 * 
 * Esta versión está optimizada para funcionar dentro del sandbox de Appsmith
 * sin acceso a localStorage, window, ni otras APIs restringidas.
 * 
 * Versión: 1.1.0-appsmith
 * Autor: Tu Nombre
 * Licencia: MIT
 */

const AppsmithPB = (function() {
  'use strict';

  const VERSION = '1.1.0-appsmith';
  
  // ================================================================
  // CONFIGURACIONES BASE (COMPATIBLES CON APPSMITH)
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
  // CLASE DE CONFIGURACIÓN PARA APPSMITH
  // ================================================================
  
  class AppsmithEnvironment {
    constructor(config = {}) {
      this.currentEnv = config.environment || 'development';
      this.customConfig = config;
      this.mergedConfig = { ...environmentConfigs[this.currentEnv], ...config };
      this.version = VERSION;
      
      // Storage en memoria para reemplazar localStorage
      this.memoryStorage = {};
      
      this.logEnvironmentInfo();
    }
    
    // Simular localStorage usando almacenamiento en memoria
    setItem(key, value) {
      try {
        this.memoryStorage[key] = typeof value === 'string' ? value : JSON.stringify(value);
        return true;
      } catch (error) {
        this.log('Error en setItem:', error);
        return false;
      }
    }
    
    getItem(key) {
      try {
        return this.memoryStorage[key] || null;
      } catch (error) {
        this.log('Error en getItem:', error);
        return null;
      }
    }
    
    removeItem(key) {
      delete this.memoryStorage[key];
    }
    
    // Configurar variables de entorno
    configure(config) {
      this.customConfig = { ...this.customConfig, ...config };
      this.mergedConfig = { ...environmentConfigs[this.currentEnv], ...this.customConfig };
      
      this.log('Configuración actualizada', Object.keys(config));
      return true;
    }
    
    // Obtener variable de configuración
    get(key, defaultValue = null) {
      return this.mergedConfig.hasOwnProperty(key) ? this.mergedConfig[key] : defaultValue;
    }
    
    // Verificar si existe una variable
    has(key) {
      return this.mergedConfig.hasOwnProperty(key);
    }
    
    // Obtener entorno actual
    getEnvironment() {
      return this.currentEnv;
    }
    
    // Cambiar entorno
    setEnvironment(env) {
      if (['development', 'staging', 'production'].includes(env)) {
        this.currentEnv = env;
        this.mergedConfig = { ...environmentConfigs[env], ...this.customConfig };
        this.log(`Entorno cambiado a: ${env}`);
        return true;
      }
      return false;
    }
    
    // Verificadores de entorno
    isDevelopment() {
      return this.currentEnv === 'development';
    }
    
    isStaging() {
      return this.currentEnv === 'staging';
    }
    
    isProduction() {
      return this.currentEnv === 'production';
    }
    
    // Obtener toda la configuración
    getAll() {
      return { ...this.mergedConfig };
    }
    
    // Validar configuración requerida
    validateRequiredConfig(requiredKeys) {
      const missing = requiredKeys.filter(key => !this.has(key));
      
      if (missing.length > 0) {
        const error = new Error(`Configuración faltante: ${missing.join(', ')}`);
        this.log('Validación falló:', error.message);
        throw error;
      }
      
      return true;
    }
    
    // Logging seguro para Appsmith
    log(message, data = null) {
      if (!this.get('ENABLE_DEBUG')) return;
      
      console.log(`🌍 [AppsmithPB v${VERSION}] ${message}`, data || '');
    }
    
    logEnvironmentInfo() {
      if (!this.get('ENABLE_DEBUG')) return;
      
      console.log(`🚀 AppsmithPB v${VERSION} inicializado`);
      console.log(`📍 Entorno: ${this.currentEnv.toUpperCase()}`);
      console.log(`🎨 Theme Color: ${this.get('THEME_COLOR')}`);
      console.log(`🔧 Variables configuradas: ${Object.keys(this.mergedConfig).length}`);
    }
    
    // Configuración de ejemplo
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
  // CLASE POCKETBASE MANAGER PARA APPSMITH
  // ================================================================
  
  class AppsmithPocketBase {
    constructor(env) {
      this.env = env;
      this.pbClient = null;
      this.isInitialized = false;
      this.authInfo = null;
      this.sessionStorage = {}; // Storage en memoria para la sesión
    }
    
    init() {
      if (this.isInitialized) return this.pbClient;
      
      // Verificar que PocketBase esté disponible
      if (typeof PocketBase === 'undefined') {
        throw new Error('[AppsmithPB] PocketBase library no está disponible. Asegúrate de haberla instalado en Appsmith.');
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
    
    // Ocultar URLs sensibles en logs
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
    // MÉTODOS DE AUTENTICACIÓN ADAPTADOS PARA APPSMITH
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
        
        // Usar storage en memoria en lugar de localStorage
        this.sessionStorage.auth = JSON.stringify(this.authInfo);
        
        // Intentar usar storeValue de Appsmith si está disponible
        if (typeof storeValue === 'function') {
          try {
            storeValue('pb_token', authData.token, true);
            storeValue('pb_user', authData.record, true);
            storeValue('pb_auth_env', this.env.getEnvironment(), true);
            this.log('Datos guardados en Appsmith store');
          } catch (error) {
            this.log('Warning: No se pudo usar storeValue', error.message);
          }
        }
        
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
        
        // Limpiar storage en memoria
        delete this.sessionStorage.auth;
        
        // Limpiar Appsmith store si está disponible
        if (typeof storeValue === 'function') {
          try {
            storeValue('pb_token', null, true);
            storeValue('pb_user', null, true);
            storeValue('pb_auth_env', null, true);
          } catch (error) {
            this.log('Warning: No se pudo limpiar storeValue', error.message);
          }
        }
        
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
        // Intentar cargar de storage en memoria primero
        let storedAuth = this.sessionStorage.auth;
        
        // Si no hay en memoria, intentar desde Appsmith store
        if (!storedAuth && typeof appsmith !== 'undefined' && appsmith.store) {
          try {
            const token = appsmith.store.pb_token;
            const user = appsmith.store.pb_user;
            const env = appsmith.store.pb_auth_env;
            
            if (token && user) {
              storedAuth = JSON.stringify({
                token,
                user,
                environment: env,
                expiresAt: Date.now() + (this.env.get('JWT_EXPIRY_HOURS', 2) * 60 * 60 * 1000),
                refreshExpiresAt: Date.now() + (this.env.get('REFRESH_TOKEN_EXPIRY_DAYS', 7) * 24 * 60 * 60 * 1000),
                loginTime: Date.now()
              });
            }
          } catch (error) {
            this.log('Warning: No se pudo acceder a appsmith.store', error.message);
          }
        }
        
        if (!storedAuth) return false;
        
        this.authInfo = JSON.parse(storedAuth);
        
        // Verificar entorno
        if (this.authInfo.environment !== this.env.getEnvironment()) {
          this.log('Entorno cambió, limpiando sesión');
          await this.logout();
          return false;
        }
        
        const now = Date.now();
        
        // Verificar expiración del refresh token
        if (now > this.authInfo.refreshExpiresAt) {
          this.log('Refresh token expirado');
          await this.logout();
          return false;
        }
        
        // Verificar si necesita refresh
        if (now > this.authInfo.expiresAt) {
          this.log('Token expirado, intentando refresh');
          
          try {
            pb.authStore.save(this.authInfo.token, this.authInfo.user);
            await pb.collection('users').authRefresh();
            
            const jwtExpiry = this.env.get('JWT_EXPIRY_HOURS', 2) * 60 * 60 * 1000;
            this.authInfo.token = pb.authStore.token;
            this.authInfo.user = pb.authStore.model;
            this.authInfo.expiresAt = Date.now() + jwtExpiry;
            
            // Actualizar storage
            this.sessionStorage.auth = JSON.stringify(this.authInfo);
            
            if (typeof storeValue === 'function') {
              try {
                storeValue('pb_token', this.authInfo.token, true);
                storeValue('pb_user', this.authInfo.user, true);
              } catch (error) {
                this.log('Warning: No se pudo actualizar storeValue', error.message);
              }
            }
            
            this.log('Token refrescado exitosamente');
            return true;
            
          } catch (refreshError) {
            this.logError('Error al refrescar token', refreshError);
            await this.logout();
            return false;
          }
        }
        
        // Restaurar sesión en PocketBase
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
    // OPERACIONES CRUD
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
  // INICIALIZACIÓN PRINCIPAL
  // ================================================================
  
  // Crear instancia de entorno
  const Environment = new AppsmithEnvironment();
  
  // Crear instancia de PocketBase Manager
  const PocketBaseManager = new AppsmithPocketBase(Environment);
  
  // ================================================================
  // API PÚBLICA DE LA LIBRERÍA
  // ================================================================
  
  return {
    version: VERSION,
    
    // Instancias principales
    Environment,
    PocketBaseManager,
    
    // ================================================================
    // CONFIGURACIÓN
    // ================================================================
    
    configure: function(config) {
      const success = Environment.configure(config);
      
      if (success) {
        console.log('✅ [AppsmithPB] Configuración actualizada exitosamente');
        
        // Validar configuración requerida
        try {
          Environment.validateRequiredConfig(['POCKETBASE_URL']);
          console.log('✅ [AppsmithPB] Configuración mínima completa');
        } catch (error) {
          console.warn('⚠️ [AppsmithPB]', error.message);
          console.log('💡 Ejemplo:', Environment.getExampleConfig());
        }
      } else {
        console.error('❌ [AppsmithPB] Error configurando');
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
    
    // ================================================================
    // FUNCIONES DE ENTORNO
    // ================================================================
    
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
    
    // ================================================================
    // FUNCIONES DE AUTENTICACIÓN
    // ================================================================
    
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
    
    // ================================================================
    // FUNCIONES CRUD
    // ================================================================
    
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
    
    // ================================================================
    // UTILIDADES
    // ================================================================
    
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

})();

// Para uso en Appsmith, exportar como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppsmithPB;
}

// También hacer disponible globalmente para conveniencia
if (typeof globalThis !== 'undefined') {
  globalThis.AppsmithPB = AppsmithPB;
}

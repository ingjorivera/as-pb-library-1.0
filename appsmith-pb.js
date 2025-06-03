/**
 * Appsmith PocketBase Library - VERSIÓN SEGURA
 * 
 * Esta versión NO incluye URLs hardcodeadas para mayor seguridad.
 * Las URLs se configuran localmente en cada app de Appsmith.
 * 
 * Versión: 1.0.0-secure
 * Autor: Tu Nombre
 * Licencia: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.AppsmithPB = factory());
}(this, (function () { 'use strict';

  const VERSION = '1.0.0-secure';
  
  // ================================================================
  // CONFIGURACIONES BASE (SIN URLs SENSIBLES)
  // ================================================================
  
  // Configuraciones que SÍ es seguro exponer públicamente
  const safeEnvironmentConfigs = {
    development: {
      // Configuración de aplicación
      APP_VERSION: VERSION,
      THEME_COLOR: '#ff6b6b',
      
      // Configuración de funcionalidades
      ENABLE_DEBUG: true,
      ENABLE_ANALYTICS: false,
      ENABLE_ERROR_REPORTING: false,
      SHOW_PERFORMANCE_METRICS: true,
      SHOW_DEV_TOOLS: true,
      
      // Configuración de datos
      DEFAULT_PAGE_SIZE: 10,
      MAX_PAGE_SIZE: 100,
      CACHE_TTL_MINUTES: 5,
      
      // Configuración de autenticación
      JWT_EXPIRY_HOURS: 24,
      REFRESH_TOKEN_EXPIRY_DAYS: 7,
      SESSION_TIMEOUT_MINUTES: 60,
      
      // Configuración de archivos
      MAX_FILE_SIZE_MB: 10,
      ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
      
      // Configuración de PocketBase
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
      SHOW_DEV_TOOLS: true,
      
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
      SHOW_DEV_TOOLS: false,
      
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
  // DETECCIÓN DE ENTORNO
  // ================================================================
  
  function detectEnvironment() {
    // 1. Verificar configuración manual primero
    const manualEnv = localStorage.getItem('APPSMITH_ENV');
    if (manualEnv) {
      return manualEnv;
    }
    
    // 2. Auto-detectar por URL
    const url = window.location.href.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    
    if (hostname === 'localhost' || hostname.includes('127.0.0.1') || hostname.includes('192.168.')) {
      return 'development';
    }
    
    if (url.includes('dev') || url.includes('desarrollo') || url.includes('development')) {
      return 'development';
    }
    
    if (url.includes('staging') || url.includes('test') || url.includes('prueba') || url.includes('qa')) {
      return 'staging';
    }
    
    if (url.includes('prod') || url.includes('produccion') || url.includes('production')) {
      return 'production';
    }
    
    return 'staging';
  }
  
  // ================================================================
  // CLASE DE CONFIGURACIÓN SEGURA
  // ================================================================
  
  class SecureAppsmithEnvironment {
    constructor() {
      this.currentEnv = detectEnvironment();
      this.safeConfig = safeEnvironmentConfigs[this.currentEnv] || safeEnvironmentConfigs.staging;
      this.localConfig = this.loadLocalConfig();
      this.version = VERSION;
      
      this.logEnvironmentInfo();
    }
    
    // Cargar configuración local (URLs sensibles)
    loadLocalConfig() {
      try {
        const stored = localStorage.getItem('appsmith_local_config');
        return stored ? JSON.parse(stored) : {};
      } catch (error) {
        console.warn('[AppsmithPB] Error cargando configuración local:', error);
        return {};
      }
    }
    
    // Configurar URLs sensibles localmente
    setLocalConfig(config) {
      try {
        const currentLocal = this.loadLocalConfig();
        const newConfig = { ...currentLocal, ...config };
        
        localStorage.setItem('appsmith_local_config', JSON.stringify(newConfig));
        this.localConfig = newConfig;
        
        console.log('[AppsmithPB] Configuración local actualizada');
        return true;
      } catch (error) {
        console.error('[AppsmithPB] Error guardando configuración local:', error);
        return false;
      }
    }
    
    // Obtener variable (primero local, luego safe config)
    get(key, defaultValue = null) {
      // Prioridad: configuración local > configuración segura
      if (this.localConfig.hasOwnProperty(key)) {
        return this.localConfig[key];
      }
      
      if (this.safeConfig.hasOwnProperty(key)) {
        return this.safeConfig[key];
      }
      
      return defaultValue;
    }
    
    // Verificar si existe una variable
    has(key) {
      return this.localConfig.hasOwnProperty(key) || this.safeConfig.hasOwnProperty(key);
    }
    
    // Obtener entorno actual
    getEnvironment() {
      return this.currentEnv;
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
    
    // Obtener toda la configuración (mezclada)
    getAll() {
      return { ...this.safeConfig, ...this.localConfig };
    }
    
    // Verificar configuración requerida
    validateRequiredConfig(requiredKeys) {
      const missing = [];
      
      requiredKeys.forEach(key => {
        if (!this.has(key)) {
          missing.push(key);
        }
      });
      
      if (missing.length > 0) {
        const error = new Error(`Configuración faltante: ${missing.join(', ')}`);
        console.error('[AppsmithPB] Validación falló:', error);
        throw error;
      }
      
      return true;
    }
    
    // Configuración de ejemplo (para mostrar qué se necesita)
    getExampleConfig() {
      return {
        development: {
          APP_NAME: 'Mi App (DEV)',
          POCKETBASE_URL: 'http://localhost:8090',
          API_BASE_URL: 'http://localhost:3000/api',
        },
        staging: {
          APP_NAME: 'Mi App (STAGING)',
          POCKETBASE_URL: 'https://tu-pocketbase-staging.fly.dev',
          API_BASE_URL: 'https://tu-api-staging.herokuapp.com/api',
        },
        production: {
          APP_NAME: 'Mi App',
          POCKETBASE_URL: 'https://tu-pocketbase-prod.fly.dev',
          API_BASE_URL: 'https://tu-api-prod.herokuapp.com/api',
        }
      };
    }
    
    // Logging de información del entorno (sin datos sensibles)
    logEnvironmentInfo() {
      if (!this.get('ENABLE_DEBUG')) return;
      
      console.group(`🌍 [AppsmithPB v${VERSION}] Entorno: ${this.currentEnv.toUpperCase()}`);
      console.log('📍 URL:', window.location.href);
      console.log('🎨 Theme Color:', this.get('THEME_COLOR'));
      console.log('🔧 Variables seguras:', Object.keys(this.safeConfig).length);
      console.log('🔒 Variables locales:', Object.keys(this.localConfig).length);
      
      // Verificar si faltan configuraciones importantes
      const requiredForPB = ['POCKETBASE_URL', 'APP_NAME'];
      const missingConfig = requiredForPB.filter(key => !this.has(key));
      
      if (missingConfig.length > 0) {
        console.warn('⚠️ Configuración faltante:', missingConfig);
        console.log('💡 Usar AppsmithPB.configure() para configurar');
      }
      
      console.groupEnd();
    }
  }
  
  // ================================================================
  // CLASE POCKETBASE MANAGER (SIN CAMBIOS IMPORTANTES)
  // ================================================================
  
  class SecureAppsmithPocketBase {
    constructor(env) {
      this.env = env;
      this.pbClient = null;
      this.isInitialized = false;
      this.authInfo = null;
    }
    
    init() {
      if (this.isInitialized) return this.pbClient;
      
      if (typeof PocketBase === 'undefined') {
        throw new Error('[AppsmithPB] PocketBase library no está cargada.');
      }
      
      const pbUrl = this.env.get('POCKETBASE_URL');
      if (!pbUrl) {
        throw new Error('[AppsmithPB] POCKETBASE_URL no configurado. Usar AppsmithPB.configure() primero.');
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
        return `${urlObj.protocol}//${urlObj.hostname}:${urlObj.port || 'default'}`;
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
    // MÉTODOS DE AUTENTICACIÓN Y CRUD (IGUALES A LA VERSIÓN ANTERIOR)
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
        
        localStorage.setItem('appsmith_pb_auth', JSON.stringify(this.authInfo));
        
        if (typeof storeValue === 'function') {
          storeValue('pb_token', authData.token, true);
          storeValue('pb_user', authData.record, true);
          storeValue('pb_auth_env', this.env.getEnvironment(), true);
        }
        
        this.log('Login exitoso', { userId: authData.record.id });
        this.trackEvent('user_login', { userId: authData.record.id, environment: this.env.getEnvironment() });
        
        return authData;
        
      } catch (error) {
        this.logError('Error en login', error);
        this.reportError('login_failure', error);
        throw error;
      }
    }
    
    async logout() {
      const pb = this.getClient();
      
      try {
        pb.authStore.clear();
        localStorage.removeItem('appsmith_pb_auth');
        
        if (typeof storeValue === 'function') {
          storeValue('pb_token', null, true);
          storeValue('pb_user', null, true);
          storeValue('pb_auth_env', null, true);
        }
        
        this.authInfo = null;
        this.log('Logout exitoso');
        this.trackEvent('user_logout', { environment: this.env.getEnvironment() });
        
        return true;
        
      } catch (error) {
        this.logError('Error en logout', error);
        throw error;
      }
    }
    
    async validateSession() {
      const pb = this.getClient();
      
      try {
        const storedAuth = localStorage.getItem('appsmith_pb_auth');
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
            
            localStorage.setItem('appsmith_pb_auth', JSON.stringify(this.authInfo));
            
            if (typeof storeValue === 'function') {
              storeValue('pb_token', this.authInfo.token, true);
              storeValue('pb_user', this.authInfo.user, true);
            }
            
            this.log('Token refrescado exitosamente');
            return true;
            
          } catch (refreshError) {
            this.logError('Error al refrescar token', refreshError);
            await this.logout();
            return false;
          }
        }
        
        pb.authStore.save(this.authInfo.token, this.authInfo.user);
        
        if (typeof storeValue === 'function') {
          storeValue('pb_token', this.authInfo.token, true);
          storeValue('pb_user', this.authInfo.user, true);
        }
        
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
    // OPERACIONES CRUD (IGUALES)
    // ================================================================
    
    async create(collection, data) {
      const pb = this.getClient();
      
      try {
        this.log(`Creando registro en ${collection}`, data);
        const record = await pb.collection(collection).create(data);
        this.log(`Registro creado en ${collection}`, { id: record.id });
        this.trackEvent('record_created', { collection, recordId: record.id });
        return record;
      } catch (error) {
        this.logError(`Error creando en ${collection}`, error);
        this.reportError('create_failure', error, { collection });
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
        
        this.trackEvent('records_read', {
          collection,
          count: records.items.length,
          page,
          totalPages: records.totalPages
        });
        
        return records;
        
      } catch (error) {
        this.logError(`Error leyendo ${collection}`, error);
        this.reportError('read_failure', error, { collection });
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
        this.trackEvent('record_updated', { collection, recordId: id });
        return record;
      } catch (error) {
        this.logError(`Error actualizando ${collection}/${id}`, error);
        this.reportError('update_failure', error, { collection, recordId: id });
        throw error;
      }
    }
    
    async delete(collection, id) {
      const pb = this.getClient();
      
      try {
        this.log(`Eliminando ${collection}/${id}`);
        await pb.collection(collection).delete(id);
        this.log(`Registro eliminado: ${collection}/${id}`);
        this.trackEvent('record_deleted', { collection, recordId: id });
        return true;
      } catch (error) {
        this.logError(`Error eliminando ${collection}/${id}`, error);
        this.reportError('delete_failure', error, { collection, recordId: id });
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
          analyticsEnabled: this.env.get('ENABLE_ANALYTICS'),
          devToolsVisible: this.env.get('SHOW_DEV_TOOLS')
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
    
    trackEvent(event, data = {}) {
      if (!this.env.get('ENABLE_ANALYTICS')) return;
      
      const eventData = {
        ...data,
        environment: this.env.getEnvironment(),
        timestamp: Date.now(),
        version: VERSION
      };
      
      if (typeof gtag !== 'undefined') {
        gtag('event', event, eventData);
      }
      
      this.log(`📊 Event: ${event}`, eventData);
    }
    
    reportError(type, error, context = {}) {
      if (!this.env.get('ENABLE_ERROR_REPORTING') || this.env.isDevelopment()) return;
      
      const errorData = {
        type,
        message: error.message,
        stack: error.stack,
        context,
        environment: this.env.getEnvironment(),
        timestamp: Date.now(),
        version: VERSION,
        userAgent: navigator.userAgent
      };
      
      if (typeof Sentry !== 'undefined') {
        Sentry.captureException(error, { tags: { type }, extra: context });
      }
      
      this.logError(`📤 Error reportado: ${type}`, errorData);
    }
  }
  
  // ================================================================
  // INICIALIZACIÓN Y EXPORTACIÓN
  // ================================================================
  
  const Environment = new SecureAppsmithEnvironment();
  const PocketBaseManager = new SecureAppsmithPocketBase(Environment);
  
  // ================================================================
  // FUNCIONES GLOBALES DE CONVENIENCIA
  // ================================================================
  
  function env(key, defaultValue) {
    return Environment.get(key, defaultValue);
  }
  
  function isDev() {
    return Environment.isDevelopment();
  }
  
  function isStaging() {
    return Environment.isStaging();
  }
  
  function isProd() {
    return Environment.isProduction();
  }
  
  async function login(email, password) {
    return await PocketBaseManager.login(email, password);
  }
  
  async function logout() {
    return await PocketBaseManager.logout();
  }
  
  async function validateSession() {
    return await PocketBaseManager.validateSession();
  }
  
  function getCurrentUser() {
    return PocketBaseManager.getCurrentUser();
  }
  
  function isAuthenticated() {
    return PocketBaseManager.isAuthenticated();
  }
  
  async function create(collection, data) {
    return await PocketBaseManager.create(collection, data);
  }
  
  async function read(collection, page, perPage, filter, sort) {
    return await PocketBaseManager.read(collection, page, perPage, filter, sort);
  }
  
  async function getById(collection, id, expand) {
    return await PocketBaseManager.getById(collection, id, expand);
  }
  
  async function update(collection, id, data) {
    return await PocketBaseManager.update(collection, id, data);
  }
  
  async function deleteRecord(collection, id) {
    return await PocketBaseManager.delete(collection, id);
  }
  
  async function checkConnection() {
    return await PocketBaseManager.checkConnection();
  }
  
  function getSystemInfo() {
    return PocketBaseManager.getSystemInfo();
  }
  
  function getPocketBaseClient() {
    return PocketBaseManager.getClient();
  }
  
  // ================================================================
  // OBJETO PRINCIPAL DE LA LIBRERÍA
  // ================================================================
  
  const AppsmithPB = {
    version: VERSION,
    
    Environment,
    PocketBaseManager,
    
    // Funciones de entorno
    env,
    isDev,
    isStaging,
    isProd,
    
    // Funciones de autenticación
    login,
    logout,
    validateSession,
    getCurrentUser,
    isAuthenticated,
    
    // Funciones CRUD
    create,
    read,
    getById,
    update,
    delete: deleteRecord,
    
    // Utilidades
    checkConnection,
    getSystemInfo,
    getPocketBaseClient,
    
    // ================================================================
    // CONFIGURACIÓN SEGURA
    // ================================================================
    
    // Configurar URLs sensibles localmente
    configure: function(config) {
      const success = Environment.setLocalConfig(config);
      
      if (success) {
        console.log('✅ [AppsmithPB] Configuración actualizada exitosamente');
        
        // Validar configuración requerida
        try {
          Environment.validateRequiredConfig(['POCKETBASE_URL', 'APP_NAME']);
          console.log('✅ [AppsmithPB] Configuración requerida completa');
        } catch (error) {
          console.warn('⚠️ [AppsmithPB]', error.message);
        }
      } else {
        console.error('❌ [AppsmithPB] Error configurando');
      }
      
      return success;
    },
    
    // Obtener ejemplo de configuración
    getConfigExample: function() {
      return Environment.getExampleConfig();
    },
    
    // Verificar configuración actual
    checkConfig: function() {
      const config = Environment.getAll();
      const example = Environment.getExampleConfig()[Environment.getEnvironment()];
      
      console.group('🔧 Estado de Configuración');
      console.log('Entorno actual:', Environment.getEnvironment());
      console.log('Variables configuradas:', Object.keys(config));
      
      const requiredKeys = Object.keys(example);
      const missingKeys = requiredKeys.filter(key => !Environment.has(key));
      
      if (missingKeys.length > 0) {
        console.warn('⚠️ Variables faltantes:', missingKeys);
        console.log('💡 Configurar con: AppsmithPB.configure({ ... })');
      } else {
        console.log('✅ Configuración completa');
      }
      
      console.groupEnd();
    },
    
    // Configuración manual de entorno
    setEnvironment: function(environment) {
      if (['development', 'staging', 'production'].includes(environment)) {
        localStorage.setItem('APPSMITH_ENV', environment);
        location.reload();
      } else {
        console.error('[AppsmithPB] Entorno inválido. Usar: development, staging, production');
      }
    },
    
    clearEnvironment: function() {
      localStorage.removeItem('APPSMITH_ENV');
      location.reload();
    }
  };
  
  // Hacer funciones disponibles globalmente
  if (typeof window !== 'undefined') {
    window.env = env;
    window.isDev = isDev;
    window.isStaging = isStaging;
    window.isProd = isProd;
    
    window.login = login;
    window.logout = logout;
    window.validateSession = validateSession;
    window.getCurrentUser = getCurrentUser;
    window.isAuthenticated = isAuthenticated;
    
    window.create = create;
    window.read = read;
    window.getById = getById;
    window.update = update;
    window.deleteRecord = deleteRecord;
    
    window.checkConnection = checkConnection;
    window.getSystemInfo = getSystemInfo;
    window.getPocketBaseClient = getPocketBaseClient;
  }
  
  // Log de inicialización
  console.log(`🚀 AppsmithPB v${VERSION} (Secure) inicializado en entorno: ${Environment.getEnvironment()}`);
  
  // Verificar configuración al cargar
  const hasConfig = Environment.has('POCKETBASE_URL');
  if (!hasConfig) {
    console.warn('⚠️ [AppsmithPB] Configuración incompleta. Usar AppsmithPB.configure() para configurar URLs.');
  }
  
  return AppsmithPB;

})));

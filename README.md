# AppsmithPB - PocketBase Library for Appsmith

[![npm version](https://badge.fury.io/js/appsmith-pocketbase.svg)](https://badge.fury.io/js/appsmith-pocketbase)
[![CDN](https://img.shields.io/badge/CDN-jsDelivr-orange)](https://cdn.jsdelivr.net/gh/ingjorivera/as-pb-library-1.0@main/appsmith-pb.js)

Una librería PocketBase optimizada para **Appsmith** con compatibilidad universal (UMD). Funciona en Appsmith, navegadores, Node.js y como módulo npm.

## 🚀 Instalación

### Opción 1: CDN en Appsmith (Recomendado)

```javascript
// En Appsmith Settings → Libraries → URL:
https://cdn.jsdelivr.net/gh/ingjorivera/as-pb-library-1.0@main/appsmith-pb.js
```

### Opción 2: npm

```bash
npm install appsmith-pocketbase
```

```javascript
// CommonJS
const AppsmithPB = require('appsmith-pocketbase');

// ES6 Modules
import AppsmithPB from 'appsmith-pocketbase';
```

### Opción 3: Script Tag

```html
<script src="https://cdn.jsdelivr.net/gh/ingjorivera/as-pb-library-1.0@main/appsmith-pb.js"></script>
<script>
  // AppsmithPB está disponible globalmente
  console.log(AppsmithPB.version);
</script>
```

### Opción 4: Descargar y Pegar

1. Descarga el archivo desde GitHub
2. Copia el contenido
3. Pega en Appsmith Settings → Libraries → Code

## ⚙️ Configuración Rápida

### En Appsmith

```javascript
// 1. Configurar la librería (requerido)
AppsmithPB.configure({
  POCKETBASE_URL: 'https://tu-pocketbase.fly.dev',
  APP_NAME: 'Mi App Appsmith',
  environment: 'development'  // 'development' | 'staging' | 'production'
});

// 2. Verificar configuración
AppsmithPB.checkConfig();
```

### Configuración Completa

```javascript
AppsmithPB.configure({
  // URLs (requerido)
  POCKETBASE_URL: 'https://tu-pocketbase.fly.dev',
  APP_NAME: 'Mi Aplicación',
  API_BASE_URL: 'https://tu-api.com/api',
  
  // Entorno
  environment: 'development', // 'development' | 'staging' | 'production'
  
  // Funcionalidades
  ENABLE_DEBUG: true,
  ENABLE_ANALYTICS: false,
  SHOW_PERFORMANCE_METRICS: true,
  
  // Paginación
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // Autenticación
  JWT_EXPIRY_HOURS: 24,
  REFRESH_TOKEN_EXPIRY_DAYS: 7,
  SESSION_TIMEOUT_MINUTES: 60,
  
  // Base de datos
  DB_TIMEOUT_MS: 10000,
  AUTO_REFRESH_SESSION: true
});
```

## 📖 Uso Básico

### Autenticación

```javascript
// Login
try {
  const authData = await AppsmithPB.login('user@example.com', 'password');
  console.log('Usuario logueado:', authData.record);
  
  // Guardar usuario en Appsmith store
  storeValue('currentUser', authData.record);
} catch (error) {
  console.error('Error de login:', error);
}

// Verificar si está autenticado
if (AppsmithPB.isAuthenticated()) {
  console.log('Usuario actual:', AppsmithPB.getCurrentUser());
}

// Validar sesión (llamar al inicio de la app)
const isValid = await AppsmithPB.validateSession();
if (!isValid) {
  // Redirigir a login
}

// Logout
await AppsmithPB.logout();
```

### Operaciones CRUD

```javascript
// Crear registro
const newPost = await AppsmithPB.create('posts', {
  title: 'Mi primer post',
  content: 'Contenido del post',
  author: AppsmithPB.getCurrentUser().id
});

// Leer registros (con paginación)
const posts = await AppsmithPB.read('posts', 1, 10);
console.log(`${posts.items.length} de ${posts.totalItems} posts`);

// Leer con filtros
const myPosts = await AppsmithPB.read('posts', 1, 10, 
  `author = "${AppsmithPB.getCurrentUser().id}"`,
  '-created'
);

// Obtener por ID
const post = await AppsmithPB.getById('posts', 'post_id');

// Actualizar
const updatedPost = await AppsmithPB.update('posts', 'post_id', {
  title: 'Título actualizado'
});

// Eliminar
await AppsmithPB.delete('posts', 'post_id');
```

### Funciones de Utilidad

```javascript
// Verificar conexión
const isConnected = await AppsmithPB.checkConnection();
if (!isConnected) {
  showAlert('Sin conexión a la base de datos');
}

// Información del sistema
const info = AppsmithPB.getSystemInfo();
console.log('Entorno:', info.environment);
console.log('Versión:', info.version);

// Obtener cliente PocketBase directo
const pb = AppsmithPB.getPocketBaseClient();
// Usar API completa de PocketBase
```

## 🌍 Manejo de Entornos

```javascript
// Verificar entorno actual
console.log('Entorno:', AppsmithPB.getEnvironment());

// Verificadores de entorno
if (AppsmithPB.isDev()) {
  console.log('Modo desarrollo');
}

if (AppsmithPB.isProd()) {
  console.log('Modo producción');
}

// Cambiar entorno manualmente
AppsmithPB.setEnvironment('production');

// Obtener variables de entorno
const pageSize = AppsmithPB.env('DEFAULT_PAGE_SIZE', 20);
const debugMode = AppsmithPB.env('ENABLE_DEBUG', false);
```

## 🔧 Configuración Avanzada

### Configuración por Entorno

```javascript
// Configuración para diferentes entornos
const config = {
  development: {
    POCKETBASE_URL: 'http://localhost:8090',
    ENABLE_DEBUG: true,
    DEFAULT_PAGE_SIZE: 10
  },
  staging: {
    POCKETBASE_URL: 'https://staging-pb.fly.dev',
    ENABLE_DEBUG: true,
    DEFAULT_PAGE_SIZE: 20
  },
  production: {
    POCKETBASE_URL: 'https://prod-pb.fly.dev',
    ENABLE_DEBUG: false,
    DEFAULT_PAGE_SIZE: 50
  }
};

// Configurar basado en entorno actual
AppsmithPB.configure(config[AppsmithPB.getEnvironment()]);
```

### Integración con Appsmith

```javascript
// En el evento onPageLoad de tu app principal:
export default {
  async onPageLoad() {
    // 1. Configurar AppsmithPB
    AppsmithPB.configure({
      POCKETBASE_URL: appsmith.store.POCKETBASE_URL || 'https://default-url.com',
      environment: 'production'
    });
    
    // 2. Validar sesión
    const isValid = await AppsmithPB.validateSession();
    
    if (isValid) {
      // Usuario ya logueado
      const user = AppsmithPB.getCurrentUser();
      storeValue('currentUser', user);
      storeValue('isLoggedIn', true);
      
      // Cargar datos iniciales
      await this.loadUserData();
    } else {
      // Redirigir a login
      storeValue('isLoggedIn', false);
      navigateTo('Login');
    }
  },
  
  async loadUserData() {
    try {
      // Cargar datos del usuario
      const profile = await AppsmithPB.getById('profiles', 
        AppsmithPB.getCurrentUser().id
      );
      storeValue('userProfile', profile);
      
      // Cargar posts recientes
      const posts = await AppsmithPB.read('posts', 1, 10);
      storeValue('recentPosts', posts.items);
      
    } catch (error) {
      console.error('Error cargando datos:', error);
      showAlert('Error cargando datos de usuario');
    }
  }
};
```

### Manejo de Errores

```javascript
// Wrapper con manejo de errores
async function safeQuery(operation) {
  try {
    return await operation();
  } catch (error) {
    console.error('Database error:', error);
    
    // Verificar si es problema de autenticación
    if (error.status === 401) {
      await AppsmithPB.logout();
      navigateTo('Login');
      showAlert('Sesión expirada. Por favor inicia sesión nuevamente.');
      return null;
    }
    
    // Verificar si es problema de conexión
    if (error.status === 0 || !navigator.onLine) {
      showAlert('Sin conexión a internet. Revisa tu conexión.');
      return null;
    }
    
    // Error genérico
    showAlert(`Error: ${error.message}`);
    return null;
  }
}

// Uso del wrapper
const posts = await safeQuery(() => 
  AppsmithPB.read('posts', 1, 10)
);

if (posts) {
  storeValue('posts', posts.items);
}
```

## 🔒 Almacenamiento de Datos

La librería maneja automáticamente el almacenamiento usando:

1. **Appsmith storeValue** (prioridad 1) - cuando está disponible
2. **localStorage** (prioridad 2) - en navegadores normales  
3. **Memoria** (fallback) - cuando las anteriores no están disponibles

```javascript
// Los datos de autenticación se guardan automáticamente
// No necesitas manejar esto manualmente

// Acceder a datos guardados:
const token = appsmith.store.pb_token;
const user = appsmith.store.pb_user;
```

## 🚦 Estados de la Aplicación

```javascript
// Verificar estados importantes
export default {
  // Estado de autenticación
  isUserLoggedIn: () => AppsmithPB.isAuthenticated(),
  
  // Estado de conexión
  isAppOnline: async () => await AppsmithPB.checkConnection(),
  
  // Usuario actual
  getCurrentUserName: () => {
    const user = AppsmithPB.getCurrentUser();
    return user ? user.name || user.email : 'Invitado';
  },
  
  // Información de entorno
  getAppEnvironment: () => ({
    env: AppsmithPB.getEnvironment(),
    version: AppsmithPB.version,
    debug: AppsmithPB.env('ENABLE_DEBUG')
  })
};
```

## 📝 Ejemplos de Widgets

### Login Form

```javascript
// En el botón de Login:
export default {
  async onClick() {
    const email = EmailInput.text;
    const password = PasswordInput.text;
    
    if (!email || !password) {
      showAlert('Por favor completa todos los campos');
      return;
    }
    
    try {
      const authData = await AppsmithPB.login(email, password);
      
      storeValue('currentUser', authData.record);
      storeValue('isLoggedIn', true);
      
      showAlert('Login exitoso', 'success');
      navigateTo('Dashboard');
      
    } catch (error) {
      showAlert(`Error de login: ${error.message}`);
    }
  }
};
```

### Data Table con Paginación

```javascript
// En el widget Table:
export default {
  // Datos de la tabla
  tableData: appsmith.store.tableData || [],
  
  // Cargar datos
  async loadData(page = 1) {
    try {
      const result = await AppsmithPB.read('posts', page, 10);
      
      storeValue('tableData', result.items);
      storeValue('tablePagination', {
        currentPage: result.page,
        totalPages: result.totalPages,
        totalItems: result.totalItems
      });
      
    } catch (error) {
      showAlert(`Error cargando datos: ${error.message}`);
    }
  },
  
  // Evento onPageChange
  async onPageChange() {
    const newPage = Table1.pageNo;
    await this.loadData(newPage);
  }
};
```

## 🔍 Filtros y Búsquedas

```javascript
// Búsqueda con filtros
export default {
  async searchPosts() {
    const searchTerm = SearchInput.text;
    const category = CategorySelect.selectedOptionValue;
    
    let filter = '';
    
    if (searchTerm) {
      filter += `title ~ "${searchTerm}" || content ~ "${searchTerm}"`;
    }
    
    if (category && category !== 'all') {
      filter += filter ? ` && category = "${category}"` : `category = "${category}"`;
    }
    
    try {
      const results = await AppsmithPB.read('posts', 1, 20, filter, '-created');
      storeValue('searchResults', results.items);
      
    } catch (error) {
      showAlert('Error en búsqueda: ' + error.message);
    }
  }
};
```

## 🐛 Debugging

```javascript
// Habilitar debug mode
AppsmithPB.configure({ ENABLE_DEBUG: true });

// Ver información del sistema
console.log(AppsmithPB.getSystemInfo());

// Verificar configuración
AppsmithPB.checkConfig();

// Logs automáticos en consola cuando debug está habilitado:
// 🌍 [AppsmithPB] Configuración actualizada
// 🗄️ [PocketBase] Creando registro en posts
// 📊 [PocketBase] 10 registros de posts (página 1/5)
```

## 📋 Casos de Uso Comunes

### Dashboard con Métricas

```javascript
export default {
  async loadDashboard() {
    try {
      // Cargar métricas en paralelo
      const [posts, users, analytics] = await Promise.all([
        AppsmithPB.read('posts', 1, 5, '', '-created'),
        AppsmithPB.read('users', 1, 10),
        AppsmithPB.read('analytics', 1, 1, '', '-date')
      ]);
      
      storeValue('dashboardData', {
        recentPosts: posts.items,
        totalPosts: posts.totalItems,
        totalUsers: users.totalItems,
        lastAnalytics: analytics.items[0]
      });
      
    } catch (error) {
      showAlert('Error cargando dashboard: ' + error.message);
    }
  }
};
```

### CRUD Completo

```javascript
export default {
  // Crear nuevo post
  async createPost() {
    const title = TitleInput.text;
    const content = ContentInput.text;
    
    try {
      const newPost = await AppsmithPB.create('posts', {
        title,
        content,
        author: AppsmithPB.getCurrentUser().id,
        status: 'draft'
      });
      
      showAlert('Post creado exitosamente', 'success');
      await this.refreshPosts();
      this.clearForm();
      
    } catch (error) {
      showAlert('Error creando post: ' + error.message);
    }
  },
  
  // Actualizar post
  async updatePost(postId) {
    try {
      const updatedPost = await AppsmithPB.update('posts', postId, {
        title: EditTitleInput.text,
        content: EditContentInput.text,
        updated: new Date().toISOString()
      });
      
      showAlert('Post actualizado', 'success');
      await this.refreshPosts();
      
    } catch (error) {
      showAlert('Error actualizando: ' + error.message);
    }
  },
  
  // Eliminar post
  async deletePost(postId) {
    const confirmed = await showModal('ConfirmModal');
    
    if (confirmed) {
      try {
        await AppsmithPB.delete('posts', postId);
        showAlert('Post eliminado', 'success');
        await this.refreshPosts();
        
      } catch (error) {
        showAlert('Error eliminando: ' + error.message);
      }
    }
  },
  
  // Refrescar lista
  async refreshPosts() {
    const posts = await AppsmithPB.read('posts', 1, 20);
    storeValue('posts', posts.items);
  }
};
```

## 🔧 Troubleshooting

### Problemas Comunes

1. **"Library is unsupported"** en Appsmith:
   - Asegúrate de usar la versión UMD
   - Instala vía URL CDN, no por npm en Appsmith

2. **"PocketBase library no está disponible"**:
   - Instala PocketBase primero en Appsmith
   - Verifica que PocketBase esté cargado antes que AppsmithPB

3. **Problemas de autenticación**:
   ```javascript
   // Verificar configuración
   AppsmithPB.checkConfig();
   
   // Limpiar sesión corrupta
   await AppsmithPB.logout();
   ```

4. **Error de conexión**:
   ```javascript
   // Verificar conectividad
   const isConnected = await AppsmithPB.checkConnection();
   console.log('PocketBase conectado:', isConnected);
   ```

## 📚 API Reference

Ver el archivo `appsmith-pb.d.ts` para la referencia completa de TypeScript.

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver archivo LICENSE para detalles.

## 🆘 Soporte

- **Issues**: [GitHub Issues](https://github.com/ingjorivera/as-pb-library-1.0/issues)
- **Documentación**: Este README
- **Ejemplos**: Ver carpeta `/examples` en el repo

---

Hecho con ❤️ para la comunidad de Appsmith

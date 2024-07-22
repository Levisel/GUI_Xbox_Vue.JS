# GUI_XBOX_VUE 🎮

Esta aplicación web desarrollada con Vue.js permite gestionar de manera intuitiva y visual la API REST de Xbox Game Pass. Proporciona funcionalidades para la administración de clientes, planes, suscripciones y pagos, facilitando la interacción con la API a través de una experiencia de usuario amigable.

## Características ✨

- **Gestión de Clientes**: CRUD de clientes suscritos al servicio.
- **Gestión de Planes**: CRUD de planes disponibles en Xbox Game Pass.
- **Gestión de Suscripciones**: CRUD de suscripciones de clientes a los planes de Xbox Game Pass.
- **Gestión de Pagos**: CRUD de pagos realizados por los clientes.
- **Visualización de Datos**: Gráficos y estadísticas basados en los datos obtenidos de la API.
- **Uso de Procedimientos Almacenados**: Interacción con la API mediante procedimientos almacenados para operaciones complejas y generación de reportes.

## Requisitos del Sistema 🖥️

- **Sistema Operativo**: Windows, macOS, Linux
- **Node.js**: 14 o superior
- **NPM**: 6 o superior

## Configuración del Proyecto 🔧

### Requisitos IDE Recomendados

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (y desactivar Vetur).

### Soporte de Tipos para Importaciones `.vue` en TS

TypeScript no puede manejar la información de tipos para las importaciones `.vue` por defecto, por lo que reemplazamos el CLI `tsc` con `vue-tsc` para la verificación de tipos. En los editores, necesitamos [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para que el servicio de lenguaje TypeScript sea consciente de los tipos `.vue`.

### Personalizar configuración

Consulta la [Referencia de Configuración de Vite](https://vitejs.dev/config/).

## Instalación 🔧

1. Clona este repositorio:

2. Instala las dependencias:

    ```sh
    npm install
    ```

### Compilar y Recargar en Caliente para Desarrollo

  ```sh
  npm run dev
  ```

### Estructura del Proyecto 📁

GUI_XBOX_VUE/
│
├── public/                   # Archivos públicos
├── src/                      # Código fuente de la aplicación
│   ├── assets/               # Activos (imágenes, fuentes, etc.)
│   ├── components/           # Componentes de Vue.js
│   ├── views/                # Vistas de la aplicación
│   ├── router/               # Configuración de rutas
│   ├── store/                # Estado de la aplicación (Vuex)
│   ├── App.vue               # Componente raíz
│   └── main.js               # Punto de entrada de la aplicación
│
├── tests/                    # Pruebas unitarias
├── .gitignore                # Archivos y directorios ignorados por Git
├── package.json              # Dependencias y scripts del proyecto
├── README.md                 # Documentación del proyecto
└── vite.config.js            # Configuración de Vite

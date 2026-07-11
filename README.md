# Coordinador-AI

Backend REST para un **Coordinador Operativo de Eventos** potenciado por IA. Expone una API en Node.js/Express que gestiona usuarios, chats/conversaciones, mensajes, eventos y participantes, integrando la API de Anthropic (Claude) como asistente conversacional.

## Estructura del repositorio

```
Coordinador-AI/
├── server/                    # Backend (API REST)
│   ├── server.js               # Servidor Express (rutas, auth, DB, integración con Claude)
│   ├── package.json
│   ├── package-lock.json
│   ├── docker-compose.yml      # Orquestación de MySQL + app en contenedores
│   └── .gitignore
└── cordinadoreventos_ia/      # Reservado para el frontend (actualmente vacío)
```

> **Nota:** la carpeta `cordinadoreventos_ia/` está presente en el repositorio pero aún no contiene código; es el espacio previsto para el cliente/frontend de la aplicación.

## Características

- **Autenticación** de usuarios con JWT y contraseñas hasheadas con `bcrypt`.
- **Gestión de chats**: creación, listado, actualización y borrado (soft delete) de conversaciones por usuario.
- **Mensajería**: histórico de mensajes por chat, reenviado como contexto a la API de Claude en cada turno.
- **Integración con Anthropic (Claude)**: cada mensaje de usuario se envía junto con el historial del chat y un *system prompt* configurable a `https://api.anthropic.com/v1/messages`.
- **Gestión de eventos**: alta/actualización de los detalles de un evento asociado a un chat (tipo, institución, responsable, fechas, presupuesto, modalidad, etc.).
- **Gestión de participantes**: registro y listado de participantes inscritos a un evento/chat.
- **Health check** (`/api/health`) para verificar el estado del servidor, la base de datos y la configuración de la API de Anthropic.
- **Dockerizado**: `docker-compose.yml` con servicios de MySQL 8 y la aplicación.

## Stack técnico

| Componente        | Tecnología                    |
|--------------------|--------------------------------|
| Runtime            | Node.js                        |
| Framework HTTP      | Express 5                      |
| Base de datos       | MySQL (vía `mysql2/promise`)   |
| Autenticación       | JWT (`jsonwebtoken`) + `bcrypt`|
| IA conversacional   | `@anthropic-ai/sdk` / API REST de Anthropic |
| Subida de archivos  | `multer`                       |
| Contenedores        | Docker / Docker Compose        |
| Desarrollo          | `nodemon`                      |

## Requisitos previos

- Node.js 18+ y npm
- MySQL 8.0 (local o vía Docker)
- Una API key válida de Anthropic
- Docker y Docker Compose (opcional, para el flujo containerizado)

## Instalación y configuración

1. Clona el repositorio y entra a la carpeta del backend:

   ```bash
   git clone <url-del-repositorio>
   cd Coordinador-AI/server
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en `server/` con las siguientes variables:

   ```env
   PORT=3001
   JWT_SECRET=tu_secreto_jwt
   ANTHROPIC_API_KEY1=tu_api_key_de_anthropic

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=tu_password
   DB_NAME=coordinador_eventos
   DB_PORT=3306
   ```

   > El servidor valida al arrancar que `JWT_SECRET` y `ANTHROPIC_API_KEY1` estén definidas; si faltan, el proceso termina con un error.

4. Prepara la base de datos MySQL con las tablas requeridas por la aplicación: `usuarios`, `chats`, `mensajes`, `eventos_detalles`, `participantes` y `logs_actividad`. Este repositorio no incluye actualmente un script de migración (`init.sql`); deberás crear el esquema manualmente según los campos utilizados en `server.js` antes de iniciar el servidor con base de datos activa.

5. Levanta el servidor:

   ```bash
   npm start        # producción
   npm run dev       # desarrollo con recarga automática (nodemon)
   ```

   El servidor arrancará en `http://localhost:3001` (o el puerto configurado en `PORT`). Si la conexión a MySQL falla, el servidor sigue ejecutándose en un modo limitado sin persistencia de datos.

## Uso con Docker

El archivo `server/docker-compose.yml` define dos servicios:

- **`mysql`**: instancia de MySQL 8.0, expuesta en el puerto `3307` del host y con un volumen persistente `mysql_data`. Espera montar un script `init.sql` en `server/` para inicializar el esquema.
- **`app`**: construye la imagen de la aplicación (requiere un `Dockerfile` en `server/`, no incluido en este repositorio) y la expone en el puerto `3001`.

Para levantar el stack completo:

```bash
cd server
export JWT_SECRET=tu_secreto_jwt
export ANTHROPIC_API_KEY=tu_api_key_de_anthropic
docker compose up -d
```

> **Importante:** revisa y reemplaza las credenciales de MySQL escritas en `docker-compose.yml` (`MYSQL_ROOT_PASSWORD`, `DB_PASSWORD`) antes de usar este archivo fuera de un entorno local, ya que actualmente contiene una contraseña de ejemplo en texto plano.

## API — Endpoints principales

Todas las rutas (salvo autenticación, health check y raíz) requieren un header `Authorization: Bearer <token>` obtenido en el login/registro.

### Autenticación

| Método | Ruta                    | Descripción                          |
|--------|-------------------------|---------------------------------------|
| POST   | `/api/auth/register`    | Registra un nuevo usuario             |
| POST   | `/api/auth/login`       | Inicia sesión y devuelve un JWT       |

### Chats

| Método | Ruta                | Descripción                                   |
|--------|---------------------|------------------------------------------------|
| GET    | `/api/chats`        | Lista los chats activos del usuario autenticado |
| POST   | `/api/chats`        | Crea un nuevo chat                              |
| GET    | `/api/chats/:id`     | Obtiene un chat con su historial de mensajes    |
| PUT    | `/api/chats/:id`     | Actualiza el título de un chat                  |
| DELETE | `/api/chats/:id`     | Marca un chat como inactivo (soft delete)       |

### Mensajes

| Método | Ruta                          | Descripción                                                       |
|--------|-------------------------------|---------------------------------------------------------------------|
| POST   | `/api/chats/:id/messages`     | Envía un mensaje del usuario, obtiene y guarda la respuesta de la IA |

### Generación de guías

| Método | Ruta                    | Descripción                                                  |
|--------|--------------------------|----------------------------------------------------------------|
| POST   | `/api/generate-guide`   | Genera una guía a partir de un texto base usando la API de Claude |

### Eventos

| Método | Ruta                       | Descripción                                  |
|--------|-----------------------------|-------------------------------------------------|
| GET    | `/api/chats/:id/evento`    | Obtiene los detalles del evento de un chat       |
| POST   | `/api/chats/:id/evento`    | Crea o actualiza los detalles de un evento       |

### Participantes

| Método | Ruta                              | Descripción                              |
|--------|-------------------------------------|---------------------------------------------|
| GET    | `/api/chats/:id/participantes`    | Lista los participantes de un chat/evento  |
| POST   | `/api/chats/:id/participantes`    | Registra un nuevo participante             |

### Utilidad

| Método | Ruta            | Descripción                                            |
|--------|------------------|-----------------------------------------------------------|
| GET    | `/api/health`   | Estado del servidor, la base de datos y la config de IA   |
| GET    | `/`              | Página HTML informativa con el listado de endpoints       |

## Notas de seguridad

- Cambia `JWT_SECRET` y todas las credenciales de base de datos antes de desplegar a un entorno distinto de desarrollo local.
- No subas al repositorio ningún archivo `.env` con claves reales (ya está excluido vía `.gitignore`).
- Revisa y sustituye la contraseña de MySQL incluida como ejemplo en `docker-compose.yml`.
- El *system prompt* enviado a Claude en `server.js` es completamente personalizable: ajústalo según el dominio y el comportamiento que necesites para el asistente de coordinación de eventos.

## Roadmap / pendientes

- Añadir script `init.sql` con el esquema completo de la base de datos.
- Incluir un `Dockerfile` para el servicio `app` referenciado en `docker-compose.yml`.
- Desarrollar el frontend en `cordinadoreventos_ia/`.
- Agregar pruebas automatizadas (actualmente `npm test` no ejecuta ninguna suite).

## Licencia

MIT (según lo declarado en `server/package.json`).

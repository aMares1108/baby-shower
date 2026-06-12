# Baby Shower Invitation (React)

Invitacion web construida en React con arquitectura modular por componentes.

## Estructura

- `src/App.js`: composicion general de la pagina.
- `src/components/`: modulos React reutilizables.
- `src/hooks/useCountdown.js`: logica de cuenta regresiva.
- `src/data/eventConfig.js`: configuracion del evento.
- `src/index.css`: estilo visual principal.

## Comandos

- `npm start`: modo desarrollo en `http://localhost:3000`.
- `npm run build`: build de produccion en `build/`.
- `npm test`: pruebas en modo interactivo.

## Panel de administrador

- Ruta: `/admin`
- Variables de entorno requeridas en la API:
	- `ADMIN_USERNAME`
	- `ADMIN_PASSWORD`
	- `ADMIN_SESSION_SECRET` (opcional, si no se define se reutiliza `ADMIN_PASSWORD` para firmar la sesion)
- La API sigue necesitando `TABLES_CONNECTION_STRING` y opcionalmente `TABLES_TABLE_NAME`.

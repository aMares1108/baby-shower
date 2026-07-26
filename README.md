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
- Autenticacion: Azure Static Web Apps (`/.auth/login/aad`).
- Roles requeridos: `colaborador` para acceder a `/admin` y `/api/listRecords`.
- Cierre de sesion: `/.auth/logout`.
- La API sigue necesitando `TABLES_CONNECTION_STRING` y opcionalmente `TABLES_TABLE_NAME`.

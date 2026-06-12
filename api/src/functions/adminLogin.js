const { app } = require("@azure/functions");
const {
    createSessionToken,
    isAdminConfigured,
    validateCredentials,
} = require("../adminAuth");

app.http("adminLogin", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "auth/login",
    handler: async (request) => {
        if (!isAdminConfigured()) {
            return {
                status: 500,
                jsonBody: {
                    ok: false,
                    error: "Admin credentials are not configured",
                },
            };
        }

        const payload = await request.json().catch(() => ({}));
        const username = payload.username || "";
        const password = payload.password || "";

        if (!validateCredentials(username, password)) {
            return {
                status: 401,
                jsonBody: {
                    ok: false,
                    error: "Usuario o contraseña incorrectos",
                },
            };
        }

        return {
            status: 200,
            jsonBody: {
                ok: true,
                token: createSessionToken(username),
            },
        };
    },
});
const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");
const { getClientPrincipal, hasRole } = require("../adminAuth");

app.http("deleteRecord", {
    methods: ["DELETE"],
    authLevel: "anonymous",
    handler: async (request, context) => {
        try {
            const connectionString = process.env.TABLES_CONNECTION_STRING;
            const tableName = process.env.TABLES_TABLE_NAME || "invites";

            if (!connectionString) {
                return {
                    status: 500,
                    jsonBody: {
                        ok: false,
                        error: "Missing TABLES_CONNECTION_STRING",
                    },
                };
            }

            const authResult = getClientPrincipal(request);

            if (!authResult.ok) {
                return {
                    status: 401,
                    jsonBody: {
                        ok: false,
                        error: "Unauthorized",
                    },
                };
            }

            if (!hasRole(authResult.principal, "colaborador")) {
                return {
                    status: 403,
                    jsonBody: {
                        ok: false,
                        error: "Forbidden",
                    },
                };
            }

            const payload = await request.json().catch(() => ({}));
            const partitionKey = payload.partitionKey || "";
            const rowKey = payload.rowKey || "";

            if (!partitionKey || !rowKey) {
                return {
                    status: 400,
                    jsonBody: {
                        ok: false,
                        error: "partitionKey and rowKey are required",
                    },
                };
            }

            const tableClient = TableClient.fromConnectionString(
                connectionString,
                tableName
            );

            await tableClient.deleteEntity(partitionKey, rowKey);

            return {
                status: 200,
                jsonBody: {
                    ok: true,
                    rowKey,
                },
            };
        } catch (error) {
            context.error("deleteRecord error", error);

            return {
                status: 500,
                jsonBody: {
                    ok: false,
                    error: error?.message || "Failed to delete record",
                },
            };
        }
    },
});
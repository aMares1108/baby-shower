const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

app.http("addRecord", {
    methods: ["POST"],
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

            const payload = await request.json().catch(() => ({}));

            const entity = {
                partitionKey: payload.partitionKey || "guest",
                rowKey: payload.rowKey || `${Date.now()}`,
                name: payload.name || "",
                phone: payload.phone || "",
                guests: payload.guests || "",
                createdAt: new Date().toISOString(),
            };

            const tableClient = TableClient.fromConnectionString(
                connectionString,
                tableName
            );

            await tableClient.createTable();
            await tableClient.createEntity(entity);

            return {
                status: 201,
                jsonBody: {
                    ok: true,
                    table: tableName,
                    entity,
                },
            };
        } catch (error) {
            context.error("addRecord error", error);

            return {
                status: 500,
                jsonBody: {
                    ok: false,
                    error: error?.message || "Failed to add record",
                },
            };
        }
    },
});

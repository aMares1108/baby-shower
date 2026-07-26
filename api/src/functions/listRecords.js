const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");
const {
    getClientPrincipal,
    hasRole,
} = require("../adminAuth");

app.http("listRecords", {
    methods: ["GET"],
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

            context.log("listRecords authorized", {
                userId: authResult.principal?.userId,
                userDetails: authResult.principal?.userDetails,
            });

            const tableClient = TableClient.fromConnectionString(
                connectionString,
                tableName
            );

            const records = [];

            for await (const entity of tableClient.listEntities()) {
                records.push({
                    partitionKey: entity.partitionKey,
                    rowKey: entity.rowKey,
                    name: entity.name || "",
                    phone: entity.phone || "",
                    guests: entity.guests || "",
                    createdAt: entity.createdAt || "",
                });
            }

            records.sort((left, right) => {
                return new Date(right.createdAt || 0) - new Date(left.createdAt || 0);
            });

            return {
                status: 200,
                jsonBody: {
                    ok: true,
                    table: tableName,
                    count: records.length,
                    records,
                },
            };
        } catch (error) {
            context.error("listRecords error", error);

            return {
                status: 500,
                jsonBody: {
                    ok: false,
                    error: error?.message || "Failed to list records",
                },
            };
        }
    },
});
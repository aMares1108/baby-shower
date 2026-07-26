const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

function normalizePhone(value) {
    const digits = String(value || "").replace(/\D/g, "");
    return digits.length > 10 ? digits.slice(-10) : digits;
}

function normalizeGuests(value) {
    const parsedGuests = Number.parseInt(String(value || "").trim(), 10);
    return Number.isFinite(parsedGuests) ? parsedGuests : NaN;
}

app.http("getValidatedDetails", {
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
            const phone = normalizePhone(payload.phone);
            const guests = normalizeGuests(payload.guests);

            if (!phone || phone.length < 10 || !Number.isFinite(guests)) {
                return {
                    status: 400,
                    jsonBody: {
                        ok: false,
                        error: "phone and guests are required",
                    },
                };
            }

            const tableClient = TableClient.fromConnectionString(
                connectionString,
                tableName
            );

            let matchedRecord = null;

            for await (const entity of tableClient.listEntities()) {
                const entityPhone = normalizePhone(entity.phone);
                const entityGuests = normalizeGuests(entity.guests);
                const entityMessage = String(entity.message || "").trim().toLowerCase();

                const samePhone = entityPhone === phone;
                const sameGuests = entityGuests === guests;
                const isValidated = entityMessage === "validated";

                if (!samePhone || !sameGuests || !isValidated) {
                    continue;
                }

                matchedRecord = {
                    name: entity.name || "",
                    guests: entity.guests || "",
                    createdAt: entity.createdAt || "",
                    updatedAt: entity.updatedAt || "",
                };
                break;
            }

            if (!matchedRecord) {
                return {
                    status: 404,
                    jsonBody: {
                        ok: false,
                        error: "No encontramos un registro validado con esos datos. Ponte en contacto con el organizador para validar tu registro.",
                    },
                };
            }

            const secretDetails = {
                addressText: process.env.FINAL_DETAILS_ADDRESS_TEXT || "",
                mapUrl: process.env.FINAL_DETAILS_MAP_URL || "",
            };

            return {
                status: 200,
                jsonBody: {
                    ok: true,
                    record: matchedRecord,
                    secretDetails,
                },
            };
        } catch (error) {
            context.error("getValidatedDetails error", error);

            return {
                status: 500,
                jsonBody: {
                    ok: false,
                    error: error?.message || "Failed to fetch validated details",
                },
            };
        }
    },
});

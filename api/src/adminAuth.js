const crypto = require("crypto");

const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

function getAdminConfig() {
    return {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        secret: process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD,
    };
}

function isAdminConfigured() {
    const { username, password, secret } = getAdminConfig();
    return Boolean(username && password && secret);
}

function createSessionToken(username) {
    const { secret } = getAdminConfig();
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    const payload = `${username}:${expiresAt}`;
    const signature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
    return Buffer.from(`${payload}:${signature}`, "utf8").toString("base64url");
}

function validateCredentials(username, password) {
    const adminConfig = getAdminConfig();
    return username === adminConfig.username && password === adminConfig.password;
}

function verifySessionToken(token) {
    if (!token) {
        return { ok: false, error: "Missing token" };
    }

    const { secret } = getAdminConfig();

    try {
        const decoded = Buffer.from(token, "base64url").toString("utf8");
        const parts = decoded.split(":");

        if (parts.length !== 3) {
            return { ok: false, error: "Invalid token" };
        }

        const [username, expiresAt, signature] = parts;
        const payload = `${username}:${expiresAt}`;
        const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");

        if (signature !== expectedSignature) {
            return { ok: false, error: "Invalid token" };
        }

        if (Number(expiresAt) < Date.now()) {
            return { ok: false, error: "Expired token" };
        }

        return { ok: true, username };
    } catch {
        return { ok: false, error: "Invalid token" };
    }
}

function getBearerToken(request) {
    const authorization = request.headers.get("authorization") || "";

    if (!authorization.startsWith("Bearer ")) {
        return "";
    }

    return authorization.slice("Bearer ".length).trim();
}

module.exports = {
    createSessionToken,
    getBearerToken,
    isAdminConfigured,
    validateCredentials,
    verifySessionToken,
};
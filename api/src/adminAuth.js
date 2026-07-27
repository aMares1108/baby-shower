function getClientPrincipal(request) {
    const encoded = request.headers.get("x-ms-client-principal") || "";

    if (!encoded) {
        return { ok: false, error: "Missing client principal" };
    }

    try {
        const decoded = Buffer.from(encoded, "base64").toString("utf8");
        const principal = JSON.parse(decoded);

        return { ok: true, principal };
    } catch {
        return { ok: false, error: "Invalid client principal" };
    }
}

function hasRole(clientPrincipal, role) {
    const roles = Array.isArray(clientPrincipal?.userRoles)
        ? clientPrincipal.userRoles
        : [];

    return roles.includes(role);
}

module.exports = {
    getClientPrincipal,
    hasRole,
};
export const ROLES = {
    superAdmin: "SuperAdmin",
    admin: "Admin",
    client: "Client",
};

export const STAFF_ROLES = [ROLES.superAdmin, ROLES.admin];

export const ROLE_LABELS = {
    [ROLES.superAdmin]: "SuperAdmin",
    [ROLES.admin]: "Admin",
    [ROLES.client]: "Cliente",
};

export const isStaff = (role) => STAFF_ROLES.includes(role);

export const homePathFor = (role) => (isStaff(role) ? "/admin/peliculas" : "/cartelera");

const INTERNAL_PATH = /^\/(?![/\\])/;
const AUTH_PATHS = ["/login", "/registro"];

const isUnder = (path, section) => path === section || path.startsWith(`${section}/`) || path.startsWith(`${section}?`);

const canVisit = (role, path) => {
    if (AUTH_PATHS.some((authPath) => isUnder(path, authPath))) return false;
    if (isStaff(role)) return isUnder(path, "/admin");
    if (isUnder(path, "/admin")) return false;
    return true;
};

export const pathAfterLogin = (role, from) =>
    typeof from === "string" && INTERNAL_PATH.test(from) && canVisit(role, from) ? from : homePathFor(role);

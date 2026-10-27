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

export const homePathFor = (role) => (isStaff(role) ? "/admin/peliculas" : "/panel/cartelera");

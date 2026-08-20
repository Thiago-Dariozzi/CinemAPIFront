const API_BASE = "http://localhost:5288/api/screen";

export const getAllScreens = async () => {
    const response = await fetch(API_BASE);
    if (!response.ok) throw new Error("Error al obtener las salas")
        return await response.json();

};

export const getScreenById = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`)
if (!response.ok) throw new Error("Error al obtener la Sala");
    return await response.json();
}

export const getActiveScreens = async () =>{
    const response = await fetch(`${API_BASE}/active`);

    if (!response.ok) throw new Error("Error al obtener las salas activas");
        return await response.json();
}

export const addNewScreen = async (screen) =>{
    const response = await fetch(API_BASE, {
        method: "POST",
        headers: {"Content-type": "application/json" },
        body: JSON.stringify(screen),
    }
    );
    if (!response.ok) throw new Error("Error al añadir una sala");
    return await response.json();

};

export const updateScreen = async(id,screen) =>{
    const response = await fetch (`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(screen),

    });
    if (!response.ok) throw new Error("Error al actualizar la sala");
    
};

export const deleteScreen = async (id) => {
    const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar la sala");
};

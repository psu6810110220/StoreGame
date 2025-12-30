const API_URL = "http://localhost:3000";

export const getGames = async (token: string) => {
    const response = await fetch(`${API_URL}/games`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch games");
    return response.json();
};

export const createGame = async (token: string, gameData: any) => {
    const response = await fetch(`${API_URL}/games`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gameData),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(Array.isArray(err.message) ? err.message.join(', ') : err.message || `Failed to create game (${response.status})`);
    }
    return response.json();
};

export const updateGame = async (token: string, id: number, gameData: any) => {
    const response = await fetch(`${API_URL}/games/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gameData),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(Array.isArray(err.message) ? err.message.join(', ') : err.message || `Failed to update game (${response.status})`);
    }
    return response.json();
};

export const deleteGame = async (token: string, id: number) => {
    const response = await fetch(`${API_URL}/games/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to delete game");
    return true;
};

const API_URL = "http://localhost:3000";

export const getAllUsers = async (token: string) => {
    const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
};

export const deleteUser = async (token: string, id: number) => {
    const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return true;
};

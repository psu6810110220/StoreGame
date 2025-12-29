const API_URL = "http://localhost:3000";

export const createBooking = async (token: string, bookingData: any) => {
    const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create booking");
    }
    return response.json();
};

export const getMyBookings = async (token: string) => {
    const response = await fetch(`${API_URL}/bookings/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch bookings");
    return response.json();
};

export const getAllBookings = async (token: string) => {
    const response = await fetch(`${API_URL}/bookings`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch all bookings");
    return response.json();
};

export const updateBookingStatus = async (token: string, bookingId: number, status: string) => {
    const response = await fetch(`${API_URL}/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update booking status");
    return response.json();
};

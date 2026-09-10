// src/services/chatService.js

const request = async (
    url,
    options = {}
) => {
    const response =
        await fetch(
            url,
            {
                ...options,
                headers: {
                    Accept:
                        "application/json",
                    "Content-Type":
                        "application/json",
                    ...(options.headers || {})
                }
            }
        );

    const data =
        await response
            .json()
            .catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Terjadi kesalahan pada server"
        );
    }

    return data;
};

// ======================================================
// CUSTOMER
// ======================================================

export const getCustomerChat = (
    id_user
) => {
    return request(
        `/api/chat/customer/${id_user}`
    );
};

// ======================================================
// PETUGAS - DAFTAR CHAT
// ======================================================

export const getPetugasChats = (
    id_user
) => {
    return request(
        `/api/chat/petugas/${id_user}`
    );
};

// ======================================================
// PETUGAS - DETAIL CHAT
// ======================================================

export const getPetugasChatDetail = (
    id_user,
    id_percakapan
) => {
    return request(
        `/api/chat/petugas/${id_user}/conversation/${id_percakapan}`
    );
};

// ======================================================
// KIRIM PESAN
// ======================================================

export const sendChatMessage = (
    id_user,
    id_percakapan,
    pesan
) => {
    return request(
        "/api/chat/message",
        {
            method: "POST",
            body: JSON.stringify({
                id_user,
                id_percakapan,
                pesan
            })
        }
    );
};

// ======================================================
// MARK READ
// ======================================================

export const markChatAsRead = (
    id_user,
    id_percakapan
) => {
    return request(
        `/api/chat/${id_percakapan}/read`,
        {
            method: "PUT",
            body: JSON.stringify({
                id_user
            })
        }
    );
};
// =====================================================
// API HELPER FRONTEND
// =====================================================

const API_URL = "/api";

// =====================================================
// NORMALISASI ENDPOINT
// =====================================================

const normalizeEndpoint = (endpoint) => {
    if (!endpoint) {
        return "";
    }

    let path = String(endpoint).trim();

    // Hilangkan "/" di awal
    path = path.replace(/^\/+/, "");

    // Jika endpoint sudah menulis "api/",
    // jangan sampai menjadi /api/api/...
    if (path.startsWith("api/")) {
        path = path.substring(4);
    }

    return `/${path}`;
};

// =====================================================
// BUILD URL
// =====================================================

const buildUrl = (endpoint) => {
    const cleanEndpoint =
        normalizeEndpoint(endpoint);

    return `${API_URL}${cleanEndpoint}`;
};

// =====================================================
// HANDLE RESPONSE
// =====================================================

const handleResponse = async (
    response,
    endpoint,
    method
) => {
    let result;

    // Coba baca JSON
    try {
        result = await response.json();
    } catch (error) {
        throw new Error(
            `${method} ${endpoint} mengembalikan response yang tidak valid`
        );
    }

    // HTTP error
    if (!response.ok) {
        throw new Error(
            result?.message ||
            `${method} ${endpoint} gagal`
        );
    }

    return result;
};

// =====================================================
// API
// =====================================================

const api = {

    // =================================================
    // GET
    // =================================================

    async get(endpoint) {
        const url = buildUrl(endpoint);

        console.log(
            `[API GET] ${url}`
        );

        const response = await fetch(
            url,
            {
                method: "GET",

                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

        return handleResponse(
            response,
            endpoint,
            "GET"
        );
    },

    // =================================================
    // POST
    // =================================================

    async post(endpoint, data) {
        const url = buildUrl(endpoint);

        const isFormData =
            data instanceof FormData;

        const options = {
            method: "POST"
        };

        if (isFormData) {

            // Jangan beri Content-Type manual.
            // Browser akan menentukan multipart boundary.
            options.body = data;

        } else {

            options.headers = {
                "Content-Type":
                    "application/json",

                Accept:
                    "application/json"
            };

            options.body =
                JSON.stringify(data);
        }

        console.log(
            `[API POST] ${url}`
        );

        const response = await fetch(
            url,
            options
        );

        return handleResponse(
            response,
            endpoint,
            "POST"
        );
    },

    // =================================================
    // PUT
    // =================================================

    async put(endpoint, data) {
        const url = buildUrl(endpoint);

        const isFormData =
            data instanceof FormData;

        const options = {
            method: "PUT"
        };

        if (isFormData) {

            options.body = data;

        } else {

            options.headers = {
                "Content-Type":
                    "application/json",

                Accept:
                    "application/json"
            };

            options.body =
                JSON.stringify(data);
        }

        console.log(
            `[API PUT] ${url}`
        );

        const response = await fetch(
            url,
            options
        );

        return handleResponse(
            response,
            endpoint,
            "PUT"
        );
    },

    // =================================================
    // DELETE
    // =================================================

    async delete(endpoint) {
        const url = buildUrl(endpoint);

        console.log(
            `[API DELETE] ${url}`
        );

        const response = await fetch(
            url,
            {
                method: "DELETE",

                headers: {
                    Accept:
                        "application/json"
                }
            }
        );

        return handleResponse(
            response,
            endpoint,
            "DELETE"
        );
    }
};

export default api;
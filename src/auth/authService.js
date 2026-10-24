const API_URL =
  "https://react-programs-79sn600m3-neha-6bf0.vercel.app/api/auth";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
    }

    return data;
}
export async function registerUser(name, email, password) {
    return request("/register", {
        method: "POST",
        body: JSON.stringify({
            name,
            email,
            password,
        }),
    });
}
export async function loginUser(email, password) {
    return request("/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });
}
export async function googleLoginUser(credential) {
    return request("/google", {
        method: "POST",
        body: JSON.stringify({
            credential,
        }),
    });
}
export async function logoutUser() {
    return request("/logout", {
        method: "POST",
    });
}
export async function getCurrentUser() {
    try {
        const data = await request("/me", {
            method: "GET",
        });

        return data.user ?? null;
    } catch (error) {
        if (error.name !== "AbortError") {
            console.log("No active login session.");
        }

        return null;
    }
}
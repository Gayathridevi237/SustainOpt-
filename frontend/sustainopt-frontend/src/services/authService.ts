import api from "../api/axiosConfig";


// ============================================================
// LOGIN
// ============================================================

export interface LoginRequest {
    email: string;
    password: string;
}


export interface LoginResponse {
    token: string;
    tokenType: string;
    userId: number;
    fullName: string;
    email: string;
    role: string;
}


// ============================================================
// REGISTRATION
// ============================================================

export interface RegistrationRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationName: string;
    department: string;
    role: string;
}


export interface RegistrationResponse {
    userId: number;
    fullName: string;
    email: string;
    role: string;
}


// ============================================================
// COMMON API RESPONSE
// ============================================================

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}


// ============================================================
// LOGIN API
// ============================================================

export const loginUser = async (
    credentials: LoginRequest
): Promise<LoginResponse> => {

    const response = await api.post<
        ApiResponse<LoginResponse>
    >(
        "/auth/login",
        credentials
    );

    return response.data.data;
};


// ============================================================
// REGISTER API
// ============================================================

export const registerUser = async (
    registrationData: RegistrationRequest
): Promise<RegistrationResponse> => {

    const response = await api.post<
        ApiResponse<RegistrationResponse>
    >(
        "/auth/register",
        registrationData
    );

    return response.data.data;
};


// ============================================================
// LOGOUT
// ============================================================

export const logoutUser = (): void => {

    localStorage.removeItem(
        "sustainopt_token"
    );

    localStorage.removeItem(
        "sustainopt_user"
    );

};


// ============================================================
// TOKEN
// ============================================================

export const getToken = (): string | null => {

    return localStorage.getItem(
        "sustainopt_token"
    );

};


// ============================================================
// STORED USER
// ============================================================

export const getStoredUser =
    (): LoginResponse | null => {

        const user =
            localStorage.getItem(
                "sustainopt_user"
            );

        if (!user) {
            return null;
        }

        try {

            return JSON.parse(user);

        } catch {

            return null;

        }

    };


// ============================================================
// AUTHENTICATION CHECK
// ============================================================

export const isAuthenticated = (): boolean => {

    return Boolean(
        getToken()
    );

};
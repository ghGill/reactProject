import { createContext, useState, useEffect } from "react";
import { AUTH_COOKIE_NAME, deleteCookie, getCookie } from "../utils/cookies";
import { DB } from "../utils/DB";

export const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        isLoggedIn();
    }, [])

    async function isLoggedIn() {
        const userId = getCookie(AUTH_COOKIE_NAME);

        if (userId) {
            const user = await DB.getUser({"id": parseInt(userId)});

            if (user) {
                setUser(user);
            }
        }
    } 

    function logout() {
        setUser(null);
        deleteCookie(AUTH_COOKIE_NAME);
    }

    return (
        <AuthContext.Provider value={{user, setUser, logout}} >
            {children}
        </AuthContext.Provider>
    )
}

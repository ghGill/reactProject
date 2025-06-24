import { createContext, useState, useEffect, useContext } from "react";
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME, deleteCookie } from "../utils/cookies";
import { DB } from "../utils/DB";
import { useDispatch, useSelector } from "react-redux";
import { authSlice } from "../store/authSlice";

export const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const dispatch = useDispatch();
    const stateUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        isLoggedIn();
    }, [])

    async function isLoggedIn() {
        const result = await DB.getUserByToken();

        if (result.success)
            login(result.user);
        else
            login(null);
    }

    function login(data) {
        dispatch(authSlice.actions.login(data));
    }

    function logout() {
        dispatch(authSlice.actions.logout());
        deleteCookie(AUTH_COOKIE_NAME);
        deleteCookie(REFRESH_COOKIE_NAME);
    }

    function isUserLoggedIn() {
        return (stateUser !== null);
    }

    function getUser(prop = null) {
        return prop ? stateUser[prop] : stateUser;
    }

    return (
        <AuthContext.Provider value={{ login, logout, isUserLoggedIn, getUser }} >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => useContext(AuthContext);

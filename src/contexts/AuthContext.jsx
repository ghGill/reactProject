import { createContext, useState, useEffect } from "react";
import { AUTH_COOKIE_NAME, deleteCookie, getCookie } from "../utils/cookies";
import { DB } from "../utils/DB";
import { useDispatch, useSelector } from "react-redux";
import { authSlice } from "../store/authSlice";

export const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
    const dispatch = useDispatch();
    // const userLoggedIn = useSelector((state) => state.auth.user !== null);
    const stateUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        isLoggedIn();
    }, [])

    async function isLoggedIn() {
        const userId = getCookie(AUTH_COOKIE_NAME);

        if (parseInt(userId) > 0) {
            const result = await DB.getUserById(userId);

            if (result) {
                login(result.user);
            }
        }
    } 

    function login(user) {
        dispatch(authSlice.actions.login(user));
    }

    function logout() {
        dispatch(authSlice.actions.logout());
        deleteCookie(AUTH_COOKIE_NAME);
    }

    function isUserLoggedIn() {
        return (stateUser !== null);
    }

    function getUser(prop=null) {
        return prop ? stateUser[prop] : stateUser;
    }

    return (
        <AuthContext.Provider value={{login, logout, isUserLoggedIn, getUser}} >
            {children}
        </AuthContext.Provider>
    )
}

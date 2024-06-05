import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { User } from "../../models/user";

interface AuthProviderProps {
    children: ReactNode;
    PORT: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    curruser: User | null;
    login: (user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false, curruser: null, login: function () { }, logout: function () { } });

export const AuthProvider = ({ children, PORT }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [curruser, setCurruser] = useState<User | null>(null);

    useEffect(() => {
        const checkLoggedIn = async () => {
            await fetch(`${PORT}/api/v1/auth/checkCookie`, {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            }).then(async response => {
                if (response.ok) {
                    const res = await response.json();
                    let curruserID = res.data;
                    setIsLoggedIn(true);
                    Getcurruser(curruserID);
                } else {
                    throw new Error('Failed to fetch');
                }
            }).catch(error => {
                console.error('Error while checking cookies:', error);
            });
        };

        checkLoggedIn();
    }, []);

    const Getcurruser = async (id: string) => {
        await fetch(`${PORT}/api/v1/users/${id}`, {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        }).then(async json => {
            const res = await json.json();
            let curruser: User = res.data as User;
            setCurruser(curruser);
        }).catch(error => {
            console.error('Error taking current user:', error);
        });
    }

    const login = (user: User) => {
        setIsLoggedIn(true);
        setCurruser(user);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setCurruser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, curruser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);
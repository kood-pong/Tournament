import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
    PORT: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false });

export const AuthProvider = ({ children, PORT }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const response = await fetch(`http://localhost:7080/api/v1/auth/checkCookie`, {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            });

            console.log(response)
            if (response.ok) {
                setIsLoggedIn(true);
            }
        };

        checkLoggedIn();
    }, []);

    // TODO add or remove
    // const logout = async () => {
    //     // Implement logout logic if needed
    //     setIsLoggedIn(false);
    // };

    return (
        <AuthContext.Provider value={{ isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);
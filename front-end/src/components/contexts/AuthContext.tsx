import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface AuthProviderProps {
    children: ReactNode;
    PORT: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
}

type User = {
    email: string;
    first_name: string;
    id: string;
    last_name: string;
    losses: number;
    notifications: null | any; // Assuming notifications can be any type or null
    password: string;
    points: number;
    ranking: number;
    role: number;
    status: string;
    username: string;
    wins: number;
}

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false, user: null });

export const AuthProvider = ({ children, PORT }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const checkLoggedIn = async () => {
            await fetch(`http://localhost:7080/api/v1/auth/checkCookie`, {
                method: 'GET',
                credentials: 'include', // Include cookies in the request
            }).then(async json => {
                const res = await json.json();
                let userID = res.data;
                setIsLoggedIn(true);
                GetCurrUser(userID);
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        };

        checkLoggedIn();
    }, []);

    const GetCurrUser = async (id: string) => {
        await fetch(`http://localhost:7080/api/v1/users/${id}`, {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        }).then(async json => {
            const res = await json.json();
            let user: User = res.data as User;
            setUser(user);
        }).catch(error => {
            console.error('Error taking current user:', error);
        });
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, user}}>
            {children}
        </AuthContext.Provider>
    );

}

export const useAuth = () => useContext(AuthContext);
export type User = {
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

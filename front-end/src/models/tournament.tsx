import { User } from "./user";

export type Tournament = {
    id: string;
    name: string;
    start_date: Date;
    end_date: Date;
    status: string;
    type: string;
    winner: User;
}

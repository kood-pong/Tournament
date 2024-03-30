import { User } from "./user";

export type Match = {
    current_round: number;
    id: string;
    player_1: string;
    player_2: string;    
    sets_to_win: number;
    status: string;
    tournament_id: string;
}

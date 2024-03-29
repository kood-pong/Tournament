import { Tournament } from "../../models/tournament";
import "./tournamentItem.css";

interface Props {
    tournament: Tournament;
}

const TournamentItem = ({ tournament }: Props) => {

    return (
        <a href={`/tournament/${tournament.id}`} className='tournament-item'>
            <div className='calendar-date text'>{new Date(tournament.start_date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })}</div>
            <div className='title-1 br'>{tournament.name}</div>
            <div className='text'>Winner - {tournament.winner.first_name} {tournament.winner.last_name}</div>
        </a>
    );
}

export default TournamentItem;
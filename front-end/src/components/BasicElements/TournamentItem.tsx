import "./tournamentItem.css";

const TournamentItem = () => {
    const id = 0;

    return (
        <a  href={`/tournament/${id}`} className='tournament-item'>
            <div className='calendar-date text'>date</div>
            <div className='title-1'>name</div>
            <div className='text'>winner</div>
        </a>
    );
}

export default TournamentItem;
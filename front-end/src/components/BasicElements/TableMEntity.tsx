import './table.css';

type Props = {
    match: any;
}

const TableEntity = ({match}: Props) => {
    return(
        // TODO putthe right id
        <a href={`/tournament/0/match/${match.id}/sets`} className="table-entity" key={match.id}>
            <div className="text col">{match.id}</div>
            <div className="text col tryper">{match.participant1}</div>
            <div className="text col tryper">{match.participant2}</div>
            <div className="text col">{match.completed ? 'Yes' : 'No'}</div>
        </a>
    );
}

export default TableEntity;
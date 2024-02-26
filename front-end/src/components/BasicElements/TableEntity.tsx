import './table.css';

const TableEntity = () => {
    return(
        <div className="table-entity">
            <div className="col">Num</div>
            <div className="col tryper">Participant name</div>
            <div className="col">Wins</div>
            <div className="col">Loses</div>
            <div className="col">Points</div>
            <div className="col">Ranking</div>
            <div className="col"></div>
        </div>
    );
}

export default TableEntity;
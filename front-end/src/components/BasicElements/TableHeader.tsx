import SearchIcon from '../assets/SearchIcon';
import './table.css';

const TableHeader = () => {
    return (
        <div className="table-header">
            <div className="col">Num</div>
            <div className="col tryper">Participant name</div>
            <div className="col">Wins</div>
            <div className="col">Loses</div>
            <div className="col">Points</div>
            <div className="col">Ranking</div>
            <div className="col"><SearchIcon /></div>
        </div>
    );
}

export default TableHeader;
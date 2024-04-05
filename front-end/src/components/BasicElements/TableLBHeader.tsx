import SearchIcon from '../assets/SearchIcon';
import './table.css';

const TableHeader = () => {
    return (
        <div className="table-header">
            <div className="text light-t col">Num</div>
            <div className="text light-t col tryper">Participant name</div>
            <div className="text light-t col add">Wins</div>
            <div className="text light-t col add">Loses</div>
            <div className="text light-t col add">Points</div>
            <div className="text light-t col">Ranking</div>
            <div className="text light-t col add"><SearchIcon /></div>
        </div>
    );
}

export default TableHeader;
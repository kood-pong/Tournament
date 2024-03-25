import SearchIcon from '../assets/SearchIcon';
import './table.css';

const TableHeader = () => {
    return (
        <div className="table-header">
            <div className="text col">Num</div>
            <div className="text col tryper">Participant name</div>
            <div className="text col add">Wins</div>
            <div className="text col add">Loses</div>
            <div className="text col add">Points</div>
            <div className="text col">Ranking</div>
            <div className="text col add"><SearchIcon /></div>
        </div>
    );
}

export default TableHeader;
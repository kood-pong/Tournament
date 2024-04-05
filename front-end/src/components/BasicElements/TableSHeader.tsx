import './table.css';

const TableHeader = () => {
    return (
        <div className="table-header">
            <div className="text light-t col">Num</div>
            <div className="text light-t col tryper">Participant name</div>
            <div className="text light-t col">Points</div>
        </div>
    );
}

export default TableHeader;
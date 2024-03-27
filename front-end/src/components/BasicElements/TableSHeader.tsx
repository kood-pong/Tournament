import './table.css';

const TableHeader = () => {
    return (
        <div className="table-header">
            <div className="text col">Num</div>
            <div className="text col tryper">Participant name</div>
            <div className="text col">Points</div>
        </div>
    );
}

export default TableHeader;
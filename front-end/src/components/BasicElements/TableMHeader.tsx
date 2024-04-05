import './table.css';

const TableHeader = () => {
    return (
        <div className="table-header">
            <div className="text light-t col">Num</div>
            <div className="text light-t col tryper">Participant name</div>
            <div className="text light-t col tryper">Participant 2 name</div>
            <div className="text light-t col">Completed</div>
        </div>
    );
}

export default TableHeader;
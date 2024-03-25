import './table.css';

const TableHeader = () => {
    return (
        <div className="table-header">
            <div className="text col">Num</div>
            <div className="text col tryper">Participant name</div>
            <div className="text col tryper">Participant 2 name</div>
            <div className="text col">Completed</div>
        </div>
    );
}

export default TableHeader;
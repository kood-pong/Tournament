import './table.css';

const TableHeader = () => {
    return (
        <div className="table-header request-entity r-h">
            <div className='tbr-line'>
                <div className="text light-t col tryper">Full name</div>
                <div className="text light-t col tryper">Email</div>
            </div>
            <div className='tbr-line'>
                <div className="text light-t col tryper">Discord username</div>
                <div className="text light-t col tryper">Reject / Approve</div>
            </div>
        </div>
    );
}

export default TableHeader;
import './table.css';

const TableHeader = () => {
    return (
        <div className="table-header request-entity r-h">
            <div className='tbr-line'>
                <div className="text col tryper">Full name</div>
                <div className="text col tryper">Email</div>
            </div>
            <div className='tbr-line'>
                <div className="text col tryper">Discord username</div>
                <div className="text col tryper">Reject / Approve</div>
            </div>
        </div>
    );
}

export default TableHeader;
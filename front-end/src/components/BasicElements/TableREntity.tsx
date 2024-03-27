import './table.css';

type Props = {
    request: any;
}

const TableEntity = ({ request }: Props) => {

    const handleRejection = () => {
        console.log('reject', request.id)
    }

    const handleApprovement = () => {
        console.log('approve', request.id)
    }

    return (
        <div className="table-entity request-entity" key={request.id}>
            <div className='tbr-line'>
                <div className="text col tryper">{request.fullname}</div>
                <div className="text col tryper">{request.email}</div>
            </div>
            <div className='tbr-line'>
                <div className="text col tryper">{request.discord}</div>
                <div className="text col tbr-btns">
                    <button onClick={() => handleRejection()} className='btn-1'>Reject</button>
                    <button onClick={() => handleApprovement()} className='btn-1'>Approve</button>
                </div>
            </div>
        </div>
    );
}

export default TableEntity;
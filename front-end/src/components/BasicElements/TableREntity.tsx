import { useState } from 'react';
import { User } from '../../models/user';
import './table.css';

type Props = {
    PORT: string;
    request: User;
}

const TableEntity = ({ PORT, request }: Props) => {
    
    const handleRejection = () => {
        changeUserSatus('rejected');
    }

    const handleApprovement = () => {
        changeUserSatus('approved');
    }

    const changeUserSatus = async (status: string) => {
        fetch(`${PORT}/api/v1/jwt/admin/users/complete`, {
            method: "PUT",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: request.id, status }),
        }).then(async response => {
            const res = await response.json();
            console.log(res)
            if (response.ok) {
                // 
            } else {
                console.error(res.error);
            }
        })
    } 

    return (
        <div className="table-entity request-entity" key={request.id}>
            <div className='tbr-line'>
                <div className="text col tryper">{request.first_name} {request.last_name}</div>
                <div className="text col tryper">{request.email}</div>
            </div>
            <div className='tbr-line'>
                <div className="text col tryper">{request.username}</div>
                <div className="text col tbr-btns">
                    <button onClick={() => handleRejection()} className='btn-1'>Reject</button>
                    <button onClick={() => handleApprovement()} className='btn-1'>Approve</button>
                </div>
            </div>
        </div>
    );
}

export default TableEntity;
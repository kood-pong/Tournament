import { useEffect, useState } from "react";
import Header from "./BasicElements/Header";
import TableEntity from "./BasicElements/TableREntity";
import TableHeader from "./BasicElements/TableRHeader";
import { User } from "../models/user";
import Footer from "./BasicElements/Footer";

interface Props {
    PORT: string;
}

const Requests = ({ PORT }: Props) => {
    const status = 'pending';
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const GetPendingUsers = async () => {
            await fetch(`${PORT}/api/v1/users/all/${status}`, {
                method: 'GET',
                credentials: 'include',
            }).then(async response => {
                const res = await response.json();
                if (response.ok) {
                    if (res.data != null) {
                        setUsers(res.data);
                    }
                } else {
                    throw new Error(res.error);
                }
            })
        }

        GetPendingUsers()
    }, [])

    const handleUserActionComplete = (index: number) => {
        setUsers((currentUsers) => currentUsers.filter((_, i) => i !== index));
    };

    return (
        <div className="page-container">
            <Header PORT={PORT} />
            <div className="content-wrap">
                <div className="top-line big-title">
                    Requests
                </div>
                <TableHeader />
                <div style={{ height: '15px' }}></div>
                {users.map((user, index) => (
                    <TableEntity key={index} PORT={PORT} request={user} onActionComplete={() => handleUserActionComplete(index)}/>
                ))}

                {users.length === 0 ? (
                    <div className="text">No requests yet</div>
                ) : null}
            </div>
            <div className="main-footer">
                <Footer />
            </div>
        </div>
    )
}

export default Requests;
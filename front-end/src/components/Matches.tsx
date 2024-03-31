import { useNavigate, useParams } from "react-router-dom";
import Header from "./BasicElements/Header";
import TableEntity from "./BasicElements/TableMEntity";
import TableHeader from "./BasicElements/TableMHeader";
import './tournament-admin.css';
import { useEffect, useState } from "react";
import { Match } from "../models/match";

interface Props {
    PORT: string;
}

const Matches = ({ PORT }: Props) => {
    const navigate = useNavigate();
    const { id, stw } = useParams();
    console.log(id, stw)
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        const takeMatches = async () => {
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/generate`, {
                method: 'POST',
                credentials: 'include',
                headers: { "Content-Type": "appliction/json" },
                body: JSON.stringify({ tournament_id: id, sets_to_win: typeof stw === 'string' ? parseInt(stw) : 0 }),
            }).then(async response => {
                const res = await response.json()
                if (response.ok) {
                    console.log(res.data)
                    setMatches(res.data);
                } else {
                    console.error(res.error)
                }
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        }

        takeMatches();
        
    }, [])

    return (
        <div className="page-container">
            <Header PORT={PORT}/>
            <div className="content-wrap">
                <div className="top-line big-title">
                    Matches
                </div>
                <TableHeader />
                <div style={{ height: '15px' }}></div>
                {matches.map((match, index) => (
                    <TableEntity PORT={PORT} match={match} tableId={index + 1} />
                ))}
                <button onClick={() => {navigate(`/tournament/${id}/set-up`)}} className="btn-1" style={{ marginTop: '50px' }}>Generate new</button>
            </div>
        </div>
    )
}

export default Matches;
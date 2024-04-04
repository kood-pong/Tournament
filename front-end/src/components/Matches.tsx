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
    const { tid } = useParams();
    const [matches, setMatches] = useState<Match[] | null>([]);

    useEffect(() => {
        const takeSets = async () => {
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/match/ongoing/${tid}`, {
                method: 'GET',
                credentials: 'include',
            }).then(async response => {
                const res = await response.json()
                if (response.ok) {
                    if (res.data === null) {
                        navigate(`/tournament/${tid}/set-up`)
                    }
                    setMatches(res.data);
                } else {
                    if (res.error === 'tournament is finished') {
                        navigate(`/tournament/${tid}`);
                    } else {
                    }
                }
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        }

        takeSets();
    }, [])

    return (
        <div className="page-container">
            <Header PORT={PORT} />
            <div className="content-wrap">
                <div className="top-line big-title">
                    Matches
                </div>
                <TableHeader />
                <div style={{ height: '15px' }}></div>
                {matches?.map((match, index) => (
                    <TableEntity key={index} PORT={PORT} match={match} tableId={index + 1} />
                ))}
                {/* TODO define when prev match is done */}
                {/* <button onClick={() => {navigate(`/tournament/${tid}/set-up`)}} className="btn-1" style={{ marginTop: '50px' }}>Generate new</button> */}
            </div>
        </div>
    )
}

export default Matches;
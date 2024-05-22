import { useEffect, useState } from 'react';
import './table.css';
import { User } from '../../models/user';
import { Match } from '../../models/match';

type Props = {
    PORT: string;
    match: Match;
    tableId: number;
}

const TableEntity = ({PORT, match, tableId }: Props) => {
    const [player1, setPlayer1] = useState<User>();
    const [player2, setPlayer2] = useState<User>();

    useEffect(() => {
        const takePlayer1 = async () => {
            await fetch(`${PORT}/api/v1/users/${match.player_1}`, {
                method: 'GET',
                credentials: 'include'
            }).then(async response => {
                const res = await response.json()
                if (response.ok) {
                    setPlayer1(res.data)
                } else {
                    console.error(res.error)
                }
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        }

        takePlayer1();
        
    }, [])

    useEffect(() => {
        const takePlayer2 = async () => {
            await fetch(`${PORT}/api/v1/users/${match.player_2}`, {
                method: 'GET',
                credentials: 'include'
            }).then(async response => {
                const res = await response.json()
                if (response.ok) {
                    setPlayer2(res.data)
                } else {
                    console.error(res.error)
                }
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        }

        takePlayer2();
        
    }, [])

    return (
        <a href={`/tournament/${match.tournament_id}/match/${match.id}/sets`} className="table-entity" key={match.id}>
            <div className="text col">{tableId}</div>
            <div className="text col tryper">{player1?.first_name} {player1?.last_name}</div>
            <div className="text col tryper">{player2?.first_name} {player2?.last_name}</div>
            <div className="text col">{match.status === 'completed1' ? 'Yes' : 'No'}</div>
        </a>
    );
}

export default TableEntity;
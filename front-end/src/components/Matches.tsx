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

    const [isRoundOver, setIsRoundOver] = useState(false);

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

    useEffect(() => {
        if (matches != null) {
            let buff = true
            matches.forEach((item) => {
                if (item.status != 'completed1') {
                    buff = false
                    return
                }
            })
            setIsRoundOver(buff)
        }
    },[matches])

    const toogleMatchOver = () => {
        setIsRoundOver(prev => !prev)
    }

    const handleMatchOver = async () => {
        console.log('Round over')

        await fetch(`${PORT}/api/v1/jwt/admin/tournaments/calculate/${tid}`, {
            method: 'GET',
            credentials: 'include'
        }).then(async response => {
            const res = await response.json()
            console.log('Round over')
            console.log('res', res)
            if (response.ok) {
                if (res.data === true ){
                    navigate(`/tournament/${tid}`)
                }
            } else {
                console.error(res.error)
            }
        }).catch(error => {
            console.error('Error checking login status:', error);
        });

        navigate(`/tournament/${tid}/set-up`)
    }

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
            {isRoundOver ? (
                <div className="back-rect">
                    <div className="popup">
                        <h1 className="title-1">Round Over</h1>
                        <span>Winner: { } Congratulations!</span>
                        <div className="popup-btns">
                            <button className="btn-1"
                                onClick={handleMatchOver}>
                                Continue
                            </button>
                            <button className="btn-2"
                                onClick={toogleMatchOver}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default Matches;
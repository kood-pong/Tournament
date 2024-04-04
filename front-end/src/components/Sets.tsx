import Header from "./BasicElements/Header";
import TableMainHeader from "./BasicElements/TableSMHeader";
import TableHeader from "./BasicElements/TableSHeader";
import TableEntity from "./BasicElements/TableSEntity";
import './sets.css';
import { useEffect, useState } from "react";
import { Match } from "../models/match";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../models/user";

interface Props {
    PORT: string;
}

const Sets = ({ PORT }: Props) => {
    const {tid, id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState<Match | null>();
    const [error, setError] = useState<{ isError: boolean, text: string }>({ isError: false, text: "" });

    const [pl1Points, setPl1Points] = useState<number>(0);
    const [pl2Points, setPl2Points] = useState<number>(0);

    const [player1, setPlayer1] = useState<User>();
    const [player2, setPlayer2] = useState<User>();

    const [setNum, setSetNum] = useState<number>(1);

    useEffect(() => {
        const getMatch = async () => {
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/match/${id}`, {
                method: 'GET',
                credentials: 'include',
            }).then(async response => {
                const res = await response.json();
                console.log(res)
                if (response.ok) {
                    setMatch(res.data);
                } else {
                    throw new Error(res.error);
                }
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        };
        getMatch();
    }, [])


    useEffect(() => {
        if (match?.player_1) {
            const takePlayer1 = async () => {
                await fetch(`${PORT}/api/v1/users/${match?.player_1}`, {
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
        }
    }, [match])

    useEffect(() => {
        if (match?.player_2) {
            const takePlayer2 = async () => {
                await fetch(`${PORT}/api/v1/users/${match?.player_2}`, {
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
        }
    }, [match])

    const updatePl1Points = (plPoints: number) => {
        setPl1Points(plPoints);
    };

    const updatePl2Points = (plPoints: number) => {
        setPl2Points(plPoints);
    };

    // TODO take match and update it after entering data

    const handleSubmit = async () => {
        setError(
            {
                isError: false,
                text: ""
            }
        )

        console.log(pl1Points, pl2Points)

        if (pl1Points !== 11 && pl2Points !== 11) {
            setError(
                {
                    isError: true,
                    text: "Not enought points to finish the set"
                }
            )
            return
        }

        await fetch(`${PORT}/api/v1/jwt/admin/tournaments/set/create`, {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": "appliction/json" },
            body: JSON.stringify({ set_number: setNum, match_id: match?.id, player_1_score: pl1Points, player_2_score: pl2Points}),
        }).then(async response => {
            const res = await response.json()
            if (response.ok) {
                navigate(`/tournament/${tid}/matches/${match?.sets_to_win}`);
            } else {
                setSetNum(prev => prev + 1);
                console.error(res.error)
            }
        }).catch(error => {
            console.error('Error checking login status:', error);
        });
    }

    return (
        <div className="page-container">
            <Header PORT={PORT} />
            <div className="content-wrap">
                <div className="top-line big-title">
                    Match
                </div>
                <TableMainHeader player1Name={`${player1?.first_name} ${player1?.last_name}`} player2Name={`${player2?.first_name} ${player2?.last_name}`} />
                <div className="set-cont">
                    <div className="title-1 set-h">Set {setNum}</div>
                    <TableHeader />
                    <TableEntity id={1} participantName={`${player1?.first_name} ${player1?.last_name}`} updatePlPoints={updatePl1Points} />
                    <TableEntity id={2} participantName={`${player2?.first_name} ${player2?.last_name}`} updatePlPoints={updatePl2Points} />
                    <div className="text red">{error.text}</div>
                </div>
                <button onClick={handleSubmit} className="btn-1" style={{ marginTop: '50px' }}>Done</button>
            </div>
        </div>
    )
}

export default Sets;
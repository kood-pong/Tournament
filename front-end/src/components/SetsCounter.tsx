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

const SetsCounter = ({ PORT }: Props) => {
    const { tid, id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState<Match | null>();
    const [error, setError] = useState<{ isError: boolean, text: string }>({ isError: false, text: "" });

    const [pl1Points, setPl1Points] = useState<number>(0);
    const [pl2Points, setPl2Points] = useState<number>(0);

    const [pl1WonSets, setPl1WonSets] = useState<number>(0);
    const [pl2WonSets, setPl2WonSets] = useState<number>(0);

    const [player1, setPlayer1] = useState<User>();
    const [player2, setPlayer2] = useState<User>();

    const [type, setType] = useState<number>(2);

    const [sets, setSets] = useState<number[][]>([]);

    const [serve, setServe] = useState(true);

    const [isMatchOver, setMatchOver] = useState(false);
    const [isEditMode, setEditMode] = useState(false);

    useEffect(() => {
        const getMatch = async () => {
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/match/${id}`, {
                method: 'GET',
                credentials: 'include',
            }).then(async response => {
                const res = await response.json();
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

        // TODO should be called somewhere else
        handleSetCreation();
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

    useEffect(() => {
        if ((pl1Points + pl2Points) % 2 === 0) {
            setServe(prev => !prev)
        }

        if (pl1Points === 11) {
            handlePl1PointsChange()
        } else if (pl2Points === 11) {
            handlePl2PointsChange()
        }

        if (pl1WonSets === type || pl2WonSets === type) {
            setMatchOver(true)
        }


        if (pl1Points === 11 || pl2Points === 11) {
            cleanPoints()
        }
    }, [pl1Points, pl2Points])

    const handlePl1PointsChange = () => {
        setPl1WonSets(prev => prev + 1)
    }

    const handlePl2PointsChange = () => {
        setPl2WonSets(prev => prev + 1)
    }

    const handleSetCreation = () => {
        let currSet = pl1WonSets + pl2WonSets
        console.log(currSet)
    }

    const cleanPoints = () => {
        setSets(prev => [...prev, [pl1Points, pl2Points]]);
        setPl1Points(0)
        setPl2Points(0)
    }

    const toogleMatchOver = () => {
        setMatchOver(prev => !prev)
    }

    const handleMatchOver = () => {
        console.log('Match over')
    }

    const toogleEditMode = () => {
        setEditMode(prev => !prev)
    }

    return (
        <div className="page-container">
            <Header PORT={PORT} />
            <div className="content-wrap">
                <div className="sets-h">
                    <button className="btn-back">
                        back
                    </button>
                    <TableMainHeader player1Name={`${player1?.first_name} ${player1?.last_name}`} player2Name={`${player2?.first_name} ${player2?.last_name}`} />
                </div>
                <div className="counters-cont">
                    <div className="board">
                        <div className="sets-count-cont count-cont big-title">
                            {pl1WonSets}
                        </div>
                        <button className="points-count-cont count-cont big-title"
                            style={{ border: `${serve ? '5px solid var(--color-3)' : ''}` }}
                            onClick={() => setPl1Points(prev => prev + 1)}>
                            {pl1Points}
                        </button>
                        <button className="points-count-cont count-cont big-title"
                            style={{ border: `${!serve ? '5px solid var(--color-3)' : ''}` }}
                            onClick={() => setPl2Points(prev => prev + 1)}>
                            {pl2Points}
                        </button>
                        <div className="sets-count-cont count-cont big-title">
                            {pl2WonSets}
                        </div>
                    </div>
                    <div
                        className="prev-sets-cont"
                        style={{ gridTemplateColumns: `repeat(${sets.length < 3 ? 3 : sets.length}, 1fr)` }}>
                        {sets.map((item, index) => (
                            <div key={index} className="prev-set-cont">
                                Set {index + 1}:
                                <span>{item[0]}</span> - <span>{item[1]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="edit-cont">
                        {isEditMode ? (
                            <div className="edit-panel">
                                edit panel
                            </div>
                        ) : null}
                        <button className="edit-btn"
                            onClick={toogleEditMode}>
                            edit
                        </button>
                    </div>
                </div>
            </div>
            {isMatchOver ? (
                <div className="back-rect">
                    <div className="popup">
                        <h1 className="title-1">Match Over</h1>
                        <span>Winner: { } Congratulations!</span>
                        <div className="popup-btns">
                            <button className="btn-1"
                                onClick={handleMatchOver}>
                                Back to all matches
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

export default SetsCounter;
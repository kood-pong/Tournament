import Header from "./BasicElements/Header";
import TableMainHeader from "./BasicElements/TableSMHeader";
import TableHeader from "./BasicElements/TableSHeader";
import TableEntity from "./BasicElements/TableSEntity";
import './sets.css';
import { useEffect, useState } from "react";
import { Match } from "../models/match";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../models/user";
import BackIcon from "./assets/Back";
import EditIcon from "./assets/Edit";
import TickIcon from "./assets/Tick";

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
        if (match != null && match?.player_2 && match?.player_1) {
            takePlayer2();
            takePlayer1();
            getMatch();
        }
    }, [match])

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

    const getMatch = async () => {
        await fetch(`${PORT}/api/v1/jwt/admin/tournaments/match/sets/${id}`, {
            method: 'GET',
            credentials: 'include'
        }).then(async response => {
            const res = await response.json();
            console.log(res)
            // if (response.ok) {
            //     navigate('/');
            // } else {
            //     setError({
            //         isError: true,
            //         text: res.error
            //     });
            // }
        }).catch(error => {
            console.log(error)
            setError({
                isError: true,
                text: 'Error'
            });
        });
    }

    useEffect(() => {
        if ((pl1Points + pl2Points) % 2 === 0) {
            setServe(prev => !prev)
        }

        if (pl1Points === 11) {
            setPl1WonSets(prev => prev + 1)
        } else if (pl2Points === 11) {
            setPl2WonSets(prev => prev + 1)
        }

        if (pl1WonSets === type || pl2WonSets === type) {
            setMatchOver(true)
        }


        if (pl1Points === 11 || pl2Points === 11) {
            cleanPoints()
            handleSetCreation();
        }
    }, [pl1Points, pl2Points])

    const handlePl1PointsChange = (num: number) => {
        setPl1Points(num)
        handleChangePoints()
    }

    const handlePl2PointsChange = (num: number) => {
        setPl2Points(num)
        handleChangePoints()
    }

    const cleanPoints = () => {
        setSets(prev => [...prev, [pl1Points, pl2Points]]);
        setPl1Points(0)
        setPl2Points(0)
    }

    const handleSetCreation = async () => {
        let currSet = pl1WonSets + pl2WonSets + 1

        await fetch(`${PORT}/api/v1/jwt/admin/tournaments/set/create`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "appliction/json" },
            body: JSON.stringify({
                set_number: currSet,
                match_id: id,
                player_1_score: pl1Points,
                player_2_score: pl2Points,
            }),
        }).then(async response => {
            const res = await response.json();
            console.log(res)
            if (response.ok) {
                // navigate('/');
            } else {
                setError({
                    isError: true,
                    text: res.error
                });
            }
        }).catch(error => {
            console.log(error)
            setError({
                isError: true,
                text: 'Error'
            });
        });
    }

    const handleChangePoints = async () => {
        let currSet = pl1WonSets + pl2WonSets + 1

        await fetch(`${PORT}/api/v1/jwt/admin/tournaments/set/update`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "appliction/json" },
            body: JSON.stringify({
                id: "608389bb-e4ea-4af1-add6-619195adc71c",
                set_number: currSet,
                match_id: id,
                player_1_score: pl1Points,
                player_2_score: pl2Points,
            }),
        }).then(async response => {
            const res = await response.json();
            console.log(res)
            if (response.ok) {
                // navigate('/');
            } else {
                setError({
                    isError: true,
                    text: res.error
                });
            }
        }).catch(error => {
            console.log(error)
            setError({
                isError: true,
                text: 'Error'
            });
        });
    }

    const handleSetsEdit = (newValue: number, index: number, index2: number) => {
        setSets(prevSets => {
            // Map over the outer array
            return prevSets.map((set, idx) => {
                if (idx === index) {
                    // Copy the current sub-array to avoid mutating the original state
                    const updatedSet = [...set];
                    // Update the specific element in the sub-array
                    updatedSet[index2] = newValue;
                    // Return the modified sub-array
                    return updatedSet;
                }
                // Return other sub-arrays unchanged
                return set;
            });
        });
    };

    const handleServeChanges = () => {
        //
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
                        <BackIcon />
                    </button>
                    <TableMainHeader player1Name={`${player1?.first_name} ${player1?.last_name}`} player2Name={`${player2?.first_name} ${player2?.last_name}`} />
                </div>
                <div className="counters-cont">
                    <div className="board">
                        <div className="sets-count-cont count-cont big-title">
                            {pl1WonSets}
                        </div>
                        {isEditMode ? (
                            <div
                                className="points-count-cont count-cont big-title"
                                style={{ border: `${serve ? '5px solid var(--color-3)' : ''}` }}>
                                <input
                                    type="number"
                                    value={pl1Points}
                                    className="points-count-input count-cont big-title"
                                    onChange={(e) => handlePl1PointsChange(parseInt(e.target.value, 10))} />
                            </div>
                        ) : (
                            <button className="points-count-cont count-cont big-title"
                                style={{ border: `${serve ? '5px solid var(--color-3)' : ''}` }}
                                onClick={() => handlePl1PointsChange(pl1Points+1)}>
                                {pl1Points}
                            </button>
                        )}
                        {isEditMode ? (
                            <div
                                className="points-count-cont count-cont big-title"
                                style={{ border: `${!serve ? '5px solid var(--color-3)' : ''}` }}>
                                <input
                                    type="number"
                                    value={pl2Points}
                                    className="points-count-input count-cont big-title"
                                    onChange={(e) => handlePl2PointsChange(parseInt(e.target.value, 10))} />
                            </div>
                        ) : (
                            <button className="points-count-cont count-cont big-title"
                                style={{ border: `${!serve ? '5px solid var(--color-3)' : ''}` }}
                                onClick={() => handlePl2PointsChange(pl2Points+1)}>
                                {pl2Points}
                            </button>
                        )}
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
                                {isEditMode ? (

                                    <input
                                        type="number"
                                        value={item[0]}
                                        className="sets-input text"
                                        onChange={(e) => handleSetsEdit(parseInt(e.target.value, 10), index, 0)} />
                                ) : (
                                    <span>{item[0]}</span>
                                )} -
                                {isEditMode ? (
                                    <input
                                        type="number"
                                        value={item[1]}
                                        className="sets-input text"
                                        onChange={(e) => handleSetsEdit(parseInt(e.target.value, 10), index, 1)} />
                                ) : (
                                    <span>{item[1]}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="edit-cont">
                        {isEditMode ? (
                            <div className="edit-panel text">
                                <label htmlFor="select-input">Serve:</label>
                                <select className="text" id="select-input" value={serve ? `true` : `false`} onChange={(event) => setServe(event.target.value == 'true' ? true : false)}>
                                    <option value="true">{player1?.first_name} {player1?.last_name}</option>
                                    <option value="false">{player2?.first_name} {player2?.last_name}</option>
                                </select>
                            </div>
                        ) : null}
                        <button className="edit-btn"
                            onClick={toogleEditMode}>
                            {isEditMode ? (
                                <TickIcon />
                            ) : (
                                <EditIcon />
                            )}
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
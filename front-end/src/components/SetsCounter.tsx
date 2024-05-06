import Header from "./BasicElements/Header";
import TableMainHeader from "./BasicElements/TableSMHeader";
import TableHeader from "./BasicElements/TableSHeader";
import TableEntity from "./BasicElements/TableSEntity";
import './sets.css';
import { useEffect, useState } from "react";
import { Match } from "../models/match";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../models/user";

// interface Props {
//     PORT: string;
// }

const SetsCounter = (/*{ PORT }: Props*/) => {
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

    const [sets, setSets] = useState<number[][]>([]);

    const [serve, setServe] = useState(true);

    useEffect(() => {
        if ((pl1Points + pl2Points) % 2 === 0) {
            setServe(prev => !prev)
        }

        if (pl1Points === 11) {
            setPl1WonSets(prev => prev + 1)
            cleanPoints()
        } else if (pl2Points === 11) {
            setPl2WonSets(prev => prev + 1)
            cleanPoints()
        }
    }, [pl1Points, pl2Points])

    const cleanPoints = () => {
        setSets(prev => [...prev, [pl1Points, pl2Points]]);
        setPl1Points(0)
        setPl2Points(0)
    }


    return (
        <div className="page-container">
            {/* <Header PORT={PORT} /> */}
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
                            <div className="prev-set-cont">
                                Set {index+1}:
                                <span>{item[0]}</span> - <span>{item[1]}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button className="edit-btn">
                            edit
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SetsCounter;
import Header from "./BasicElements/Header";
import TableMainHeader from "./BasicElements/TableSMHeader";
import TableHeader from "./BasicElements/TableSHeader";
import TableEntity from "./BasicElements/TableSEntity";
import './sets.css';
import { useState } from "react";

const Sets = () => {
    const match = {
        id: 1,
        participant1: 'SpinMaster83',
        participant2: 'PaddlePro',
        completed: false,
    }

    const [pl1PointsList, setPl1PointsList] = useState<number>(0);
    const [pl2PointsList, setPl2PointsList] = useState<number>(0);

    const updatePl1Points = (plPoints: number) => {
        setPl1PointsList(plPoints);
    };

    const updatePl2Points = (plPoints: number) => {
        setPl2PointsList(plPoints);
    };

    // TODO take match and update it after entering data

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <div className="top-line big-title">
                    Match {match?.id}
                </div>
                <TableMainHeader match={match} />
                <div className="set-cont">
                    <div className="title-1 set-h">Set 1</div>
                    <TableHeader />
                    <TableEntity id={1} participantName={match.participant1} updatePlPoints={updatePl1Points} />
                    <TableEntity id={2} participantName={match.participant2} updatePlPoints={updatePl2Points} />
                </div>
                <button className="btn-1" style={{ marginTop: '50px' }}>Done</button>
            </div>
        </div>
    )
}

export default Sets;
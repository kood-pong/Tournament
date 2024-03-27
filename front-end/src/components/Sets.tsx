import Header from "./BasicElements/Header";
import TableMainHeader from "./BasicElements/TableSMHeader";
import TableHeader from "./BasicElements/TableSHeader";
import TableEntity from "./BasicElements/TableSEntity";
import './sets.css';

const Sets = () => {
    const match = {
        id: 1,
        participant1: 'SpinMaster83',
        participant2: 'PaddlePro',
        completed: false,
    }

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
                    <div className="title-1">Set 1</div>
                    <TableHeader />
                    <TableEntity id={1} participantName={match.participant1} />
                    <TableEntity id={2} participantName={match.participant2} />
                </div>
                <button className="btn-1" style={{ marginTop: '50px' }}>Done</button>
            </div>
        </div>
    )
}

export default Sets;
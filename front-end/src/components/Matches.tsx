import Header from "./BasicElements/Header";
import TableEntity from "./BasicElements/TableMEntity";
import TableHeader from "./BasicElements/TableMHeader";
import './tournament-admin.css';

interface Props {
    PORT: string;
}

const Matches = ({ PORT }: Props) => {
    const matches = [{
        id: 1,
        participant1: 'SpinMaster83',
        participant2: 'PaddlePro',
        completed: false,
    },{
        id: 2,
        participant1: 'SmashNinja',
        participant2: 'TableTornado',
        completed: false,
    },{
        id: 3,
        participant1: 'PingPongWizard',
        participant2: 'AceAttacker',
        completed: false,
    },{
        id: 4,
        participant1: 'RapidReflexes',
        participant2: 'TopSpinTerminator',
        completed: false,
    },{
        id: 5,
        participant1: 'BackhandBandit',
        participant2: 'ServeSlayer',
        completed: false,
    },{
        id: 6,
        participant1: 'NetNinja',
        participant2: 'PowerPaddle',
        completed: false,
    },{
        id: 7,
        participant1: 'SpinSavant',
        participant2: 'SwiftSwinger',
        completed: false,
    }];

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <div className="top-line big-title">
                    Matches
                </div>
                <TableHeader />
                <div style={{ height: '15px' }}></div>
                {matches.map((match, index) => (
                    <TableEntity match={match} />
                ))}
                <button className="btn-1" style={{marginTop: '50px'}}>Generate new</button>
            </div>
        </div>
    )
}

export default Matches;
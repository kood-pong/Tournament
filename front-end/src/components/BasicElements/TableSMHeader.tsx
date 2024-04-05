import { Match } from '../../models/match';
import './table.css';

type Props = {
    player1Name: string;
    player2Name: string;
}

const TableMainHeader = ({player1Name, player2Name}: Props) => {
    return (
        <div className="table-header">
            <div className="text light-t col">{player1Name}</div>
            <div className="text light-t col">-</div>
            <div className="text light-t col">{player2Name}</div>
        </div>
    );
}

export default TableMainHeader;
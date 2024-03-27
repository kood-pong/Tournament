import './table.css';

type Props = {
    match: any;
}

const TableMainHeader = ({match}: Props) => {
    return (
        <div className="table-header">
            <div className="text col">{match.participant1}</div>
            <div className="text col">-</div>
            <div className="text col">{match.participant2}</div>
        </div>
    );
}

export default TableMainHeader;
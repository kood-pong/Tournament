import './table.css';

type Props = {
    id: number;
    participantName: string;
}

const TableEntity = ({id, participantName}: Props) => {
    return(
        // TODO putthe right id
        <div className="table-entity" key={id}>
            <div className="text col">{id}</div>
            <div className="text col tryper">{participantName}</div>
            <div className="text col">enter</div>
        </div>
    );
}

export default TableEntity;
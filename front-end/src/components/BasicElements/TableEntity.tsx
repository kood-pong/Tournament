import './table.css';

type Props = {
    user: any;
}

const TableEntity = ({user}: Props) => {
    return(
        <div className="table-entity" key={user.id}>
            {/* TODO should num be ranking or no? */}
            <div className="col">Num</div> 
            <div className="col tryper">{user.first_name} {user.last_name} ({user.username})</div>
            <div className="col">{user.wins}</div>
            <div className="col">{user.losses}</div>
            <div className="col">{user.points}</div>
            <div className="col">{user.ranking}</div>
            <div className="col"></div>
        </div>
    );
}

export default TableEntity;
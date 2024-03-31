import { User } from '../../models/user';
import './table.css';

type Props = {
    user: User;
    tableID: number;
}

const TableEntity = ({user, tableID}: Props) => {
    return(
        <div className="table-entity" key={user.id}>
            {/* TODO should num be ranking or no? */}
            <div className="text col">{tableID}</div> 
            <div className="text col tryper">{user.first_name} {user.last_name} ({user.username})</div>
            <div className="text col add">{user.wins}</div>
            <div className="text col add">{user.losses}</div>
            <div className="text col add">{user.points}</div>
            <div className="text col">{user.ranking}</div>
            <div className="text col add"></div>
        </div>
    );
}

export default TableEntity;
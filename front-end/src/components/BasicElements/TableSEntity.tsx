import { useState } from 'react';
import './table.css';

type Props = {
    id: number;
    participantName: string;
    updatePlPoints: (plPoints: number) => void;
}

const TableEntity = ({ id, participantName, updatePlPoints }: Props) => {
    const [plPoints, setPlPoints] = useState<number>(0);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value) && value >= 0 && value <= 11) {
            setPlPoints(value);
            updatePlPoints(value); // Update the parent component's state
        }
    };

    return (
        <div className="table-entity" key={id}>
            <div className="text col">{id}</div>
            <div className="text col tryper">{participantName}</div>
            <div className="text col">
                <input type="number" placeholder='0' onChange={handleInputChange}></input>
            </div>
        </div>
    );
}

export default TableEntity;
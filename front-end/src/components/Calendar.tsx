import './basic.css';
import './calendar.css';
import Footer from "./BasicElements/Footer";
import Header from "./BasicElements/Header";
import LeftArrow from './assets/LeftArrow';
import RightArrow from './assets/RightArrow';
import { useEffect, useState } from 'react';
import TournamentItem from './BasicElements/TournamentItem';
import { Tournament } from '../models/tournament';

interface Props {
    PORT: string;
}

const Calendar = ({ PORT }: Props) => {
    const [year, setYear] = useState<number>(2024);
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];


    const handleYearBtns = (toAdd: boolean) => {
        setYear(prevYear => toAdd ? prevYear + 1 : prevYear - 1);
    };

    useEffect(() => {
        GetTournaments();
    }, [year]);

    const GetTournaments = async () => {
        await fetch(`${PORT}/api/v1/tournaments/${year}`, {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        }).then(async response => {
            if (response.ok) {
                const res = await response.json();
                let ts: Tournament[] = res.data as Tournament[];
                setTournaments(ts);
            } else {
                throw new Error('Failed to fetch');
            }
        }).catch(error => {
            console.error('Error take tournaments:', error);
        });
    };

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <div className='calendar-header'>
                    <button onClick={() => handleYearBtns(false)}><LeftArrow /></button>
                    <div className='big-title'>{year}</div>
                    <button onClick={() => handleYearBtns(true)}><RightArrow /></button>
                </div>
                <div className='grid-cont'>
                    {months.map((month, index) => (
                        <div className='calendar-item text' key={index}>
                            {month}
                            {tournaments ? (
                                <>
                                    {tournaments
                                        .filter(tourn => tourn && new Date(tourn.start_date).getMonth() === index)
                                        .map(filteredT => (
                                            <TournamentItem tournament={filteredT} key={filteredT.id} />
                                        ))
                                    }
                                </>
                            ) : null}
                        </div>
                    ))}
                </div>
            </div>
            <div className="main-footer">
                <Footer />
            </div>
        </div>
    )
}

export default Calendar;
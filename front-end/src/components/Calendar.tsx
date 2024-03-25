import './basic.css';
import './calendar.css';
import Footer from "./BasicElements/Footer";
import Header from "./BasicElements/Header";
import LeftArrow from './assets/LeftArrow';
import RightArrow from './assets/RightArrow';
import { useEffect, useState } from 'react';
import TournamentItem from './BasicElements/TournamentItem';

interface Props {
    PORT: string;
}

const Calendar = ({ PORT }: Props) => {
    const [year, setYear] = useState<number>(0);
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const tournamentsList = [];


    useEffect(() => {
        const currDate = new Date();
        const currYear = currDate.getFullYear();
        setYear(currYear);
    }, []);

    // TODO take tournaments for the year
    const GetTournaments = async (id: string) => {
        await fetch(`${PORT}`, {
            method: 'GET',
            credentials: 'include', // Include cookies in the request
        }).then(async response => {
            if (response.ok) {
                // TODO
            } else {
                throw new Error('Failed to fetch');
            }
        }).catch(error => {
            console.error('Error take tournaments:', error);
        });
    }

    const handleYearBtns = (toAdd: boolean) => {
        setYear(prevYear => toAdd ? prevYear + 1 : prevYear - 1);
    }

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
                        <div className='calendar-item text'>
                            {month}
                            <TournamentItem />
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
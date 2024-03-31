import { useNavigate } from "react-router-dom";
import Header from "./BasicElements/Header";
import LeftArrow from "./assets/LeftArrow";
import { useState } from "react";
import './tournament-admin.css';

interface Props {
    PORT: string;
}

const CreateTournament = ({ PORT }: Props) => {
    const navigate = useNavigate();
    const [name, setName] = useState<string>('');
    const [date, setDate] = useState<string>('');
    const [time, setTime] = useState<string>('');
    const [type, setType] = useState<string>('');
    const [error, setError] = useState<{ isError: boolean, text: string }>({ isError: false, text: "" });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const startDate = new Date(`${date}T${time}`);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + 2);
        console.log('Form submitted:', { name, startDate, endDate, time, type });

        await fetch(`${PORT}/api/v1/jwt/admin/tournaments/create`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "appliction/json" },
            body: JSON.stringify({ name, start_date: startDate, end_date: endDate, type, status: 'open' }),
        }).then(async response => {
            const res = await response.json();
            if (response.ok) {
                navigate('/');
            } else {
                setError({
                    isError: true,
                    text: res.error
                });
            }
        }).catch(error => {
            console.log(error)
            setError({
                isError: true,
                text: 'Error'
            });
        });
    };
    return (
        <div className="page-container">
            <Header PORT={PORT}/>
            <div className="content-wrap">
                <div className="top-line big-title">
                    <a href="/"><LeftArrow /></a>
                    Create Tournament
                </div>
                <form className="ct-form-cont" onSubmit={handleSubmit}>
                    <div className='input-field text'>
                        <label htmlFor="name" >Name:</label>
                        <input
                            type="name"
                            id="name"
                            value={name}
                            placeholder="Enter your email"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-field text'>
                        <label htmlFor="date">Date:</label>
                        <input
                            id="date"
                            type='date'
                            value={date}
                            placeholder="Enter your password"
                            onChange={(e) => setDate(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div className='input-field text'>
                        <label htmlFor="time">Time:</label>
                        <input
                            id="time"
                            type='time'
                            value={time}
                            placeholder="Enter your password"
                            onChange={(e) => setTime(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div className='input-field text'>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="" disabled>Type</option>
                            <option value="Elimination">Elimination</option>
                            <option value="Robin round">Robin round</option>
                            <option value="Double elimination">Double elimination</option>
                        </select>
                    </div>
                    <button className='btn-1 submit-btn' type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CreateTournament;
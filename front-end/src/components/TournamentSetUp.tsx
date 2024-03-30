import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftArrow from "./assets/LeftArrow";
import Header from "./BasicElements/Header";
import './tournament-admin.css';

interface Props {
    PORT: string;
}

const TournamentSetUp = ({ PORT }: Props) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [type, setType] = useState<number>(2);
    const [error, setError] = useState<{ isError: boolean, text: string }>({ isError: false, text: "" });
    const [isOngoing, setState] = useState<boolean>(false);

    // check if its ongoing tournament
    useEffect(() => {
        const state = 'ongoing';
        const takeUpTournament = async () => {
            await fetch(`${PORT}/api/v1/tournament/${state}`, {
                method: 'GET',
                credentials: 'include'
            }).then(async response => {
                const res = await response.json()
                if (response.ok) {
                    if (res.data[0].id === id) {
                        setState(true);
                    }
                } else {
                    console.error(res.error)
                }
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        }

        takeUpTournament();
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isOngoing) {
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/start`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "appliction/json" },
                body: JSON.stringify({ tournament_id: id, sets_to_win: type }),
            }).then(async response => {
                const res = await response.json();
                if (response.ok) {
                    navigate(`/tournament/${id}/matches/${type}`);
                } else {
                    setError({
                        isError: true,
                        text: res.error
                    });
                }
            }).catch(error => {
                console.log(error)
            });
        } else {
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/generate`, {
                method: 'POST',
                credentials: 'include',
                headers: { "Content-Type": "appliction/json" },
                body: JSON.stringify({ tournament_id: id, sets_to_win: type }),
            }).then(async response => {
                const res = await response.json()
                if (response.ok) {
                    navigate(`/tournament/${id}/matches/${type}`);
                } else {
                    setError({
                        isError: true,
                        text: res.error
                    });
                }
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <div className="top-line big-title">
                    <a href="/"><LeftArrow /></a>
                    Tournament set up
                </div>
                <form className="ct-form-cont" onSubmit={handleSubmit}>
                    <div className='input-field text'>
                        <select defaultValue={type} onChange={(e) => setType(parseInt(e.target.value))} className={`${error.isError ? 'red-border' : 'black-border'}`}>
                            <option value="" disabled>Sets to win</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </select>
                        <span className='text red'>{error.text}</span>
                    </div>
                    <button className='btn-1 submit-btn' type="submit">Start</button>
                </form>
            </div>
        </div>
    )
}

export default TournamentSetUp;
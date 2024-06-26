import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LeftArrow from "./assets/LeftArrow";
import Header from "./BasicElements/Header";
import './tournament-admin.css';

interface Props {
    PORT: string;
}

const TournamentSetUp = ({ PORT }: Props) => {
    const { tid } = useParams();
    const navigate = useNavigate();
    const [type, setType] = useState<number>(2);
    const [error, setError] = useState<{ isError: boolean, text: string }>({ isError: false, text: "" });
    const [isOngoing, setState] = useState<boolean>(false);

    useEffect(() => {
        const takeUpTournament = async (state: string) => {
            await fetch(`${PORT}/api/v1/tournament/${state}`, {
                method: 'GET',
                credentials: 'include'
            }).then(async response => {
                const res = await response.json()
                console.log(res)
                if (response.ok) {
                    if (res.data != null) {
                        res.data.forEach((item: { id: string | undefined; }) => {
                            if (item.id === tid) {
                                setState(true);
                                return
                            }
                        });
                    } else {
                        navigate(`/tournament/${tid}`);
                    }
                } else {
                    console.error(res.error)
                }
            }).catch(error => {
                console.error('Error checking tournament state:', error);
            });
        }

        takeUpTournament('ongoing');
    }, [])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!isOngoing) {
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/start`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tournament_id: tid, sets_to_win: type }),
            }).then(async response => {
                const res = await response.json();
                if (response.ok) {
                    navigate(`/tournament/${tid}/matches`);
                } else {
                    if (res.error === 'tournament is finished') {
                        navigate(`/tournament/${tid}`);
                    }
                    setError({
                        isError: true,
                        text: res.error
                    });
                }
            }).catch(error => {
                console.log(error)
            });
        } else {
            console.log('generate')
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/generate`, {
                method: 'POST',
                credentials: 'include',
                headers: { "Content-Type": "appliction/json" },
                body: JSON.stringify({ tournament_id: tid, sets_to_win: type }),
            }).then(async response => {
                const res = await response.json()
                console.log(res)
                if (response.ok) {
                    navigate(`/tournament/${tid}/matches`);
                } else {
                    if (res.error === 'tournament is finished') {
                        navigate(`/tournament/${tid}`);
                    }
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
            <Header PORT={PORT} />
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
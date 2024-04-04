import { useEffect, useState, useContext } from "react";
import Header from "./BasicElements/Header";
import Footer from "./BasicElements/Footer";
import './basic.css';
import './main.css';
// import Announcement from "./BasicElements/Announcement";
import Pedestal from "./BasicElements/Pedestal";
import TableHeader from "./BasicElements/TableLBHeader";
import TableEntity from "./BasicElements/TableLBEntity";
import './BasicElements/announcement.css';
import { useAuth } from "./contexts/AuthContext";
import { Tournament } from "../models/tournament";
import { useNavigate } from "react-router-dom";

interface Props {
    PORT: string;
}

const MainPage = ({ PORT }: Props) => {
    const navigate = useNavigate();
    const [leaderboard, getLeaderboard] = useState([]);
    const [upTournament, setUpTournament] = useState<Tournament | null>(null);
    const [ongoingTournament, setOnTournament] = useState<Tournament | null>(null);
    const [registered, setRegistration] = useState<boolean>(false);
    const { isLoggedIn, curruser } = useAuth();

    useEffect(() => {
        const takeParticipants = async () => {
            await fetch(`${PORT}/api/v1/users/all/approved`, {
                method: 'GET',
                credentials: 'include'
            }).then(async data => {
                const json = await data.json()
                // TODO create class for currusers and modify it
                const lb = json.data.sort(function (a: { ranking: number; }, b: { ranking: number; }) {
                    return a.ranking - b.ranking;
                });
                getLeaderboard(lb);
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        }

        takeParticipants();
    }, [])

    useEffect(() => {
        const takeUpTournament = async (state: string) => {
            await fetch(`${PORT}/api/v1/tournament/${state}`, {
                method: 'GET',
                credentials: 'include'
            }).then(async response => {
                if (response.ok) {
                    const res = await response.json()
                    if (state === 'ongoing') {
                        setOnTournament(res.data[0])
                    } else if (state === 'open') {
                        setUpTournament(res.data[0]);
                    }
                    checkRegistration(res.data[0].id);
                } else {
                    console.error('Something wrong with takingupcomming tournament')
                }
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        }

        takeUpTournament('ongoing');
        if (ongoingTournament === null) {
            takeUpTournament('open');
        }
    }, [])

    const checkRegistration = async (id: string) => {
        await fetch(`${PORT}/api/v1/jwt/tournaments/register/check/${id}`, {
            method: 'GET',
            credentials: 'include'
        }).then(async response => {
            if (response.ok) {
                const res = await response.json()
                setRegistration(res.data);
            } else {
                console.error('Something wrong with checking registartion')
            }
        }).catch(error => {
            console.error('Error checking login status:', error);
        });
    }

    const handleUnregisteration = async () => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }
        await fetch(`${PORT}/api/v1/jwt/tournaments/unregister/${upTournament?.id}`, {
            method: 'GET',
            credentials: 'include'
        }).then(async response => {
            if (response.ok) {
                const res = await response.json()
                setRegistration(false);
            } else {
                console.error('Something wrong with checking registartion')
            }
        }).catch(error => {
            console.error('Error unregistration:', error);
        });
    }

    const handleRegisteration = async () => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }
        await fetch(`${PORT}/api/v1/jwt/tournaments/register/${upTournament?.id}`, {
            method: 'GET',
            credentials: 'include'
        }).then(async response => {
            if (response.ok) {
                const res = await response.json()
                setRegistration(true);
            } else {
                console.error('Something wrong with checking registartion')
            }
        }).catch(error => {
            console.error('Error registration:', error);
        });
    }

    return (
        <div className="page-container">
            <Header PORT={PORT} />
            <div className="content-wrap">
                {curruser != null && curruser.role == 1 ? (
                    // TODO check if there is any scheduled tournament otherwise add button start tournament
                    <>
                        {upTournament === null && ongoingTournament === null ? (
                            <a href={`/create-tournament`} className="btn-1 ct-btn">Schedule new tournament</a>
                        ) : ongoingTournament != null ? (
                            <div className="announc-cont">
                                <p className='text'>Ongoing Tournament '{ongoingTournament.name}'</p>

                                {curruser.role == 1 ? (
                                    <div className="btns-cont">
                                        {/* TODO take the right num sets to win */}
                                        <a href={`/tournament/${ongoingTournament.id}/matches`} className='btn-1 variant-2 black'>Continue with the tournament</a>
                                    </div>
                                ) : null}
                            </div>
                        ) : upTournament != null ? (
                            <div className="announc-cont">
                                <p className='text'>Our Upcoming Tournament '{upTournament.name}' on {upTournament.start_date ?
                                    new Date(upTournament.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ' at ' +
                                    new Date(upTournament.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) :
                                    'Unknown date'}!
                                </p>

                                <div className="btns-cont">
                                    {/* TODO handle onClick */}
                                    {/* <button onClick={handleRegisteration} className='btn-1 variant-2 black'>Modify the tournament</button> */}
                                    {registered ? (
                                        <button onClick={handleUnregisteration} className='btn-1 variant-2 black'>Unregister</button>
                                    ) : (
                                        <button onClick={handleRegisteration} className='btn-1 variant-2 black'>Register</button>
                                    )}
                                    {/* TODO add right id */}
                                    <a href={`/tournament/${upTournament.id}/set-up`} className='btn-1 variant-2 black'>Start the tournament</a>
                                </div>
                            </div>
                        ) : null}
                    </>
                ) : upTournament != null ? (
                    <div className="announc-cont">
                        <p className='text'>Register Now for Our Upcoming Tournament'{upTournament.name}' on {upTournament.start_date ?
                            new Date(upTournament.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) + ' at ' +
                            new Date(upTournament.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) :
                            'Unknown date'}!
                        </p>
                        <div className="btns-cont">
                            {registered ? (
                                <button onClick={handleUnregisteration} className='btn-1 variant-2 black'>Unregister</button>
                            ) : (
                                <button onClick={handleRegisteration} className='btn-1 variant-2 black'>Register</button>
                            )}
                        </div>
                    </div>
                ) : null}

                {/* <Announcement text="Register Now for Our Upcoming Tournament!" btnsText={['Register']} /> */}
                {leaderboard.length >= 3 ? <Pedestal winers={leaderboard.slice(0, 3)} name="Leaderboard" /> : null}
                <div className="table-cont">
                    <TableHeader />
                    <div style={{ height: '15px' }}></div>
                    {leaderboard.length >= 4 ? (
                        <>
                            {leaderboard.slice(3).map((curruser, index) => (
                                <div key={curruser["id"]}>
                                    {/* TODO change curruser type */}
                                    <TableEntity key={index} user={curruser} tableID={index + 4} />
                                </div>
                            ))}
                        </>) : null}
                </div>
            </div>
            <div className="main-footer">
                <Footer />
            </div>
        </div>
    )
}

export default MainPage;
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

interface Props {
    PORT: string;
}

const MainPage = ({ PORT }: Props) => {
    const [leaderboard, getLeaderboard] = useState([]);
    const [upTournament, setUpTournament] = useState<Tournament | null>(null);
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
        const state = 'open';
        const takeUpTournament = async () => {
            await fetch(`${PORT}/api/v1/tournament/${state}`, {
                method: 'GET',
                credentials: 'include'
            }).then(async response => {
                if (response.ok) {
                    const res = await response.json()
                    setUpTournament(res.data[0]);
                    checkRegistration(res.data[0].id);
                } else {
                    console.error('Something wrong with takingupcomming tournament')
                }
            }).catch(error => {
                console.error('Error checking login status:', error);
            });
        }

        takeUpTournament();
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
        console.log('unregistrated')
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
        console.log('registrated')
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
            <Header  PORT={PORT}/>
            <div className="content-wrap">
                {curruser != null && curruser.role == 1 ? (
                    // TODO check if there is any scheduled tournament otherwise add button start tournament
                    <>
                        {upTournament == null ? (
                            <a href={`/create-tournament`} className="btn-1 ct-btn">Schedule new tournament</a>
                        ) : (
                            <div className="announc-cont">
                                <p className='text'>Our Upcoming Tournament!</p>
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
                        )}
                    </>
                ) : curruser != null ? (
                    <div className="announc-cont">
                        <p className='text'>Register Now for Our Upcoming Tournament!</p>
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
                            {leaderboard.slice(3).map(curruser => (
                                <div key={curruser["id"]}>
                                    {/* TODO change curruser type */}
                                    <TableEntity user={curruser} />
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
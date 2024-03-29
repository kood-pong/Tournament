import { useParams } from "react-router-dom";
import Footer from "./BasicElements/Footer";
import Header from "./BasicElements/Header";
import { useEffect, useState } from "react";
import { User } from "../models/user";
import './profile.css';
import TournamentItem from "./BasicElements/TournamentItem";
import { Tournament } from "../models/tournament";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

interface Props {
    PORT: string;
}

const Profile = ({ PORT }: Props) => {
    const { isLoggedIn, curruser } = useAuth();
    const { id } = useParams();
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const takeUser = async () => {
            await fetch(`${PORT}/api/v1/users/${id}`, {
                method: 'GET',
                credentials: 'include',
            }).then(async response => {
                if (response.ok) {
                    const res = await response.json();
                    let user: User = res.data as User;
                    setUser(user);
                } else {
                    throw new Error('Failed to fetch');
                }
            }).catch(error => {
                console.error('Error taking current user:', error);
            })
        };
        takeUser();
    }, []);

    useEffect(() => {
        const takeUsersTournaments = async () => {
            await fetch(`${PORT}/api/v1/jwt/tournaments`, {
                method: 'GET',
                credentials: 'include',
            }).then(async response => {
                if (response.ok) {
                    const res = await response.json();
                    let ts: Tournament[] = res.data as Tournament[];
                    setTournaments(ts);
                } else {
                    throw new Error('Failed to fetch');
                }
            }).catch(error => {
                console.error('Error taking current user:', error);
            })
        };
        takeUsersTournaments();
    })

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <div className="grid-profile">
                    <div className="grid-profile-item">
                        <div className="user-holder title-1">
                            <div className='usr-img-holder img-holder profile-img-holder'>
                                {/* TODO check real picture */}
                                <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                            </div>
                            {user?.username}
                        </div>
                        <div className="circle-1">
                            <div className="circle-2">
                                <div className="circle-3">
                                    <div className="title-1">Score:</div>
                                    <div className="big-title">{user?.points}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {curruser?.id === id ? (
                        <div className="grid-profile-item">
                            <div className="title-1 pr-t">Previous tournaments:</div>
                            {tournaments.map((tourn, index) => (
                                <TournamentItem key={index} tournament={tourn} />
                            ))}
                        </div>
                    ) : null}
                </div>
            </div>
            <div className="main-footer">
                <Footer />
            </div>
        </div>
    )
}

export default Profile;
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

interface Props {
    PORT: string;
}

const MainPage = ({ PORT }: Props) => {
    const [leaderboard, getLeaderboard] = useState([]);
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

    const handleRegisteration = () => {
        console.log('registrated')

    }

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                {/* TODO try to use it as a component */}
                {curruser != null && curruser.role == 1 ? (
                    // TODO check if there is any scheduled tournament otherwise add button start tournament
                    <>
                        {curruser != null ? (
                            <a href={`/create-tournament`} className="btn-1 ct-btn">Schedule new tournament</a>
                        ) : (
                            <div className="announc-cont">
                                <p className='text'>Our Upcoming Tournament!</p>
                                <div className="btns-cont">
                                    {/* TODO handle onClick */}
                                    <button onClick={handleRegisteration} className='btn-1 variant-2 black'>Modify the tournament</button>
                                    {/* TODO add right id */}
                                    <a href={`/tournament/0/set-up`} className='btn-1 variant-2 black'>Start the tournament</a>
                                </div>
                            </div>
                        )}
                    </>
                ) : curruser != null ? (
                    <div className="announc-cont">
                        <p className='text'>Register Now for Our Upcoming Tournament!</p>
                        <div className="btns-cont">
                            <button onClick={handleRegisteration} className='btn-1 variant-2 black'>Register</button>
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
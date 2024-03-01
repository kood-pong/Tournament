import { useEffect, useState } from "react";
import Header from "./BasicElements/Header";
import Footer from "./BasicElements/Footer";
import './basic.css';
import './main.css';
import Announcement from "./BasicElements/Announcement";
import Pedestal from "./BasicElements/Pedestal";
import TableHeader from "./BasicElements/TableHeader";
import TableEntity from "./BasicElements/TableEntity";

interface Props {
    PORT: string;
}

const MainPage = ({ PORT }: Props) => {
    const [leaderboard, getLeaderboard] = useState([]);

    useEffect(() => {
        (async () => {
            console.log(PORT)
            try {
                const response = await fetch(`${PORT}/api/v1/users/all/approved`, {
                    method: 'GET',
                    credentials: 'include'
                })
                const json = await response.json()
                // TODO create class for users and modify it
                const lb = json.data.sort(function (a: { ranking: number; }, b: { ranking: number; }) {
                    return a.ranking - b.ranking;
                });
                getLeaderboard(lb);
            } catch (error) {
                console.log('error', error)
            }
        })()
    }, [])

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <Announcement text="Register Now for Our Upcoming Tournament!" btnsText={['Register']} />
                {leaderboard.length >= 3 ? <Pedestal winers={leaderboard.slice(0, 3)} /> : null}
                <div className="table-cont">
                    <TableHeader />
                    <div style={{ height: '15px' }}></div>
                    {leaderboard.length >= 4 ? (
                        <>
                            {leaderboard.slice(3).map(user => (
                                <div key={user["id"]}>
                                    {/* TODO change user type */}
                                    <TableEntity user={user} />
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
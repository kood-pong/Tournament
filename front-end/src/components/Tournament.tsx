import { useEffect, useState } from "react";
import Footer from "./BasicElements/Footer";
import Header from "./BasicElements/Header";
import Pedestal from "./BasicElements/Pedestal";
import TableHeader from "./BasicElements/TableLBHeader";
import TableEntity from "./BasicElements/TableLBEntity";
import './tournament.css';
import { useAuth } from "./contexts/AuthContext";
import DownloadIcon from "./assets/DownloadIcon";

interface Props {
    PORT: string;
}

const Tournament = ({ PORT }: Props) => {
    const [leaderboard, getLeaderboard] = useState([]);
    const { isLoggedIn, user } = useAuth();
    // const pictures: string[] = [];
    const pictures = [
        'https://cavtat-tenis.com/img/gallery-1.jpg',
        'https://cdn.pixabay.com/photo/2020/11/27/18/59/tennis-5782695_1280.jpg',
        'https://vikna.if.ua/assets/gallery/2018/11/23/92626/61873_1_948x558__large.jpeg',
        'https://www.nure.info/uploads/posts/2017-06/1498294724_sportivnyy-klub-sportivnye-sekcii-v-hnure-sekciya-tennis.jpg',
        'https://onedeal.com.ua/wp-content/uploads/2021/02/2-5-3.jpg',
        'https://www.dilovamova.com/images/wpi.images/events/203193d.jpg'
    ];

    // take tournament leaderboard with tournamnet id
    useEffect(() => {
        const takeParticipants = async () => {
            await fetch(`${PORT}/api/v1/users/all/approved`, {
                method: 'GET',
                credentials: 'include'
            }).then(async data => {
                const json = await data.json()
                // TODO create class for users and modify it
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

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                {leaderboard.length >= 3 ? <Pedestal winers={leaderboard.slice(0, 3)} /> : null}
                {pictures.length > 0 ? (
                    <div className="imgs-grid">
                        <div className="main-pict img-holder">
                            <img src={pictures[0]}></img>
                        </div>
                        <div className="other-picts-cont">
                            {pictures.slice(1).map((pictureLink, index) => (
                                <div className="other-pict img-holder">
                                    <img src={pictureLink}></img>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : null}
                {pictures.length == 0 && user != null && user.role == 1 ? (
                    <div className="upload-pict">
                        <DownloadIcon />
                        Select or drag file to upload
                    </div>
                ) : null}
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

export default Tournament;
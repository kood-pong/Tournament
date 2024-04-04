import { useEffect, useState } from "react";
import Footer from "./BasicElements/Footer";
import Header from "./BasicElements/Header";
import Pedestal from "./BasicElements/Pedestal";
import TableHeader from "./BasicElements/TableLBHeader";
import TableEntity from "./BasicElements/TableLBEntity";
import './tournament.css';
import { useAuth } from "./contexts/AuthContext";
import DownloadIcon from "./assets/DownloadIcon";
import { useNavigate, useParams } from "react-router-dom";

interface Props {
    PORT: string;
}

const Tournament = ({ PORT }: Props) => {
    const { id } = useParams();
    const [leaderboard, getLeaderboard] = useState([]);
    const { isLoggedIn, curruser } = useAuth();
    const navigate = useNavigate();
    const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
    const pictures: string[] = [];
    // const pictures = [
    //     'https://cavtat-tenis.com/img/gallery-1.jpg',
    //     'https://cdn.pixabay.com/photo/2020/11/27/18/59/tennis-5782695_1280.jpg',
    //     'https://vikna.if.ua/assets/gallery/2018/11/23/92626/61873_1_948x558__large.jpeg',
    //     'https://www.nure.info/uploads/posts/2017-06/1498294724_sportivnyy-klub-sportivnye-sekcii-v-hnure-sekciya-tennis.jpg',
    //     'https://onedeal.com.ua/wp-content/uploads/2021/02/2-5-3.jpg',
    //     'https://www.dilovamova.com/images/wpi.images/events/203193d.jpg'
    // ];

    useEffect(() => {
        const takeParticipants = async () => {
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/leaderboard/${id}`, {
                method: 'GET',
                credentials: 'include'
            }).then(async response => {
                const res = await response.json()
                console.log(res)
                if (response.ok) {
                    const lb = res.data.sort(function (a: { ranking: number; }, b: { ranking: number; }) {
                        return a.ranking - b.ranking;
                    });
                    getLeaderboard(lb);
                } else {
                    console.log('empty tournament')
                }
            }).catch(error => {
                navigate(`/error/404`); // TODO check if there is any tournament with this id
            });
        }

        takeParticipants();
    }, [])

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    }

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedImages(event.target.files);
        }
    };

    // function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    //     event.preventDefault();
    //     const files = event.dataTransfer.files;
    //     handleImageChange(files);
    // }

    const handleUpload = () => {
        if (selectedImages) {
            const formData = new FormData();
            for (let i = 0; i < selectedImages.length; i++) {
                formData.append('images', selectedImages[i]);
            }

            console.log("formData: ", formData);

            // Send formData to your endpoint using fetch or any other HTTP client library
            fetch(`${PORT}/api/v1/jwt/admin/tournaments/image/upload`, {
                method: 'POST',
                credentials: "include",
                body: formData
            })
                .then(async response => {
                    const res = await response.json();
                    console.log(res)
                })
                .catch(error => {
                    console.error(error)
                });
        }
    };

    return (
        <div className="page-container">
            <Header PORT={PORT} />
            <div className="content-wrap">
                {leaderboard.length >= 3 ? <Pedestal winers={leaderboard.slice(0, 3)} name={"Leaderboard"} /> : null}
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
                ) : pictures.length == 0 && curruser != null && curruser.role == 1 ? (
                    <div className="upload-pict" onDragOver={handleDragOver}>
                        <DownloadIcon />
                        Select or drag file to upload
                        <input
                            type="file"
                            accept="image/jpeg, image/jpg, image/png"
                            multiple
                            onChange={handleImageChange}
                        />
                        <button onClick={handleUpload}>Upload</button>
                    </div>
                    // <label
                    //     htmlFor="fileInput"
                    //     className="upload-pict"
                    //     onDragOver={handleDragOver}
                    //     onDrop={handleDrop}
                    // >
                    //     <DownloadIcon />
                    //     Select or drag file to upload
                    //     <input
                    //         id="fileInput"
                    //         type="file"
                    //         accept="image/jpeg, image/jpg, image/png"
                    //         multiple
                    //         onChange={(e) => handleImageChange(e.target.files)}
                    //     />
                    //     <button onClick={handleUpload}>Upload</button>
                    // </label>
                ) : null}
                <div className="table-cont">
                    <TableHeader />
                    <div style={{ height: '15px' }}></div>
                    {leaderboard.length >= 4 ? (
                        <>
                            {leaderboard.slice(3).map((user, index) => (
                                <div key={user["id"]}>
                                    {/* TODO change curruser type */}
                                    <TableEntity key={user["id"]} user={user} tableID={index + 4} />
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
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
    const [dragActive, setDragActive] = useState(false);
    const [pictures, setPictures] = useState([]);

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

    useEffect(() => {
        const takeImgs = async () => {
            await fetch(`${PORT}/api/v1/jwt/admin/tournaments/images/${id}`, {
                method: 'GET',
                credentials: 'include'
            }).then(async response => {
                const res = await response.json()
                console.log(res)
                if (response.ok) {
                    if (res && res.length > 0) {
                        const imageUrls = res.map((item: { image_url: any; }) => item.image_url);
                        setPictures(imageUrls);
                    } else {
                        console.log("Response is empty or not an array");
                    }
                } else {
                    console.log(res.error)
                }
            }).catch(error => {
                console.error(error)
            });
        }

        takeImgs();
    }, [])

    const handleUpload = () => {
        if (selectedImages) {
            const formData = new FormData();
            for (let i = 0; i < selectedImages.length; i++) {
                formData.append('images', selectedImages[i]);
            }

            console.log("formData: ", formData);

            // Send formData to your endpoint using fetch or any other HTTP client library
            fetch(`${PORT}/api/v1/jwt/admin/tournaments/images/upload/${id}`, {
                method: 'POST',
                credentials: "include",
                body: formData
            })
                .then(async response => {
                    // const res = await response.json();
                    console.log("good")
                })
                .catch(error => {
                    console.error(error)
                });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedImages(e.target.files);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragActive(false);

        const { files } = e.dataTransfer;
        if (files) {
            setSelectedImages(files);
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
                            <img src={`https://kood-pong-media.s3.eu-north-1.amazonaws.com/${pictures[0]}`}></img>
                        </div>
                        <div className="other-picts-cont">
                            {pictures.slice(1).map((pictureLink, index) => (
                                <div className="other-pict img-holder">
                                    <img src={`https://kood-pong-media.s3.eu-north-1.amazonaws.com/${pictureLink}`}></img>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : pictures.length == 0 && curruser != null && curruser.role == 1 ? (
                    <div
                        className={`upload-pict ${dragActive ? "drag-active" : ""}`}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        {selectedImages === null ? (

                            <DownloadIcon />
                        ) : (

                            <div>
                                {selectedImages && Array.from(selectedImages).map((file, index) => (
                                    <div className="attached-img img-holder">
                                        <img className="" key={index} src={URL.createObjectURL(file)} alt={file.name} />
                                    </div>
                                ))}
                            </div>
                        )}
                        Select or drag file to upload
                        <input
                            type="file"
                            accept="image/jpeg, image/jpg, image/png"
                            multiple
                            onChange={handleImageChange}
                        />
                        <button className="btn-1" onClick={handleUpload}>Upload</button>
                    </div>
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
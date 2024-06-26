import { useEffect, useState } from "react";
import './basic.css';
import ModeSwitcher from "./ModeSwitcher";
import HamburgerMenu from "../assets/HamburgerMenu";
import Cross from "../assets/Cross";
import Footer from "./Footer";
import RequestsIcon from "../assets/RequestsIcon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface Props {
    PORT: string;
}

const Header = ({ PORT }: Props) => {
    const status = 'pending';
    const [reqNum, setReqNum] = useState<number>(0);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, curruser } = useAuth();

    useEffect(() => {
        const GetPendingUsers = async () => {
            await fetch(`${PORT}/api/v1/users/all/${status}`, {
                method: 'GET',
                credentials: 'include',
            }).then(async response => {
                const res = await response.json();
                if (response.ok) {
                    if (res.data !== null) {
                        setReqNum(res.data.length);
                    }
                } else {
                    throw new Error(res.error);
                }
            })
        }

        GetPendingUsers()
    }, [])

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <div className="logo title-1" onClick={() => navigate('/')}>
                <span className="bold">kood/</span><span className="light">pong</span>
            </div>
            <div className={`${isOpen ? 'responsive_nav' : ''}`}>
                <div className={`button-right-container ${isOpen ? 'vis' : ''}`}>
                    <button onClick={() => { navigate('/') }} className="btn-2">Leaderboard</button>
                    <button onClick={() => { navigate('/calendar') }} className="btn-2">Calendar</button>
                    <ModeSwitcher />
                    {curruser != null && curruser?.role == 1 ? (
                        <div className="requests-btn" onClick={() => { navigate(`/requests`) }}>
                            <div className="request-icon-cont">
                                <RequestsIcon />
                                {reqNum > 0 ? (
                                    <div className="buble-num">{reqNum}</div>
                                ) : null}
                            </div>
                            Requests
                        </div>
                    ) : null}
                    {isLoggedIn && curruser ? (
                        <div className="profile-btn" onClick={() => { navigate(`/user/${curruser?.id}`) }}>
                            <div className="usr-img img-holder">
                                <img src={`https://api.dicebear.com/8.x/adventurer-neutral/svg?seed=${curruser.id}`} />
                            </div>
                            {curruser?.first_name} {curruser?.last_name}
                        </div>
                    ) : (
                        <div style={{ display: "flex", gap: "20px" }}>
                            <button onClick={() => { navigate('/login') }} className='btn-1 variant-2'>Log In</button>
                            <button onClick={() => { navigate('/signup') }} className='btn-1'>Sign Up</button>
                        </div>
                    )}
                </div>
                <div className={`resp-footer ${isOpen ? 'open-footer' : ''}`}>
                    <Footer />
                </div>
            </div>
            <div style={{ display: isOpen ? 'block' : 'none' }}></div>
            <div className="sm"></div>
            <div className="hamburger-menu">
                <button className="hamburger-menu icon-btn" onClick={toggleMenu}>
                    {isOpen ? <Cross /> : <HamburgerMenu />}
                </button>
            </div>
        </header>
    );
}

export default Header;
import { useState } from "react";
import './basic.css';
import ModeSwitcher from "./ModeSwitcher";
import HamburgerMenu from "../assets/HamburgerMenu";
import Cross from "../assets/Cross";
import Footer from "./Footer";
import RequestsIcon from "../assets/RequestsIcon";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const Header = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn, user } = useAuth();

    useState();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="header">
            <div className="logo title-1">
                <span className="bold">kood/</span><span className="light">pong</span>
            </div>
            <div className={`${isOpen ? 'responsive_nav' : ''}`}>
                <div className={`button-right-container ${isOpen ? 'vis' : ''}`}>
                    <button onClick={() => { navigate('/') }} className="btn-2">Leaderboard</button>
                    <button onClick={() => { navigate('/calendar') }} className="btn-2">Calendar</button>
                    <ModeSwitcher />
                    {user != null && user?.role == 1 ? (
                        <div className="requests-btn" onClick={() => { navigate(`/requests`) }}>
                            <div className="request-icon-cont">
                                <RequestsIcon />
                                <div className="buble-num">1</div>
                            </div>
                            Requests
                        </div>
                    ) : null}
                    {!isLoggedIn ? (
                        <div style={{ display: "flex", gap: "20px" }}>
                            <button onClick={() => { navigate('/login') }} className='btn-1 variant-2'>Log In</button>
                            <button onClick={() => { navigate('/signup') }} className='btn-1'>Sign Up</button>
                        </div>
                    ) : (
                        <div className="profile-btn" onClick={() => { navigate(`/user/${user?.id}`) }}>
                            <div className="usr-img img-holder">
                                <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                            </div>
                            {user?.username}
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
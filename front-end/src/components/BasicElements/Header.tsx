import { useState } from "react";
import './basic.css';
import Button1 from "./Button1";
import Button2 from "./Button2";
import ModeSwitcher from "./ModeSwitcher";
import HamburgerMenu from "../assets/HamburgerMenu";
import Cross from "../assets/Cross";
import Footer from "./Footer";
import RequestsIcon from "../assets/RequestsIcon";


const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                    <Button2 text="Leaderboard" />
                    <Button2 text="Calendar" />
                    <ModeSwitcher />
                    {/* <div style={{display:"flex", gap: "20px"}}>
                        <Button1 text="Log In" variant={2} />
                        <Button1 text="Sign Up" variant={1} />
                    </div> */}
                    <div className="requests-btn">
                        <div className="request-icon-cont">
                            <RequestsIcon />
                            <div className="buble-num">1</div>
                        </div>
                        Requests
                    </div>
                    <div className="profile-btn">
                        <div className="usr-img img-holder">
                            <img src='https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg' />
                        </div>
                        Username
                    </div>
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
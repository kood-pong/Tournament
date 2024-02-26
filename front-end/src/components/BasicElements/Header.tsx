import { useState } from "react";
import './basic.css';
import Button1 from "./Button1";
import Button2 from "./Button2";
import ModeSwitcher from "./ModeSwitcher";

const Header = () => {
    return (
        <div className="header">
            <div className="logo">
                <span className="bold">kood/</span><span className="light">pong</span>
            </div>
            <div className="button-center-container">
                <Button2 text="Leaderboard" />
                <Button2 text="Calendar" />
            </div>
            <div className="button-right-container">
                <ModeSwitcher />
                <Button1 text="Log In" variant={2} />
                <Button1 text="Sign Up" variant={1} />
            </div>
        </div>
    );
}

export default Header;
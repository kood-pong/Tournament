import { useState } from "react";
import Moon from "../assets/Moon";
import Sun from "../assets/Sun";

const ModeSwitcher = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleMode = () => {
        setIsDarkMode(prevMode => !prevMode);
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
    };
    
    return (
        <button className="mode-switcher" onClick={toggleMode}>
            <div className={isDarkMode ? `icon-container` : `sun icon-container`}>
                <Sun />
            </div>
            <div className={isDarkMode ? `moon icon-container` : `icon-container`}>
                <Moon />
            </div>
        </button>
    );
}

export default ModeSwitcher;
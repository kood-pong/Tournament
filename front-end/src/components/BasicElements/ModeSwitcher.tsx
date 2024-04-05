import { useEffect, useState } from "react";
import Moon from "../assets/Moon";
import Sun from "../assets/Sun";

const ModeSwitcher = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        initTheme();
    }, []);
    
    // Function to initialize the theme
    const initTheme = () => {
        // Check if a theme preference is saved in localStorage
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme) {
            // If there is a saved theme, apply it
            document.documentElement.setAttribute('data-theme', savedTheme);
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // If there is no saved theme, you can default to 'light' or 'dark'
            // Or, optionally use a system preference check here
            const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            const defaultTheme = prefersDarkMode ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', defaultTheme);
            setIsDarkMode(defaultTheme === 'dark');
        }
    }
    
    const toggleMode = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            // Set the theme in localStorage
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            // Update the theme attribute on the <html> element
            document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
            return newMode;
        });
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
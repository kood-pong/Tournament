import DisIcon from "../assets/DisIcon";

const Footer = () => {
    return (
        <footer className="footer">
            <p className="text light-t">© 2024 kood/pong. All rights reserved.</p>
            <div className="add"></div><div className="add"></div>
            <a href='' className="dis-cont">
                <p className="text light-t add">Join us in discord</p>
                <DisIcon />
            </a>
        </footer>
    );
}

export default Footer;
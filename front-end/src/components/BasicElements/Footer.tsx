import DisIcon from "../assets/DisIcon";

const Footer = () => {
    return (
        <div className="footer">
            <p>© 2024 kood/pong. All rights reserved.</p>
            <div></div><div></div>
            <a href='' className="dis-cont">
                <p>Join us in discord</p>
                <DisIcon />
            </a>
        </div>
    );
}

export default Footer;
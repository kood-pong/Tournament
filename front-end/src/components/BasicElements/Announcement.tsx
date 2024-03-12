import './announcement.css';

type Props = {
    text: string;
    btnsText: string[];
}

const Announcement = ({ text, btnsText }: Props) => {
    return (
        <div className="announc-cont">
            <p className='text'>{text}</p>
            <div className="btns-cont">
                {btnsText.map((btnText, index) => (
                    <button key={index} className='btn-1 variant-2 black'>{btnText}</button>
                ))}
            </div>
        </div>
    );
}

export default Announcement;
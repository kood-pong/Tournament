import Button1 from './Button1';
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
                    <Button1 key={index} text={btnText} variant={2} textColor='black' />
                ))}
            </div>
        </div>
    );
}

export default Announcement;
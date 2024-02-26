import './basic.css';

type Props = {
    text: string;
}

const Button2 = ({text}: Props) => {
    return (
        <button className="btn-2">
            {text}
        </button>
    );
}

export default Button2;
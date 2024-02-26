import './basic.css';

type Props = {
    text: string;
    variant: number; // default - 1 default-1 - 2
}

const Button1 = ({text, variant}: Props) => {
    return (
        <button className="btn-1">
            {text}
        </button>
    );
}

export default Button1;
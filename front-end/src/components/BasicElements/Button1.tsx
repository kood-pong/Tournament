import './basic.css';

type Props = {
    text: string;
    variant: number;
    textColor?: string;
}

const Button1 = ({text, variant, textColor}: Props) => {
    return (
        <button className={`btn-1 ${variant === 2 ? 'variant-2': ''} ${textColor}`}>
            {text}
        </button>
    );
}

export default Button1;
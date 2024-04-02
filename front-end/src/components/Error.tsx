import { useParams } from "react-router-dom";
import Header from "./BasicElements/Header";
import './error.css';


interface Props {
    PORT: string;
}

const Error = ({ PORT }: Props) => {
    const {status} = useParams();

    return (
        <div className="page-container">
            <Header PORT={PORT}/>
            <div className="content-wrap error">
                <div className="big-title">{status}</div>
                <div className="text">not found</div>
            </div>
        </div>
    )
}

export default Error;
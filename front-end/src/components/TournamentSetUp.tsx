import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeftArrow from "./assets/LeftArrow";
import Header from "./BasicElements/Header";
import './tournament-admin.css';

interface Props {
    PORT: string;
}

const TournamentSetUp = ({ PORT }: Props) => {
    const navigate = useNavigate();
    const [type, setType] = useState<string>('');
    const [type2, setType2] = useState<string>('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted:', { type, type2 });
        // TODO put right id
        navigate('/tournament/0/matches');

        // TODO
        // await fetch(`${PORT}`, {
        //     method: "POST",
        //     credentials: "include",
        //     headers: { "Content-Type": "appliction/json" },
        //     body: JSON.stringify({ name, date, time }),
        // }).then(data => {
        //     navigate('/');
        // }).catch(error => {
        //     console.log(error)
        //     setError({
        //         isError: true,
        //         text: 'Error'
        //     });
        // });
    };
    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <div className="top-line big-title">
                    <a href="/"><LeftArrow /></a>
                    Tournament set up
                </div>
                <form className="ct-form-cont" onSubmit={handleSubmit}>
                    <div className='input-field text'>
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="" disabled selected>Type</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>
                    <div className='input-field text'>
                        <select value={type2} onChange={(e) => setType2(e.target.value)}>
                            <option value="" disabled selected>Type</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>
                    <button className='btn-1 submit-btn' type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default TournamentSetUp;
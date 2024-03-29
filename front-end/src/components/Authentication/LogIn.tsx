import { useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';

interface Props {
    PORT: string;
}

const LogIn = ({ PORT }: Props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<{ isError: boolean, text: string }>({ isError: false, text: "" });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted:', { email, password });

        await fetch(`${PORT}/api/v1/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        }).then( async response => {
            if (response.ok) {
                navigate('/');
            } else {
                const res = await response.json();
                setError({
                    isError: true,
                    text: res.error
                });
            }
        }).catch(error => {
            console.log(error)
            setError({
                isError: true,
                text: 'Error'
            });
        });
    };

    return <div className="content-wrap-auth">
        <div className='form'>
            <div className='intro'>
                <div className="title-1">
                    <span className="bold">kood/</span><span className="light">pong</span>
                </div>
            </div>
            <div className="form-cont">
                <h1 className='title-1'>Log In</h1>
                <form onSubmit={handleSubmit}>
                    <div className='input-field text'>
                        <label htmlFor="email" className={`${error.isError ? 'red' : ''}`} >Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="Enter your email"
                            className={`${error.isError ? 'red-border' : 'black-border'}`}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {/* <span className='text red'>{error.text}</span> */}
                    </div>
                    <div className='input-field text'>
                        <label htmlFor="password" className={`${error.isError ? 'red' : ''}`}>Password:</label>
                        <input
                            id="password"
                            type='password'
                            value={password}
                            placeholder="Enter your password"
                            className={`${error.isError ? 'red-border' : 'black-border'}`}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        ></input>
                        <span className='text red'>{error.text}</span>
                    </div>
                    <button className='btn-1 submit-btn' type="submit">Submit</button>
                </form>
                <div>
                    <span className="text-gray text">Don't have an account? </span>
                    <a className='link text' href="/signup">Sign Up</a>
                </div>
            </div>
        </div>
    </div>
}

export default LogIn
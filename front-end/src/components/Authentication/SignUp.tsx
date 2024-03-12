import { useState } from 'react';
import './auth.css';
import { useNavigate } from 'react-router-dom';

interface Props {
    PORT: string;
}

const SignUp = ({ PORT }: Props) => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [username, setDiscorName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatedPassword, setRepeatedPassword] = useState<string>('');
    const [error, setError] = useState<{ isError: boolean, text: string }>({ isError: false, text: "" });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted:', { email, username, password, 'first_name': firstName, 'last_name': lastName });
        if (password !== repeatedPassword) {
            setError({ isError: true, text: 'Wrong repeated password' })
            return
        }

            await fetch(`${PORT}/api/v1/users/create`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "appliction/json" },
                body: JSON.stringify({ email, password, username }),
            }).then( data => {
                navigate('/');
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
                <div className=" title-1">
                    Welcome to <span className="bold">kood/</span><span className="light">pong</span>!
                </div>
                <p className='text'>To participate in tournaments, you must be a student of Kood/Johvi.<br /><br />
                    Once you've filled out the sign-up form, your request will be sent to the admin for verification on Discord using the username you've provided. It's crucial to ensure that your Discord username is accurate when filling out the form.<br /><br />
                    If you haven't been accepted within a few days, please contact @admin on Discord for assistance.</p>
            </div>
            <div className="form-cont">
                <h1 className='title-1'>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <div className='input-field text'>
                        <label htmlFor="first-name">First name:</label>
                        <input
                            type="text"
                            id="first-name"
                            value={firstName}
                            placeholder="Enter your name"
                            className={`${error.isError ? 'red-border' : 'black-border'}`}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-field text'>
                        <label htmlFor="last-name">Last name:</label>
                        <input
                            type="text"
                            id="last-name"
                            value={lastName}
                            placeholder="Enter your name"
                            className={`${error.isError ? 'red-border' : 'black-border'}`}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-field text'>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="Enter your email"
                            className={`${error.isError ? 'red-border' : 'black-border'}`}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-field text'>
                        <label htmlFor="discord-name">Discord username:</label>
                        <input
                            type="text"
                            id="discord-name"
                            value={username}
                            placeholder="Enter your Discord username"
                            className={`${error.isError ? 'red-border' : 'black-border'}`}
                            onChange={(e) => setDiscorName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-field text'>
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type='password'
                            value={password}
                            placeholder="Enter your password"
                            className={`${error.isError ? 'red-border' : 'black-border'}`}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div className='input-field text'>
                        <label htmlFor="rep-password" className={`${error.isError ? 'red' : ''}`}>Repeat password:</label>
                        <input
                            id="rep-password"
                            type='password'
                            value={repeatedPassword}
                            placeholder="Repeat your password"
                            className={`${error.isError ? 'red-border' : 'black-border'}`}
                            onChange={(e) => setRepeatedPassword(e.target.value)}
                            required
                        ></input>
                        <span className='text red'>{error.text}</span>
                    </div>
                    {error.text}
                    <button className='btn-1 submit-btn' type="submit">Submit</button>
                </form>
                <div>
                    <span className="text-gray">Already a user? </span>
                    <a className='link' href="/login">Log in</a>
                </div>
            </div>
        </div>
    </div>
}

export default SignUp
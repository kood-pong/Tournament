import { useState } from 'react';
import './auth.css';

const SignUp = () => {
    const [fullname, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [discorName, setDiscorName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatedPassword, setRepeatedPassword] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted:', { fullname, email, discorName, password });
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
                    <div className='input-field'>
                        <label htmlFor="name">Fullname:</label>
                        <input
                            type="text"
                            id="name"
                            value={fullname}
                            placeholder="Enter your name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-field'>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-field'>
                        <label htmlFor="discord-name">Discord username:</label>
                        <input
                            type="text"
                            id="discord-name"
                            value={discorName}
                            placeholder="Enter your Discord username"
                            onChange={(e) => setDiscorName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='input-field'>
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type='password'
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        ></input>
                    </div>
                    <div className='input-field'>
                        <label htmlFor="rep-password">Repeat password:</label>
                        <input
                            id="rep-password"
                            type='password'
                            value={repeatedPassword}
                            placeholder="Repeat your password"
                            onChange={(e) => setRepeatedPassword(e.target.value)}
                            required
                        ></input>
                    </div>
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
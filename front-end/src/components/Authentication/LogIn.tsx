import { useState } from 'react';
import './auth.css';

const LogIn = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Form submitted:', {email, password });
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
                    <button className='btn-1 submit-btn' type="submit">Submit</button>
                </form>
                <div>
                    <span className="text-gray">Don't have an account? </span>
                    <a className='link' href="/signup">Sign Up</a>
                </div>
            </div>
        </div>
    </div>
}

export default LogIn
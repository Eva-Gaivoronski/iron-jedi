import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Navbar = () => {
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const [profilePicture, setProfilePicture] = useState(null);
    const username = localStorage.getItem('triviaappusername');
    const user_id = localStorage.getItem('triviaappid');
    useEffect(() => {
        const fetchProfilePicture = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/users/images/${user_id}`, {
                    responseType: 'arraybuffer',
                });

                const base64Image = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );
                setProfilePicture(`data:image/png;base64,${base64Image}`);
            } catch (error) {
                console.error('Error fetching profile picture:', error);
            }
        };
        if (user_id !=null && user_id.length > 0){
            login(isLoggedIn);
        }

        if (isLoggedIn) {
            fetchProfilePicture();
        }
    }, [isLoggedIn]);

    function setLoggedOut() {
        localStorage.setItem('triviaappusername','');
        localStorage.setItem('triviaappid','');
        logout(isLoggedIn)
    }


    return (
        <header className="Header">

            <nav>
                <ul className="nav-list">
                    <li className="nav-item navbar-brand">
                        <div>
                            <h1 className="brand-text">Trivia Explosion!</h1>
                        </div>
                    </li>
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        {isLoggedIn ? (
                            <Link to="/quizzes" className="nav-link">
                                My Quizzes
                            </Link>
                        ) : ('')}
                    </li>
                    <li className="nav-item">
                        {isLoggedIn ? (
                            <Link to="/question-form" className="nav-link">
                                My Questions
                            </Link>
                        ) : ('')}
                    </li>

                    <li className="nav-item">
                        {isLoggedIn ? ('') : (
                            <Link to="/register" className="nav-link">
                                Register
                            </Link>
                        )}
                    </li>
                    <li className="nav-item logout-btn">
                        {isLoggedIn ? (
                            <div>
                                <h6>Welcome, {username}!</h6>
                            </div>
                        ) : ('')}
                    </li>

                    <li className="nav-item">
                        {isLoggedIn && profilePicture && (
                            <img
                                src={profilePicture}
                                alt="Profile"
                                style={{width: '40px', height: '40px', borderRadius: '50%'}}
                            />
                        )}
                    </li>
                    <li className="nav-item">
                        {isLoggedIn ? (<Link to="/profile" className="nav-link">
                            My Profile
                        </Link>) : ('')
                        }
                    </li>
                    <li className="nav-item">
                        {isLoggedIn ? (
                            <Link to="/quiz-challenge" className="nav-link">
                                Share Quiz
                            </Link>
                        ) : ('')}
                    </li>
                    <li className="nav-item logout-btn">
                        {isLoggedIn ? (
                            <button onClick={setLoggedOut}>Logout</button>
                        ) : (
                            <Link to="/login" className="nav-link">
                                Login
                            </Link>
                        )}
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
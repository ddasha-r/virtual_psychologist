import { useRef, useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import eyeOpen from "../assets/eyeopen.png";
import eyeClose from "../assets/eyeclose.png";

import { Link, useNavigate, useLocation } from 'react-router-dom';

import '../style/log.css';
import logo from "../assets/logo.png"

import axios from '../api/axios';
const LOGIN_URL = '/login';

const Login = () => {
    const { setAuth, persist, setPersist} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const emailRef = useRef();
    const errRef = useRef();

    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ email: email, password: pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            const accessToken = response?.data?.accessToken;
            const roles = [response?.data?.role];
            localStorage.setItem("access", accessToken);
            localStorage.setItem("role", response?.data?.role);
            localStorage.setItem("persist", persist);
            setAuth({ roles, accessToken });
            setEmail('');
            setPwd('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 433) {
                setErrMsg('Phone number already exists');
            } else if (err.response?.status === 432) {
                setErrMsg('Email already exists');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const togglePersist = () => {
        setPersist(prev => !prev);
    }

    return (
        <main className="login main">
            <section className="welcomeSection">
                <div className="flexCol">
                    <div className="flexCol1">
                        <div className="flexCol2">
                            <h1 className="welcomeTitle">Добро Пожаловать!<br /></h1>
                            <div className="welcomeText">Пожалуйста введите ваши данные.</div>
                        </div>
                        <img className="welcomeImage" src={logo} alt="alt text" />
                    </div>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <div className="flexCol3">
                        <div className="flexCol4">
                            <div className="flexCol5">
                                <div className="emailLabel">Почта</div>
                                
                                    <input
                                        type="email"
                                        ref={emailRef}
                                        className="Field"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Введите вашу почту"
                                    />
                                
                            </div>
                            <div className="flexCol5">
                                <div className="passwordLabel">Пароль</div>
                            <div className="passwordInputWrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className="Field"
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    placeholder="**********"
                                />
                                <button
                                    type="button"
                                    className="passwordToggleBtn"
                                    onClick={toggleShowPassword}
                                >
                                    <img
                                        src={showPassword ? eyeClose : eyeOpen}
                                        alt={showPassword ? 'Hide Password' : 'Show Password'}
                                        className="eyeIcon"
                                    />
                                </button>
                            </div>
                               
                            </div>
                        </div>
                        <div className="flexCol6">
                            <div className="flexCol7">
                                <div className="flexRow">
                                    <div className="flexRow1">
                                        <input
                                            type="checkbox"
                                            className="rememberMeCheckBox"
                                            checked={persist}
                                            onChange={togglePersist}
                                        />
                                        <div className="rememberMeText">Доверять этому устройству<br /><br /></div>
                                    </div>
                                    <div className="forgotPassword">Забыли пароль?</div>
                                </div>
                                <button className="loginButton" onClick={handleSubmit}>Войти</button>
                            </div>
                            <div className="flexCol8">
                                <div className="signupInfoBox_box">
                                    <span className="signupInfoBox"><span className="signupInfoBox_span0">Нет аккаунта?</span><span className="signupInfoBox_span1"> </span></span>
                                </div>
                                <Link to="/register">Зарегистрируйтесь!</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
    
}

export default Login

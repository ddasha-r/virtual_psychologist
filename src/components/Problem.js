import { useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate, Link, useParams } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import React from 'react';

import '../style/problem.css';
import logo from "../assets/logo.png";

const Problem = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const [loggedIn, setLoggedIn] = useState(false);
    let { problemID } = useParams();
    const [name, setName] = useState("");
    const [about, setAbout] = useState("");
    const [test, setTest] = useState("");
    const [form, setForm] = useState("");
    const [errMsg, setErrMsg] = useState('');
    const [showLinks, setShowLinks] = useState(false);

    const PROBLEM_URL = '/problems/' + problemID;

    const signOut = async () => {
        await logout();
        setLoggedIn(false);
        navigate('/catalog');
    };

    const handleBuy = async () => {
        if (!loggedIn) {
            navigate('/login');
            return;
        }

        try {
            const response = await axios.put(PROBLEM_URL, {}, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access"),
                },
                withCredentials: true
            });
            console.log(response.data);
            setShowLinks(true);
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                setErrMsg('Ошибка при покупке: ' + err?.response);
            } else if (err.request) {
                setErrMsg('Нет ответа от сервера');
                console.log(err.request);
            } else {
                console.log('Ошибка', err.message);
            }
            console.log(err.config);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("access")) {
            setLoggedIn(true);
        }
        axios.get(PROBLEM_URL, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
            },
            withCredentials: true
        }).then((response) => {
            console.log(JSON.stringify(response?.data));
            setName(response?.data.name);
            setAbout(response?.data.description);
            setTest(response?.data.testCaseLink);
            setForm(response?.data.formLink);
        }).catch((err) => {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                setErrMsg('Не удалось загрузить данные: ' + err?.response)
            } else if (err.request) {
                setErrMsg('Нет ответа от сервера');
                console.log(err.request);
            } else {
                console.log('Ошибка', err.message);
            }
            console.log(err.config);
        });
    }, [problemID]);

    return (
        <body className="flex-column">
            <main className="problem-page main">
                <section className="problemDescriptionSection">
                    <div className="flexCol">
                        <div className="contentBox1">
                            <div className="flexRow">
                                <img className="image" src={logo} alt="alt text" />
                                <div className="flexRow1">
                                    <div className="flexRow2">
                                        <Link to="/"><h2 className="mainTitle">Главная</h2></Link>
                                        <Link to="/profile"><h2 className="personalCabinetTitle">Личный кабинет</h2></Link>
                                        <Link to="/catalog"><h2 className="catalogProblemsTitle">Каталог проблем</h2></Link>
                                    </div>
                                    {loggedIn ? (
                                        <button onClick={signOut}><h5 className="logoutTitle">Выйти</h5></button>
                                    ) : (
                                        <>
                                            <Link to="/login"><h2 className="logoutTitle">Войти</h2></Link>
                                            <Link to="/register"><h2 className="logoutTitle">Регистрация</h2></Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="contentBox">
                            <h1 className="problemDescriptionTitle">{name}</h1>
                        </div>
                    </div>
                    <div className="flexCol1">
                        <h1 className="bullshitParagraph">
                            {about}
                        </h1>
                        <div className="flexRow3">
                            {showLinks ? (
                                <div className="flexCol2">
                                    <button className="linkTitle1">
                                        <a href={test}>Пройти тест</a>
                                    </button>
                                    <button className="linkTitle2">
                                        <a href={form}>Пройти форму</a>
                                    </button>
                                </div>
                            ) : (
                                <button className="buyTestButton" onClick={handleBuy}>
                                    Купить
                                </button>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <script type="text/javascript">
                AOS.init();
                new Sticky('.sticky-effect');
            </script>
        </body>
    );
};

export default Problem;

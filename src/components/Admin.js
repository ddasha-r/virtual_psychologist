import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";
import React from 'react';
import '../style/profile.css';
import logo from "../assets/logo.png";
import Loader from "./Loader";

const NAME_REGEX = /^.{1,100}$/;
const NAMEPROBLEM_REGEX = /^.{1,100}$/;
const DESCRIPTION_REGEX = /^.{1,1000}$/;
const FORMLINK_REGEX = /^[A-zА-я0-9\ ]{1,1000}$/;
const TESTLINK_REGEX = /^[A-z]{1,100}$/;
const CREATE_URL = '/problems';
const REFRESH_URL = "/test-case/refresh";

const Admin = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const [loggedIn, setLoggedIn] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const errRef = useRef();

    const signOut = async () => {
        await logout();
        setLoggedIn(false);
        navigate('/');
    }

    const [formLink, setFormLink] = useState('');
    const [validFormLink, setValidFormLink] = useState(false);
    const [formLinkFocus, setFormLinkFocus] = useState(false);

    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);

    const [description, setDescription] = useState('');
    const [validDescription, setValidDescription] = useState(false);
    const [descriptionFocus, setDescriptionFocus] = useState(false);

    const [testLink, setTestLink] = useState('');
    const [validTestLink, setValidTestLink] = useState(false);
    const [testLinkFocus, setTestLinkFocus] = useState(false);


    const [nameProblem, setNameProblem] = useState('');
    const [validNameProblem, setValidNameProblem] = useState(false);
    const [nameProblemFocus, setNameProblemFocus] = useState(false);

    const [testCases, setTestCases] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name]);

    useEffect(() => {
        setValidNameProblem(NAMEPROBLEM_REGEX.test(nameProblem));
    }, [nameProblem]);

    useEffect(() => {
        setValidTestLink(true); //TESTLINK_REGEX.test(testLink)
    }, [testLink]);

    useEffect(() => {
        setValidDescription(DESCRIPTION_REGEX.test(description));
    }, [description]);
    
    useEffect(() => {
        setValidFormLink(true); //FORMLINK_REGEX.test(formLink)
    }, [formLink]);

    useEffect(() => {
        setErrMsg('');
    }, [nameProblem, description, testLink, name, formLink]);

    useEffect(() => {
        if (localStorage.getItem("access")) {
            setLoggedIn(true);
        }
        axios.put(REFRESH_URL, {}, {
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("access"),
            },
            withCredentials: true
        }).then((response) => {
            console.log(JSON.stringify(response?.data));
            setErrMsg("");
            setTestCases(response.data.map((x) => x["name"]));
            console.log(testCases);
        }).catch((err) => {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                setErrMsg('Test cases loading Failed: ' + err?.response);
            } else if (err.request) {
                setErrMsg('No Server Response');
                console.log(err.request);
            } else {
                console.log('Error', err.message);
                setErrMsg('Error: ' + err.message);
            }
            console.log(err.config);
        });
    }, [])

    useEffect(() => {
        setValidName(testCases.includes(name) && NAME_REGEX.test(name));
    }, [name, testCases]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v3 = NAME_REGEX.test(name);
        const v4 = true; // TESTLINK_REGEX.test(testLink);
        const v5 = DESCRIPTION_REGEX.test(description);
        const v6 = true; // FORMLINK_REGEX.test(formLink);
        const v7 = NAMEPROBLEM_REGEX.test(nameProblem);
        if (!v3 || !v4 || !v5 || !v6 || !v7) {
            setErrMsg("Invalid Entry");
            if (errRef.current) {
                errRef.current.focus();
            }
            return;
        }
        console.log("sending");
        await axios.post(CREATE_URL, JSON.stringify({
            name: nameProblem,
            description: description,
            testCaseLink: testLink,
            formLink: formLink,
            testCaseName: name
        }), {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("access"),
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }).then((response) => {
            console.log(response);
            setDescription('');
            setName('');
            setTestLink('');
            setFormLink('');
            setNameProblem('');
        }).catch((err) => {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                setErrMsg('Profile update failed: ' + err.response.data.message);
            } else if (err.request) {
                setErrMsg('No Server Response');
                console.log(err.request);
            } else {
                console.log('Error', err.message);
                setErrMsg('Error: ' + err.message);
            }
            console.log(err.config);
            if (errRef.current) {
                errRef.current.focus();
            }
        });
    };

    return (
        <div className="flex-column">
            <main className="profile main">
                <section className="personalDataSection">
                    <div className="contentBox">
                        <h2 className="mediumTitle">Создание проблемы</h2>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    </div>
                    <div className="flexRow">
                        <div className="flexCol">
                            <form onSubmit={handleSubmit}>
                                <div className="contentBox1">
                                    <div className="flexCol1">

                                    <div className="flexCol2">
                                            <h2 className="mediumTitle1">
                                                Название проблемы
                                                <FontAwesomeIcon icon={faCheck} className={validNameProblem ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validNameProblem || !nameProblem ? "hide" : "invalid"} />
                                            </h2>
                                            <input
                                                className="inputField"
                                                type="text"
                                                id="nameProblem"
                                                autoComplete="off"
                                                onChange={(e) => setNameProblem(e.target.value)}
                                                value={nameProblem}
                                                required
                                                aria-invalid={validNameProblem ? "false" : "true"}
                                                aria-describedby="uidnote"
                                                onFocus={() => setNameProblemFocus(true)}
                                                onBlur={() => setNameProblemFocus(false)}
                                            />
                                            <p id="uidnote" className={nameProblemFocus && nameProblem && !validNameProblem ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                От 1 до 1000 символов.<br />
                                            </p>
                                        </div>

                                        <div className="flexCol2">
                                            <h2 className="mediumTitle1">
                                                Название TasteCase
                                                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
                                            </h2>
                                            <input
                                                className="inputField"
                                                list="problemList"
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onFocus={() => setNameFocus(true)}
                                                onBlur={() => setNameFocus(false)}
                                                required
                                                aria-invalid={validName ? "false" : "true"}
                                                aria-describedby="uidnote"
                                                placeholder="Введите название проблемы или выберите из списка"
                                            />
                                            <datalist id="problemList">
                                                {testCases
                                                    .filter(testCase => testCase.toLowerCase().includes(name.toLowerCase()))
                                                    .map((testCase, index) => (
                                                        <option key={index} value={testCase} />
                                                    ))}
                                            </datalist>
                                            <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "hide"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                От 1 до 100 символов.<br />
                                                Название должно совпадать с одним из существующих тестов.<br />
                                            </p>
                                        </div>
                                        <div className="flexCol2">
                                            <h2 className="mediumTitle1">
                                                Описание проблемы
                                                <FontAwesomeIcon icon={faCheck} className={validDescription ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validDescription || !description ? "hide" : "invalid"} />
                                            </h2>
                                            <input
                                                className="inputField"
                                                type="text"
                                                id="description"
                                                autoComplete="off"
                                                onChange={(e) => setDescription(e.target.value)}
                                                value={description}
                                                required
                                                aria-invalid={validDescription ? "false" : "true"}
                                                aria-describedby="uidnote"
                                                onFocus={() => setDescriptionFocus(true)}
                                                onBlur={() => setDescriptionFocus(false)}
                                            />
                                            <p id="uidnote" className={descriptionFocus && description && !validDescription ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                От 1 до 1000 символов.<br />
                                            </p>
                                        </div>
                                        <div className="flexCol2">
                                            <h2 className="mediumTitle1">
                                                Ссылка на тестирование
                                                <FontAwesomeIcon icon={faCheck} className={validTestLink ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validTestLink || !testLink ? "hide" : "invalid"} />
                                            </h2>
                                            <input
                                                className="inputField"
                                                type="text"
                                                id="testLink"
                                                autoComplete="off"
                                                onChange={(e) => setTestLink(e.target.value)}
                                                value={testLink}
                                                required
                                                aria-invalid={validTestLink ? "false" : "true"}
                                                aria-describedby="uidnote"
                                                onFocus={() => setTestLinkFocus(true)}
                                                onBlur={() => setTestLinkFocus(false)}
                                            />
                                            <p id="uidnote" className={testLinkFocus && testLink && !validTestLink ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                От 1 до 100 символов.<br />
                                                Должно являться ссылкой на тестирование для пользователей<br />
                                            </p>
                                        </div>
                                        <div className="flexCol2">
                                            <h2 className="mediumTitle1">
                                                Ссылка на форму
                                                <FontAwesomeIcon icon={faCheck} className={validFormLink ? "valid" : "hide"} />
                                                <FontAwesomeIcon icon={faTimes} className={validFormLink || !formLink ? "hide" : "invalid"} />
                                            </h2>
                                            <input
                                                className="inputField"
                                                type="text"
                                                id="formLink"
                                                autoComplete="off"
                                                onChange={(e) => setFormLink(e.target.value)}
                                                value={formLink}
                                                required
                                                aria-invalid={validFormLink ? "false" : "true"}
                                                aria-describedby="uidnote"
                                                onFocus={() => setFormLinkFocus(true)}
                                                onBlur={() => setFormLinkFocus(false)}
                                            />
                                            <p id="uidnote" className={formLinkFocus && formLink && !validFormLink ? "instructions" : "offscreen"}>
                                                <FontAwesomeIcon icon={faInfoCircle} />
                                                От 1 до 100 символов.<br />
                                                Должно являться ссылкой на форму для пользователей<br />
                                            </p>
                                        </div>
                                        <button className="changeDataTitle" disabled={!validName || !validDescription || !validTestLink || !validFormLink}>Создать</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    
                    <div className="navigationContentBox">
                        <div className="flexRow3">
                            <img className="image" src={logo} alt="alt text" />
                            <div className="flexRow4">
                                <Link to="/"><h2 className="navigationTitle">Главная</h2></Link>
                                <Link to="/profile"><h2 className="navigationTitle1">Личный кабинет</h2></Link>
                                <Link to="/catalog"><h2 className="navigationTitle">Каталог проблем</h2></Link>
                            </div>
                            <div className="authContainer">
                                {loggedIn ? (
                                    <button onClick={logout}><h5 className="loginLink">Выйти</h5></button>
                                ) : (
                                    <>
                                        <Link to="/login"><h2 className="loginLink">Войти</h2></Link>
                                        <Link to="/register"><h2 className="registerLink">Регистрация</h2></Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Admin;

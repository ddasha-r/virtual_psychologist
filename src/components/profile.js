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

const NAME_REGEX = /^[A-zА-я\ ]{1,100}$/;
const SURNAME_REGEX = /^[A-zА-я\ ]{1,100}$/;
const PATRONYMIC_REGEX = /^[A-zА-я\ ]{1,100}$/;
const PROFILE_URL = '/user/info';
const UPDATE_URL = '/user';
const RESULTS_URL = '/results';
const UPDATERESULTS_URL = '/results/refresh';

const Profile = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const errRef = useRef();

    const [loggedIn, setLoggedIn] = useState(false)
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState("");
    const [fetching, setFetching] = useState(true);

    const signOut = async () => {
        await logout();
        setLoggedIn(false);
        navigate('/');
    }

    const getResults = async () => {
        axios.get(RESULTS_URL, {
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("access"),
            },
            withCredentials: true
        }).then((response) => {
            console.log(JSON.stringify(response.data));
            setResults(response.data);
            setFetching(false);
            setMessage('');
        }).catch((err) => {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                setMessage('Catalog display Failed: ' + err?.response)
            } else if (err.request) {
                setMessage('No Server Response');
                console.log(err.request);
            } else {
                setMessage('Something went wrong');
                console.log('Error', err.message);
            }
            console.log(err.config);
        })
        if (message === "" && results.length < 1 && !fetching) {
            setMessage("No problems added yet");
        }
    }


    const [email, setEmail] = useState('');
    const [phoneNum, setPhoneNum] = useState('');
    const [birthday, setBirthday] = useState('');
    const [validBirthday, setValidBirthday] = useState(false);
    const [birthdayFocus, setBirthdayFocus] = useState(false);
    const [name, setName] = useState('');
    const [validName, setValidName] = useState(false);
    const [nameFocus, setNameFocus] = useState(false);
    const [surname, setSurname] = useState('');
    const [validSurname, setValidSurname] = useState(false);
    const [surnameFocus, setSurnameFocus] = useState(false);
    const [patronymic, setPatronymic] = useState('');
    const [validPatronymic, setValidPatronymic] = useState(false);
    const [patronymicFocus, setPatronymicFocus] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("access")) {
            setLoggedIn(true);
        }
        setFetching(true);
        getResults();

        axios.get(PROFILE_URL, {
            headers: { 
                "Authorization": "Bearer " + localStorage.getItem("access"),
            },
            withCredentials: true
        }).then((response) => {
            console.log(JSON.stringify(response?.data));
            setSuccess(true);
            setName(response?.data.name);
            setSurname(response?.data.surname);
            setPatronymic(response?.data.patronymic);
            setBirthday(response?.data.birthday);
            setEmail(response?.data.email);
            setPhoneNum(response?.data.phoneNum);
        }).catch((err) => {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                setErrMsg('Profile display Failed: ' + err?.response);
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
    }, []);

    useEffect(() => {
        setValidName(NAME_REGEX.test(name));
    }, [name]);

    useEffect(() => {
        setValidPatronymic(PATRONYMIC_REGEX.test(patronymic));
    }, [patronymic]);

    useEffect(() => {
        setValidSurname(SURNAME_REGEX.test(surname));
    }, [surname]);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Сбросить время, чтобы сравнивать только даты
        const birthdayDate = new Date(birthday);
        if (birthdayDate < today) {
            setValidBirthday(true);
        } else {
            setValidBirthday(false);
        }
    }, [birthday]);

    useEffect(() => {
        setErrMsg('');
    }, [surname, patronymic, name, birthday]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const v3 = NAME_REGEX.test(name);
        const v4 = PATRONYMIC_REGEX.test(patronymic);
        const v5 = SURNAME_REGEX.test(surname);
        if (!v3 || !v4 || !v5) {
            setErrMsg("Invalid Entry");
            if (errRef.current) {
                errRef.current.focus();
            }
            return;
        }
        try {
            const response = await axios.put(UPDATE_URL, 
                JSON.stringify({
                    name: name,
                    surname: surname,
                    patronymic: patronymic,
                    birthday: birthday,
                }),
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access"),
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                }
            );
        } catch (err) {
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
        }
    };

    const handleUpdateResults = async () => {
        try {
            const response = await axios.put(UPDATERESULTS_URL, {}, {
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access"),
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
        } catch (err) {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                setMessage('Results update failed: ' + err.response.data.message);
            } else if (err.request) {
                setMessage('No Server Response');
                console.log(err.request);
            } else {
                setMessage('Error: ' + err.message);
            }
            console.log(err.config);
        }
    };

    return (
        <div className="flex-column">
          <main className="profile main">
            <section className="personalDataSection">
              <div className="contentBox">
                <h2 className="mediumTitle">Личные данные</h2>
              </div>
              <div className="flexRow">
                <div className="flexCol">
                  <form onSubmit={handleSubmit}>
                    <div className="contentBox1">
                      <div className="flexCol1">
                        <div className="flexCol2">
                          <div className="inputFieldHeader">
                            <h2 className="mediumTitle2">Имя</h2>
                            <div>
                              <h2 className="mediumTitle2">
                                <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validName || !name ? "hide" : "invalid"} />
                              </h2>
                            </div>
                          </div>
                          <input className="inputField"
                            type="text"
                            id="name"
                            autoComplete="off"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setNameFocus(true)}
                            onBlur={() => setNameFocus(false)}
                          />
                          <p id="uidnote" className={nameFocus && name && !validName ? "instructions" : "hide"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            От 1 до 100 символов.<br />
                            Должно содержать только буквы.<br />
                          </p>
                        </div>
                        <div className="flexCol3">
                        <div className="inputFieldHeader">
                            <h2 className="mediumTitle2">Фамилия</h2>
                            <div>
                              <h2 className="mediumTitle2">
                                <FontAwesomeIcon icon={faCheck} className={validSurname ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validSurname || !surname ? "hide" : "invalid"} />
                              </h2>
                            </div>
                          </div>
                          <input className="inputField"
                            type="text"
                            id="surname"
                            autoComplete="off"
                            onChange={(e) => setSurname(e.target.value)}
                            value={surname}
                            required
                            aria-invalid={validSurname ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setSurnameFocus(true)}
                            onBlur={() => setSurnameFocus(false)}
                          />
                          <p id="uidnote" className={surnameFocus && surname && !validSurname ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            От 1 до 100 символов.<br />
                            Должно содержать только буквы.<br />
                          </p>
                        </div>
                        <div className="flexCol3">
                          <div className="inputFieldHeader">
                            <h2 className="mediumTitle2">Отчество</h2>
                            <div>
                              <h2 className="mediumTitle2">
                                <FontAwesomeIcon icon={faCheck} className={validPatronymic ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validPatronymic || !patronymic ? "hide" : "invalid"} />
                              </h2>
                            </div>
                          </div>
                          <input className="inputField"
                            type="text"
                            id="patronymic"
                            autoComplete="off"
                            onChange={(e) => setPatronymic(e.target.value)}
                            value={patronymic}
                            required
                            aria-invalid={validPatronymic ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setPatronymicFocus(true)}
                            onBlur={() => setPatronymicFocus(false)}
                          />
                          <p id="uidnote" className={patronymicFocus && patronymic && !validPatronymic ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            От 1 до 100 символов.<br />
                            Должно содержать только буквы.<br />
                          </p>
                        </div>
                        <div className="flexCol4">
                          <div className="inputFieldHeader">
                            <h2 className="mediumTitle2">Дата рождения</h2>
                            <div>
                              <h2 className="mediumTitle2">
                                <FontAwesomeIcon icon={faCheck} className={validBirthday ? "valid" : "hide"} />
                                <FontAwesomeIcon icon={faTimes} className={validBirthday || !birthday ? "hide" : "invalid"} />
                              </h2>
                            </div>
                          </div>
                          <input className="inputField"
                            type="date"
                            id="birthday"
                            autoComplete="off"
                            onChange={(e) => setBirthday(e.target.value)}
                            value={birthday}
                            required
                            aria-invalid={validBirthday ? "false" : "true"}
                            aria-describedby="uidnote"
                            onFocus={() => setBirthdayFocus(true)}
                            onBlur={() => setBirthdayFocus(false)}
                          />
                          <p id="uidnote" className={birthdayFocus && birthday && !validBirthday ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Некоректная дата рождения<br />
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="contentBox1">
                      <div className="flexRow1">
                        <div className="flexCol5">
                          <div className="flexCol6">
                            <h2 className="mediumTitle5">Почта<br /></h2>
                            <input className="inputField"
                              type="text"
                              id="email"
                              readOnly
                              defaultValue={email}
                            />
                          </div>
                          <div className="flexCol7">
                            <h2 className="mediumTitle6">Номер телефона</h2>
                            <input className="inputField"
                              type="text"
                              id="phoneNum"
                              readOnly
                              defaultValue={phoneNum}
                            />
                          </div>
                        </div>
                        <button className="updateButton"
                          disabled={!validName || !validSurname || !validPatronymic || !validBirthday ? true : false}>
                          Изменить данные
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="testResultsContentBox">
                  <div className="flexColTests">
                    <h1 className="pageTitle">Результаты тестирования</h1>
                    <div className="flexColTestsItems">
                      {fetching && !message ? (
                        <center>
                          <Loader />
                        </center>
                      ) : message ? (
                        <div className="Title">{message}</div>
                      ) : (
                        <ul>
                          {results.map((result, i) => (
                            <li key={`item_${i}`} className="flexRowPersonalityDisorders">
                              <h2 className="Title">{result["name"]}</h2>
                              <Link to={"/results/" + result["id"]}><button className="Button">Подробнее</button></Link>
                            </li>
                          ))}
                        </ul>
                      )}
                      <button className="updateButton" onClick={handleUpdateResults}>Обновить</button>
                    </div>
                  </div>
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
                      <button onClick={signOut}><h5 className="loginLink">Выйти</h5></button>
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

export default Profile;

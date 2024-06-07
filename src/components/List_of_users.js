import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from '../api/axios';
import useLogout from "../hooks/useLogout";
import Loader from "./Loader";

import '../style/list_of_users.css';

import logo from "../assets/logo.png";

const PROBLEMS_URL = '/problems';

const Catalog = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const [loggedIn, setLoggedIn] = useState(false)
    const [role, setRole] = useState(0);

    

    const signOut = async () => {
        await logout();
        setLoggedIn(false)
        navigate('/catalog');
    }

    const [problems, setProblems] = useState([]);
    const [message, setMessage] = useState("");
    const [fetching, setFetching] = useState(true);


    const getProblems = async () => {
        axios.get(PROBLEMS_URL).then((response) => {
            console.log(JSON.stringify(response.data));
            setProblems(response.data);
            setFetching(false)
            setMessage('')
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
    }
    
    useEffect(() => {
        if (message === "" && problems.length < 1 && !fetching) {
            setMessage("No problems added yet");
        }
    }, [problems])

    useEffect(() => {
        if (localStorage.getItem("access")) {
            setLoggedIn(true);
        }
        setRole(Number(localStorage.getItem("role")));
        setFetching(true)
        getProblems()
    }, [])

    return (
        <div class="flex-column">
    <main class="users-info-page main">
        <section class="usersSection">
            <div class="flexRow">
                <img class="logoImage" src={logo} alt="alt text" />
                <div class="headerRow">
                    <div class="navigationRow">
                        <Link to="/"><h2 className="homeTitle">Главная</h2></Link>
                        <Link to="/profile"><h2 className="personalCabinetTitle">Личный кабинет</h2></Link>
                        <Link to="/catalog"><h2 className="catalogTitle">Каталог проблем</h2></Link>
                    </div>
                    <div class="authBox">
                    {loggedIn ? (
                        <button onClick={signOut}><h5 className="loginTitle">Выйти</h5></button>
                        ) : (
                <>
                    <Link to="/login"><h2 className="loginTitle">Войти</h2></Link>
                    <Link to="/register"><h2 className="loginTitle">Регистрация</h2></Link>
                </>
            )} 
                    </div>
                </div>
            </div>
            {/* <div class="contentContainer">
                <div class="userList">
                    <h2 class="userListTitle">Список пользавателей</h2>
                    <div class="userRow">
                        <div class="userDetails">
                            <h2 class="firstNameTitle">имя</h2>
                            <h2 class="lastNameTitle">фамилия</h2>
                            <h2 class="emailTitle">почта</h2>
                        </div>
                        <button class="detailsButton">подробнее</button>
                    </div>
                    <div class="userRow1">
                        <div class="userDetails">
                            <h2 class="firstNameTitle">имя</h2>
                            <h2 class="lastNameTitle">фамилия</h2>
                            <h2 class="emailTitle">почта</h2>
                        </div>
                        <button class="detailsButton">подробнее</button>
                    </div>
                </div>
            </div> */}
        </section>

    </main>
    <script type="text/javascript">
        AOS.init();
        new Sticky('.sticky-effect');
    </script>
</div>
    )
};

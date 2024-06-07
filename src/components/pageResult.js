import { useRef, useState, useEffect } from "react";
import axios from '../api/axios';
import { useNavigate, Link, useParams } from "react-router-dom";


import useLogout from "../hooks/useLogout";
import React from 'react';
import Loader from "./Loader";

import '../style/result.css';
import logo from "../assets/logo.png"

const Result = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const [loggedIn, setLoggedIn] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [fetching, setFetching] = useState(true);
    
    let { resultID } = useParams();
    const [ name, setName ] = useState("");
    const [ createdAt, setCreatedAt] = useState("");
    const [ duration, setDuration ] = useState("");
    const [ nodes, setNodes ] = useState([]);
    
    const RESULT_URL = '/results/' + resultID;

    const signOut = async () => {
        await logout();
        setLoggedIn(false);
        navigate('/');
    }

    const getResult = async () => {
        if (localStorage.getItem("access")) {
            setLoggedIn(true);
        }
        axios.get(RESULT_URL, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem("access")},
            withCredentials: true
        }).then((response) => {
            console.log(JSON.stringify(response?.data));
            setName(response?.data.name);
            setCreatedAt(response?.data.createdAt);
            setDuration(response?.data.duration);
            setNodes(response?.data.nodes);
            setErrMsg("");
            setFetching(false);
        }).catch((err) => {
            if (err.response) {
                console.log(err.response.data);
                console.log(err.response.status);
                console.log(err.response.headers);
                setErrMsg('Result display Failed: ' + err?.response)
            } else if (err.request) {
                setErrMsg('No Server Response');
                console.log(err.request);
            } else {
                console.log('Error', err.message);
            }
            console.log(err.config);
        });
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
      }

    useEffect(() => {
        if (localStorage.getItem("access")) {
            setLoggedIn(true);
        }
        setFetching(true)
        getResult()
    }, []);

 

    return (
    <div class="flex-column">
    <main class="pageresults main">
        <section class="resultsSection">
            <div class="headerContainer">
                <img class="logoImage" src={logo} alt="alt text" />
                <div class="navigationContainer">
                    <div className="primaryNavItems">
                        <Link to="/"><h2 className="primaryNavItem">Главная</h2></Link>
                        <Link to="/profile"><h2 className="primaryNavItem">Личный кабинет</h2></Link>
                        <Link to="/catalog"><h2 className="primaryNavItem">Каталог проблем</h2></Link>
                    </div>
                    <div className="secondaryNavItems">
                    {loggedIn ? (
                        <button onClick={signOut}><h5 className="secondaryNavItem">Выйти</h5></button>
                    ) : (
                        <>
                            <Link to="/login"><h2 className="secondaryNavItem">Войти</h2></Link>
                            <Link to="/register"><h2 className="secondaryNavItem">Регистрация</h2></Link>
                        </>
                    )}
                    </div>



                </div>
            </div>
            <div class="mainContent">
                <div class="titleContainer">
                    <h2 class="resultsTitle">Результаты тестирования</h2>
                    <hr class="dividerLine" size="1" />
                </div>
                <div class="metricsContainer">
                    <div class="metricsRow">
                        <div class="metricsDetails">
                            <div class="metricsCategory">
                                <h2 class="metricsCategoryTitle">Проблема</h2>
                                <h2 class="metricsCategoryDetails">{name}</h2>
                            </div>
                            <div class="metricsDate">
                                <h2 class="metricsDateTitle">Дата прохождения</h2>
                                <h2 className="metricsDateDetails">{formatDate(createdAt)}</h2>

                            </div>
                            <div class="metricsDuration">
                                <h2 class="metricsDurationTitle">Время прохождения</h2>
                                <h2 class="metricsDurationDetails">{duration}</h2>
                                
                            </div>
                        </div>
                        <div class="metricDescriptions">
                            <h2 class="metricTitle">Пояснение метрик</h2>
                            <h2 class="metricDescription">
                                Актуализация - справа - воспроизведение имеющихся у человека знаний, умений, навыков, форм поведения. 
                            </h2>
                            
                            <h2 class="metricDescription1">
                                Потенциал - слева - возможный, скрытый, не проявляющийся и не обладающий достаточной силой для проявления.
                                Значение справа
                            </h2>
                        </div>
                    </div>
                    <div class="highlightBox"></div>
                    <img class="highlightImage" src="./assets/21e5b454daa33686ac34e0a995adb872.svg" alt="alt text" />
                </div>
            </div>


            <div className="attributesContainer">
  {nodes.map((node, index) => (
    <div key={index} className="chart-item">
      <div className="chart">
        <div className="bar score-bar" style={{ height: `${node.score}%` }}>
          <span className="bar-value">{Math.round(node.score)}</span>
        </div>
        <div className="bar potential-bar" style={{ height: `${node.potencial}%` }}>
          <span className="bar-value">{Math.round(node.potencial)}</span>
        </div>
      </div>
      <h2 class="attributeTitle">{node.name}</h2>
    </div>
  ))}
</div>









            
        </section>

    </main>
    <script type="text/javascript">
        AOS.init();
        new Sticky('.sticky-effect');
    </script>
</div>
    )

    
    
};

export default Result;



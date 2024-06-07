import { useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from '../api/axios';
import useLogout from "../hooks/useLogout";
import Loader from "./Loader";

import '../style/catalog.css';

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
        <body class="flex-column">
    <main class="catalog-page main">
        <section class="mainSection">
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
                    <Link to="/register"><h2 className="registerTitle">Регистрация</h2></Link>
                </>
            )} 
                    </div>
                </div>
            </div>
            <div class="catalogContentBox">
                <h2 class="catalogSectionTitle">Каталог проблем</h2>
            </div>
            <div class="categoryRow">
                <div class="categoryCol">
                    <div class="relationshipCategoryCol">
                        <h2 class="relationshipTitle">Отношения с людьми</h2>
                        <div class="relationshipSubCategoryRow">
                            <h2 class="familyColleaguesGroupTitle">
                                семья<br />коллеги<br />знакомые<br />служащие силовых структур
                            </h2>
                            <h2 class="friendsRelativesGroupTitle">
                                друзья<br />родственники<br />госслужащие<br />незнакомые люди
                            </h2>
                        </div>
                    </div>
                    <div class="nutritionCategoryCol">
                        <h2 class="nutritionTitle">Питание</h2>
                        <div class="nutritionSubCategoryRow">
                            <h2 class="carbWithdrawalVegetarianTitle">отказ от углеводов<br />вегетерианство</h2>
                            <h2 class="fastingDaysIntervalFastingTitle">разгрузочные дни<br />интервальное голодание</h2>
                        </div>
                    </div>
                    <div class="businessCategoryCol">
                        <h2 class="businessTitle">Бизнес</h2>
                        <div class="businessSubCategoryRow">
                            <h2 class="financialCeilingGoalAchievementTitle">финансовый потолок<br />достижение цели</h2>
                            <h2 class="resourceStateBankruptcyTitle">ресурсное состояние<br />банкротство</h2>
                        </div>
                    </div>
                    <div class="psychIssuesCategoryCol">
                        <h2 class="psychIssuesTitle">Психологические проблемы</h2>
                        <div class="psychIssuesSubCategoryRow">
                            <h2 class="emotionalBurnoutDepressionTitle">
                                эмоциональное выгорание<br />депрессия<br />детские психотравмы<br />насилие
                            </h2>
                            <h2 class="phobiasNegativeEmotionsBreakupTitle">
                                фобии<br />негативные эмоции<br />расставание<br />утрата ближнего
                            </h2>
                        </div>
                    </div>
                    <div class="healthCategoryCol">
                        <h2 class="healthTitle">Здоровье</h2>
                        <div class="healthSubCategoryRow">
                            <h2 class="alcoholismVirusDiseasesTitle">алкоголизм<br />вирусные заболевания</h2>
                            <h2 class="drugAddictionDiarrheaTitle">наркотическая зависимость<br />диарея</h2>
                        </div>
                    </div>
                    <div class="sportsCategoryCol">
                        <h2 class="sportsTitle">Спорт</h2>
                        <div class="sportsSubCategoryRow">
                            <h2 class="injuryMotivationVictoryTitle">травма<br />мотивация на победу</h2>
                            <h2 class="bullyingEnvyRivalsTitle">буллинг<br />зависть соперников</h2>
                        </div>
                    </div>
                </div>
                <div class="testsContentBox">
                    <div class="testsCategoryCol">
                        <h2 class="testsTitle">Тесты</h2>
                        <div class="relationshipTestRow">
                        {fetching && !message ? (
                            <center>
                                <Loader />
                            </center>
                        ) : problems.length < 1 || message? (
                            <div className="noUser">{message}</div>
                        ) : (
                            <ul>
                                {problems.map((problem, i) => (
                                    <li key={`item_${i}`}>
                                        <div className="relationshipTestRow">
                                            <h2 className="relationshipTestTitle">{ problem["name"] }</h2>
                                            <Link to={"/catalog/" + problem["id"]}><button className="relationshipTestButton">Подробнее</button></Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {role == 5150 && (
                                <Link to="/admin">
                                    <button className="addTestButton">Добавить тест</button>
                                 </Link>
                            )}
                </div>
            </div>
            </div>
        </section>

    </main>
    <script type="text/javascript">
        AOS.init();
        new Sticky('.sticky-effect');
    </script>
</body>
        

            /* <div className="flexRow">
                <img className="image1" src={text} alt="alt text" />
                <div className="contentBox">
                    </div>
                <div className="infoBox">
                    <div className="infoCol">
                        <h1 className="headerTitle">Тесты</h1>
                        <div className="infoRows">
                        {fetching && !message ? (
                            <center>
                                <Loader />
                            </center>
                        ) : problems.length < 1 || message? (
                            <div className="noUser">{message}</div>
                        ) : (
                            <ul>
                                {problems.map((problem, i) => (
                                    <li key={`item_${i}`}>
                                        <div className="infoColumns">
                                            <h2 className="impulseControlDisordersTitle">{ problem["name"] }</h2>
                                            <button className="viewButton">Подробнее</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="sideCol">
                <div className="sideContent">
                    <div className="sideRow">
                        {/* <img className="sideIcon" src={logo} alt="alt text" />
                        <div className="sideRows">
                            <div className="sideRowContent"> */
                                /* <Link to="/"><h2 className="homeTitle">Главная</h2></Link>
                                <Link to="/profile"><h2 className="profileTitle">Личный кабинет</h2></Link>
                                <Link to="/catalog"><h2 className="problemCatalogTitle">Каталог проблем</h2></Link>
                                
                            </div>
                            <div className="accountActions">
                                <Link to="/login"><h2 className="loginTitle">Войти</h2></Link>
                                <Link to="/register"><h2 className="registerTitle">Регистрация</h2></Link> 
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className="problemCatalogBox">
                    <h2 className="problemCatalog">Каталог проблем</h2>
                </div>
            </div> */
        /* </section>

    </main>
    <script type="text/javascript">
        AOS.init();
        new Sticky('.sticky-effect');
    </script>
</body> */

    );
}

export default Catalog;

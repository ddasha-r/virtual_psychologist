import { useNavigate, Link } from "react-router-dom";
import useLogout from "../hooks/useLogout";

import '../style/Landing.css';

import battery from "../assets/battery.png"
import calmness from "../assets/calmness.png"
import click from "../assets/click.png"
import coin_icon from "../assets/coin_icon.png"
import globus_icon from "../assets/globus_icon.png"
import globus from "../assets/globus.png"
import idea from "../assets/idea.png"
import logo from "../assets/logo.png"
import manhand from "../assets/manhand.png"
import page_icon from "../assets/page_icon.png"
import phonecall from "../assets/phonecall.png"
import security from "../assets/security.png"
import shield_icon from "../assets/shield_icon.png"
import shield from "../assets/shield.png"
import glasses from "../assets/man_glasses.png"
import { useEffect, useState } from "react";
// import womanhand from "../assets/womanhand.png"

const Home = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const [loggedIn, setLoggedIn] = useState(false)

    const signOut = async () => {
        await logout();
        setLoggedIn(false)
        navigate('/');
    }

    useEffect(() => {
        if (localStorage.getItem("access")) {
            setLoggedIn(true);
        }
    }, [])

    return (
        <div className="flex-column">
    <main className="untitled-page main">
        <section className="landingSection">
            <div className="headerContainer">
                <div className="navContainer">
                    <div className="brandContainer">
                        <img className="brandLogo" src={logo} alt="alt text" />
                        <div className="navMenu">     
                        <Link to="/"><h2 className="homeLink">Главная</h2></Link>
                        <Link to="/profile"><h2 className="profileLink">Личный кабинет</h2></Link>
                        <Link to="/catalog"><h2 className="problemsCatalogLink">Каталог проблем</h2></Link>
                        </div>
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
                <div className="heroContainer">
                    <div className="heroContent">
                        <div className="backgroundDecor"></div>
                        <div className="heroTextContainer">
                            <h1 className="mainTitle">
                                Виртуальный психолог - сервис доступной профессиональной помощи, разработанной специалистами
                            </h1>
                            <h3 className="subtitle">
                                Регистрируйтесь в сервисе за 5 минут,<br />запустите тестирование в 3 шага, получите<br />результаты
                  через 10 минут
                            </h3>
                            <Link to="/catalog"><h5 className="ctaButton">Пройти тестирование</h5></Link>
                        </div>
                    </div>
                </div>
                <div className="featuresContainer">
                    <div className="featureItem">
                        <img className="featureIcon" src={shield_icon} alt="alt text" />
                        <h5 className="featureText">95%достоверность результатов</h5>
                    </div>
                    <div className="featureItem1">
                        <img className="featureIcon1" src={coin_icon} alt="alt text" />
                        <h5 className="featureText1">Экономия на подборе<br />психолога</h5>
                    </div>
                    <div className="featureItem2">
                        <img className="featureIcon1" src={globus_icon} alt="alt text" />
                        <h5 className="featureText">Доступ к сервису по всей России</h5>
                    </div>
                    <div className="featureItem2">
                        <img className="featureIcon1" src={page_icon} alt="alt text" />
                        <h5 className="featureText1">Наличие патентов и сертификатов на<br />метод</h5>
                    </div>
                </div>
                <div className="whyUsContainer">
                    <h1 className="sectionHeader">Почему мы?</h1>
                    <div className="benefitsGrid">
                        <div className="benefitItem">
                            <img className="benefitIcon" src={globus} alt="alt text" />
                            <h2 className="benefitText">Круглосуточная доступность: Помощь доступна в любое время без расписаний.</h2>
                        </div>
                        <div className="benefitItem1">
                            <img className="benefitIcon1" src={battery} alt="alt text" />
                            <h2 className="benefitText1">Экономичность: <br />Дешевле, чем услуги живого психолога.</h2>
                        </div>
                        <div className="benefitItem2">
                            <img className="benefitIcon2" src={idea} alt="alt text" />
                            <h2 className="benefitText2">Мгновенный доступ: <br />Не нужно ждать, помощь предоставляется сразу.</h2>
                        </div>
                        <div className="benefitItem">
                            <img className="benefitIcon3" src={calmness} alt="alt text" />
                            <h2 className="benefitText">
                                Персонализация: <br />Индивидуальные советы<br />
                  благодаря анализу данных.
                            </h2>
                        </div>
                        <div className="benefitItem">
                            <img className="benefitIcon" src={shield} alt="alt text" />
                            <h2 className="benefitText">Анонимность: <br />Полная конфиденциальность без участия человека.</h2>
                        </div>
                        <div className="benefitItem">
                            <img className="benefitIcon3" src={click} alt="alt text" />
                            <h2 className="benefitText">Объективность: <br />Отсутствие субъективности и эмоционального влияния.</h2>
                        </div>
                    </div>
                </div>
                <div className="stepsContainer">
                    <div className="stepsContent">
                        <h1 className="stepsTitle">Показываем , как просто, на примере 1 теста - <br />попробуйте сами</h1>
                        <div className="stepsRow">
                            <div className="stepBox">
                                <div className="stepDetails">
                                    <h5 className="stepTitle">Регистрация</h5>
                                    <h5 className="stepDescription">Пройдите регистрацию <br />по номеру телефона и почте</h5>
                                </div>
                            </div>
                            <div className="stepBox">
                                <div className="stepDetails1">
                                    <h5 className="stepTitle">Тестирование</h5>
                                    <h5 className="stepDescription1">
                                        Выберете тестирование<br />
                      и пройдите тест
                                    </h5>
                                </div>
                            </div>
                            <div className="stepBox">
                                <div className="stepDetails1">
                                    <h5 className="stepTitle">Просмотр результатов</h5>
                                    <h5 className="stepDescription1">
                                        Получите расшифровку<br />
                      результатов  
                                    </h5>
                                </div>
                            </div>
                            <div className="stepBox">
                                <div className="stepDetails1">
                                    <h5 className="stepTitle">Покупка аудиофайлов</h5>
                                    <h5 className="stepDescription1">Приобретите аудиофайл <br />для  психокррекции</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="securityContainer">
                    <div className="securityContent">
                        <h1 className="securityTitle">Закрытая система с высоким уровнем безопасности</h1>
                        <div className="securityDetails">
                            <img className="securityIcon" src={security} alt="alt text" />
                            <h2 className="securityDescription">
                                Никто не имеет доступа к конфиденциальным данным наших клиентов, и личная информация защищена на
                                различных уровнях, что исключает возможность утечки. Мы не раскрываем результаты использования системы
                                без согласия пользователя и не передаем их третьим лицам. Система функционирует только в онлайн-режиме
                                и не требует специального оборудования со стороны клиента — для установки и контроля не потребуется
                                приглашать специалистов на рабочее место.
                            </h2>
                        </div>
                    </div>
                </div>
                <div className="impactContainer">
                    <div className="impactItem">
                        <img className="impactIcon" src={phonecall} alt="alt text" />
                        <h2 className="impactTitle">Психологическое состояние улучшается</h2>
                        <h5 className="impactDescription">
                            Психологический помощник принесет дополнительную пользу — ускорит психотерапию, снизит затраты на
                            психологов, избавит вас от длительного похода по врачам.
                        </h5>
                    </div>
                    <div className="impactItem1">
                        <img className="impactIcon1" src={manhand} alt="alt text" />
                        <h2 className="impactTitle">Быстрая усталость от любого рода деятельности</h2>
                        <h5 className="impactDescription1">
                            Сервис упростит процесс познания себя. Если клиент захочет улучшить свои характеристики, то сайт
                            предоставит возможность сгенерировать психокоррекционный аудиофайл.
                        </h5>
                    </div>
                    <div className="impactItem1">
                        <img className="impactIcon2" src={glasses} alt="alt text" />
                        <h2 className="impactTitle">Человек без знания своих сильных и слабых сторон</h2>
                        <h5 className="impactDescription2">
                            Не зная о своих качествах очень трудно найти свое дело, которое будет приносить удовольствие.
                            Самостоятельно невозможно объективно оценить себя.
                        </h5>
                    </div>
                </div>
            </div>
        </section>

    </main>
</div>
    );
}

export default Home;

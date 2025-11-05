import React, { useEffect, useRef, useState } from 'react';
import {
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonPage,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonImg,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonToast
} from '@ionic/react';
import { IonInput } from '@ionic/react';
import { IonInputPasswordToggle } from '@ionic/react';
import jwtAuthAxios, { setAuthToken } from "../service/jwtAuth";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { IonIcon } from "@ionic/react";
import { person } from "ionicons/icons";
import { clear } from '@testing-library/user-event/dist/cjs/utility/clear.js';

const Login = ({ handleClosep }) => {

    const [input, setInput] = useState({
        name: "",
        email: "",
        mobileNo: "",
        password: "",
        company: "",
        refrence: ""
    });
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setLoading(true);

        console.log(input)

        try {
                const response = await jwtAuthAxios.post("client/auth", {
                    name: input.name,
                    password: input.password,
                    rememberMe: isRememberMe,
                });
                if (response.status === 200) {
                    setAuthToken(response?.data, isRememberMe);
                    localStorage.setItem("token", response?.data?.token);
                    localStorage.setItem("user", JSON.stringify(response?.data?.data));
                    jwtAuthAxios.defaults.headers.common["Authorization"] =
                        "Bearer " + response?.data?.token;

                    if (isRememberMe) {
                        localStorage.setItem('rememberedUsername', input.name);
                        localStorage.setItem('rememberedPassword', input.password);
                        localStorage.setItem('rememberMeChecked', 'true');
                    } else {
                        localStorage.removeItem('rememberedUsername');
                        localStorage.removeItem('rememberedPassword');
                        localStorage.removeItem('rememberMeChecked');
                    }

                    setToastMessage(response?.data?.message);
                    setShowToast(true);
                    // history.push("/home");
                    window.location.href = '/home';
                    handleClosep();
                }
     
        } catch (error) {
            console.error(error?.response?.data || "Invalid ");
            setToastMessage(error.response.data)
            // setToastMessage('User not found.');
            setShowToast(true);

        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prevInput) => ({ ...prevInput, [name]: value }));
    };

    const handleItemClick = () => {
        history.push(
            window.location.href = '/forgets'
        );
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('rememberedUsername');
        const storedPassword = localStorage.getItem('rememberedPassword');
        const rememberMeChecked = localStorage.getItem('rememberMeChecked') === 'true'; // Get the boolean value

        if (storedUsername && storedPassword && rememberMeChecked) {
            setInput(prevState => ({
                ...prevState,
                name: storedUsername,
                password: storedPassword
            }));
            setIsRememberMe(true);
        }
    }, []);

    return (
        <>
            <IonPage>
            <IonContent className="no-scroll-content">
                <div className='main-bg' style={{ width: '100%', height: '100%', marginTop:'30px' }}>
                    <img
                        className='freem253'
                        src="/img/logoa12.png"
                        
                    ></img>
                    {/* <div style={{ width: '100%', height: '30px', background: '#4c3226', position: 'absolute', left: ' 0', top: '50px' }}></div> */}
                    <img
                        className='freemlogin1'
                        src="/img/freemlogin.svg"
                    ></img>
                    {/* <IonImg
                        className='freem3'
                        src="src/img/bg-d.svg"
                    ></IonImg> */}
                    <div className='user-img'>
                        <IonImg
                            className='freemlogin2'
                            src="/img/userlogo.svg"
                        ></IonImg>
                        <div class="cell smaldesignleft" >
                            <div class="circle fade-in-left">
                                <img
                                    src="/img/leftdesign.svg"
                                ></img>
                            </div>
                        </div>
                        <div class="cell smaldesignright">
                            <div class="circle fade-in-left">
                                <img
                                    src="/img/rightdesign.svg"
                                ></img>
                            </div>
                        </div>

                    </div>
                    <IonGrid>
                        <IonRow className='loginrow1'>
                            <IonCol size-lg='10' size-md='10' size-sm='8' size='12'>
                                <form className='form-details' color='secondary' onSubmit={handleSubmit}>
                                    
                                        <div className='loginrow' >
                                        <div style={{ display: 'flex' }}>
                                                <button
                                                    style={{ border: '1px solid #4c3226ab', borderRight: "0", padding: '10px', marginRight: '0px', marginBottom: "12px" }}
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    color='#4c3226'
                                                >

                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4c3226cc" class="bi bi-person" viewBox="0 0 16 16">
                                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                                    </svg>
                                                </button>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter Username or Phone No or Email"
                                                    style={{ background: '#ffdeb300', color: '#000', width: '95%', border: '1px solid #4c3226ab', marginBottom: '12px', padding: '8px' }}
                                                    value={input.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <button
                                                    style={{ border: '1px solid #4c3226ab', borderRight: "0", padding: '10px', marginRight: '0px' }}
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    color='#4c3226'
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ?
                                                        < >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4c3226cc" class="bi bi-eye-slash" viewBox="0 0 16 16">
                                                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                                            </svg>
                                                        </> :
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#4c3226cc" class="bi bi-eye" viewBox="0 0 16 16">
                                                                <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                                                                <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                                                                <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                                                            </svg>
                                                        </>}
                                                </button>
                                                <input
                                                    name='password'
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter Password"
                                                    style={{ background: '#ffdeb300', color: '#000', width: '100%', padding: '8px', border: '1px solid #4c3226ab' }}
                                                    slot="start"
                                                    value={input.password}
                                                    onChange={handleChange}
                                                    required
                                                />

                                            </div>
                                            {/* 
                                            <IonCol size='12'>
                                                <IonRow >
                                                    <IonCol size='6' style={{ display: 'flex' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isRememberMe}
                                                            onChange={() => setIsRememberMe(!isRememberMe)}
                                                        />
                                                        <span style={{ marginLeft: '5px', fontSize: '14px', color: 'rgb(76 50 38)' }}>
                                                            <label>Remember Me</label>
                                                        </span>
                                                    </IonCol>
                                                    <IonCol size='6' className="col-6 " style={{ textAlign: 'end' }}>
                                                        <span onClick={() => handleItemClick()} style={{ cursor: "pointer", fontSize: '14px', color: '#bc7700' }}>
                                                            Forget Password ?
                                                        </span>
                                                    </IonCol>
                                                </IonRow>
                                            </IonCol> */}
                                            <div className="checkbox-container">
                                                <IonCol size='12'>
                                                    <IonRow >
                                                    <IonCol size='12'>
                                                <IonRow>
                                                    <IonCol size='6' style={{ display: 'flex' }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isRememberMe}
                                                            onChange={() => setIsRememberMe(!isRememberMe)}
                                                            style={{width:'10%', marginTop:'-8px'}}
                                                        />
                                                        <span style={{ marginLeft: '5px', marginTop:'-9px', fontSize: '14px', color: 'rgb(76 50 38)' }}>
                                                            <label>Remember Me</label>
                                                        </span>
                                                    </IonCol>
                                                    <IonCol size='6' className="col-6 " style={{ textAlign: 'end',margin:'-7px 0px 0px 0px'}}>
                                                        <span onClick={() => handleItemClick()} style={{ cursor: "pointer", fontSize: '14px', color: '#bc7700' }}>
                                                            Forgot Password ?
                                                        </span>
                                                    </IonCol>
                                                </IonRow>
                                            </IonCol>
                                                    </IonRow>
                                                </IonCol>
                                            </div>
                                            <IonButton
                                                color='secondary'
                                                type='submit'
                                                className='submit-button'
                                                expand="full"
                                                style={{ marginTop: '10px', width: '100%', textTransform: 'uppercase', letterSpacing: '1.1px' }}
                                                disabled={loading}
                                            >
                                                {loading ? 'Logging in...' : 'Login'}
                                            </IonButton>
                                        
                                        </div>
                                    
                                </form>
                                <div style={{ width: '100%', display: 'flex', margin: 'auto', flexDirection: 'column', textAlign: 'center', fontSize: '14px' }}>
                                   
                                        <div style={{ justifyContent: 'center', display: 'flex', marginTop: '10px' }}>
                                            Don't have an account ? {" "}
                                            <span onClick={() => window.location.href="/register"} style={{ cursor: "pointer", color: '#bc7700', marginLeft: '5px' }}>
                                                Register here
                                            </span>
                                        </div>
                                
                                        {/* <div style={{ justifyContent: 'center', display: 'flex', marginTop: '10px' }}>
                                            Already have an account?{" "}
                                            <span onClick={() => setIsLogin(true)} style={{ cursor: "pointer", color: '#bc7700', marginLeft: '5px' }}>
                                                Login here
                                            </span>
                                        </div> */}
                                   
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
                </IonContent>
            </IonPage>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            />
        </>
    );
}

export default Login;
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
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
      const [emailError, setEmailError] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };
    const handleFocus = (e) => {
        setTimeout(() => {
          e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 400); // slight delay for keyboard open
      };
      

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setLoading(true);

        console.log(input)

        try {
            
                const response = await jwtAuthAxios.post("client/register", input);
                if (response.status === 200) {

                    setInput({
                        name: input.name,
                        password: input.password,
                    });
                    setIsLogin(true);
                    setToastMessage('Register Successful');
                    setShowToast(true);
                }
            
        } catch (error) {
            console.error(error?.response?.data || "Invalid ");
            setToastMessage(error?.response?.data)
            // setToastMessage('User not found.');
            setShowToast(true);

        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prevInput) => ({ ...prevInput, [name]: value }));
        if (name === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              setEmailError("Please enter a valid email address.");
            } else {
              setEmailError("");
            }
          }
    };


    return (
        <>
            <IonPage>
                
                <div className='main-bg' style={{    width: '100%',
                        height: '100vh',
                        marginTop: '-10px',
                        overflowY: 'auto',
                        WebkitOverflowScrolling: 'touch' }}>
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
                        <div class="cell smaldesignleft">
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
                   
                        <IonRow className='loginrow' >
                            <IonCol size-md='6' size-sm='8' size='12'>
                                <form className='form-details' color='secondary' onSubmit={handleSubmit}>
                                
                                        
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
                                                    name="name"
                                                    placeholder="Enter Username"
                                                    style={{ background: '#ffdeb300', color: '#000', width: '95%', border: '1px solid #4c3226ab', marginBottom: '12px', padding: '8px' }}
                                                    value={input.name}
                                                    onChange={handleChange}
                                                    required
                                                    onFocus={handleFocus}
                                                />

                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
  <button
    style={{
      border: '1px solid #4c3226ab',
      borderRight: "0",
      padding: '10px',
      marginRight: '0px',
      marginBottom: "12px"
    }}
    className="btn btn-outline-secondary"
    type="button"
    color='#4c3226'
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4c3226cc" className="bi bi-envelope" viewBox="0 0 16 16">
      <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
    </svg>
  </button>
  <input
    name="email"
    type="email"
    placeholder="Enter Email"
    style={{
      background: '#ffdeb300',
      color: '#000',
      width: '100%',
      border: '1px solid #4c3226ab',
      marginBottom: '12px',
      padding: '8px'
    }}
    value={input.email || ''}
    onChange={handleChange}
    required
    onFocus={handleFocus}
  />
</div>
{/* Error message outside the flex row */}
{emailError && (
  <p style={{ color: 'red', fontSize: '0.8em', marginTop: '-8px', marginBottom: '12px' }}>
    {emailError}
  </p>
)}

                                            <div style={{ display: 'flex' }}>
                                                <button
                                                    style={{ border: '1px solid #4c3226ab', borderRight: "0", padding: '10px', marginRight: '0px', marginBottom: "12px" }}
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    color='#4c3226'
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4c3226cc" class="bi bi-telephone" viewBox="0 0 16 16">
                                                        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" />
                                                    </svg>
                                                </button>
                                                <input
                                                    name='mobileNo'
                                                    type="tel"
                                                    placeholder="Enter Mobile NO"
                                                    style={{ background: '#ffdeb300', color: '#000', width: '95%', border: '1px solid #4c3226ab', marginBottom: '12px', padding: '8px' }}
                                                    value={input.mobileNo || ''}
                                                    onChange={handleChange}
                                                    required
                                                    onFocus={handleFocus}
                                                />

                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <button
                                                    style={{ border: '1px solid #4c3226ab', borderRight: "0", padding: '10px', marginRight: '0px', marginBottom: "12px" }}
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    color='#4c3226'
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#4c3226cc" class="bi bi-buildings" viewBox="0 0 16 16">
                                                        <path d="M14.763.075A.5.5 0 0 1 15 .5v15a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V14h-1v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V10a.5.5 0 0 1 .342-.474L6 7.64V4.5a.5.5 0 0 1 .276-.447l8-4a.5.5 0 0 1 .487.022M6 8.694 1 10.36V15h5zM7 15h2v-1.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5V15h2V1.309l-7 3.5z" />
                                                        <path d="M2 11h1v1H2zm2 0h1v1H4zm-2 2h1v1H2zm2 0h1v1H4zm4-4h1v1H8zm2 0h1v1h-1zm-2 2h1v1H8zm2 0h1v1h-1zm2-2h1v1h-1zm0 2h1v1h-1zM8 7h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zM8 5h1v1H8zm2 0h1v1h-1zm2 0h1v1h-1zm0-2h1v1h-1z" />
                                                    </svg>
                                                </button>
                                                <input
                                                    name='company'
                                                    placeholder="Enter Business Name"
                                                    style={{ background: '#ffdeb300', color: '#000', width: '95%', border: '1px solid #4c3226ab', marginBottom: '12px', padding: '8px' }}
                                                    value={input.company || ''}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                />

                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <button
                                                    style={{ border: '1px solid #4c3226ab', borderRight: "0", padding: '10px', marginRight: '0px', marginBottom: "12px" }}
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    color='#4c3226'
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" ffill="#4c3226cc" class="bi bi-person-add" viewBox="0 0 16 16">
                                                        <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
                                                        <path d="M8.256 14a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z" />
                                                    </svg>
                                                </button>
                                                <input
                                                    name='refrence'
                                                    placeholder="Enter Refrence Name"
                                                    style={{ background: '#ffdeb300', color: '#000', width: '95%', border: '1px solid #4c3226ab', marginBottom: '12px', padding: '8px' }}
                                                    value={input.refrence || ''}
                                                    onChange={handleChange}
                                                    onFocus={handleFocus}
                                                />
                                            </div>
                                            <div style={{ display: 'flex' }}>
                                                <button
                                                    style={{ border: '1px solid #4c3226ab', borderRight: "0", padding: '10px', marginRight: '0px' }}
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    color='#4c3226'
                                                    onClick={togglePasswordVisibility}
                                                    onFocus={handleFocus}
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
                                                    value={input.password}
                                                    onFocus={handleFocus}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <IonButton color='secondary' type='submit' expand="full" style={{ marginTop: '20px', width: '95%', textTransform: 'uppercase' }}>Register</IonButton>
                                  
                                
                                </form>
                                <div style={{ width: '100%', display: 'flex', margin: 'auto', flexDirection: 'column', textAlign: 'center', fontSize: '14px' }}>
                                    
                                        {/* <div style={{ justifyContent: 'center', display: 'flex', marginTop: '10px' }}>
                                            Don't have an account ? {" "}
                                            <span onClick={() => setIsLogin(false)} style={{ cursor: "pointer", color: '#bc7700', marginLeft: '5px' }}>
                                                Register here
                                            </span>
                                        </div> */}
                                  
                                        <div style={{ justifyContent: 'center', display: 'flex', marginTop: '10px' }}>
                                            Already have an account?{" "}
                                            <span onClick={() => window.location.href='/login'} style={{ cursor: "pointer", color: '#bc7700', marginLeft: '5px' }}>
                                                Login here
                                            </span>
                                        </div>
                           
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
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
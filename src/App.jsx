import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonMenu,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonImg,
  IonMenuButton,
  IonBackButton,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonInput,
  IonToast,
  useIonRouter,
  IonApp,
  IonPage,
} from '@ionic/react';
import { IonMenuToggle } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import HomePage from './pages/home';
import AddtocardPage from './pages/addtocard';
import Login from './pages/login';
import Register from './pages/register';
import Forgets from './pages/Forget';
import Productpage from './pages/product';
import Registerhere from './pages/registerhere';
import Category from './pages/category';
import PrivacyPolicy from './pages/privacypolicy';
import WishlistPage from './pages/wishlist';
import SearchPage from './pages/searchbar';
import Thanks from './pages/thanks';
import Myquotations from './pages/myquotations';
import Myquotationsview from './pages/myquotationsview';
import Videojewal from './pages/videojewal';
import Videoshow from './pages/videoshow';
import Ccategorypage from './pages/c-category';
import Head from './pages/head';
import './pages/Tab1.css';
import { IMG_PATH } from "./config";
import jwtAuthAxios from "./service/jwtAuth";
import DataProvider from "./context/DataProvider"
import { addToCart } from "./store/actions";
import { useDispatch } from "react-redux";
import useAuthInterceptor from "./service/useAuthInterceptor";
import samplePDF1 from "../public/footer/size.pdf";
import samplePDF2 from "../public/footer/finding.pdf";
import NotFound from './pages/NotFound';
import { person } from "ionicons/icons";
import { AccountDelete } from './pages/accountdelete';
import Sidebar from './pages/sidebar';

function Apps() {
  const history = useHistory();

  const [showDropdown, setShowDropdown] = useState(false);
  const [homeDetails, setHomeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    username: "",
    mobileNumber: "",
    email: "",
    reference: "",
    company: ""
  });
  const [mobileNo, setMobileNo] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [refrence, setRefrence] = useState();
  const [company, setCompany] = useState();

  let user = JSON.parse(localStorage.getItem("user"));
  let userId = JSON.parse(localStorage.getItem("user"))?._id;
  const [validated, setValidated] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity()) {
      try {
        const response = await jwtAuthAxios.patch(`master/user/${userId}`, {
          username,
          mobileNo,
          email,
          refrence,
          company
        });
        setToastMessage('Profile Update Successfully');
        setShowToast(true);
        localStorage.setItem("user", JSON.stringify(response?.data));
        window.dispatchEvent(new Event("storage"));
        setShowModal(false);
      } catch (error) {
        console.error(error?.response?.data?.error);
      }
    }

    setValidated(true);
  };

  useEffect(() => {
    setForm({
      mobileNo: user?.mobileNo,
      company: user?.company,
      reference: user?.reference,
      email: user?.email,
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu')) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const handleChangePhone = (event) => {
    setMobileNo(event.target.value);
  };

  const handleChangeemail = (event) => {
    setEmail(event.target.value);
  };

  const handleChangrefrence = (event) => {
    setRefrence(event.target.value);
  };

  const handleChangcompany = (event) => {
    setCompany(event.target.value);
  };

  const openModal = () => {
    setShowDropdown(false);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handledelete = () => {
    window.location.href = '/deleteaccount';
  }

  const isAuthenticatedR = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return !!token;
  };

  const [isAuthenticated, setIsAuthenticated] = useState(isAuthenticatedR());

  const LogOutHandler = () => {
    const rememberMeChecked = localStorage.getItem('rememberMeChecked') === 'true';
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    if (rememberMeChecked) {
      // Keep remembered credentials
    } else {
      localStorage.removeItem('rememberedUsername');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('rememberMeChecked');
      localStorage.removeItem('user')
    }

    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(addToCart());
    }
  }, [dispatch, isAuthenticated]);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const response = await jwtAuthAxios.get(`client/dashboard`);
      setHomeDetails(response?.data?.data?.sec[0]?.data || []);
    } catch (error) {
      console?.error("Error fetching home data:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (e) => {
    e?.stopPropagation();
    setUsername(user?.username);
    setMobileNo(user?.mobileNo);
    setEmail(user?.email);
    setRefrence(user?.refrence);
    setCompany(user?.company);
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  useEffect(() => {
    setIsAuthenticated(isAuthenticatedR());
  }, []);

  const hideTabBarRoutes = ['/login', '/registerhere', '/video', '/videoshow/:id', '/forgets','/register'];

  return (
    <IonApp>
      <IonReactRouter>
        <DataProvider>
          <IonTabs id="main-content">
            <IonRouterOutlet>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
              <Route path="/register" component={Register} exact={true} />

              <Route
                path="/login"
                render={() => (isAuthenticated ? <Redirect to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />)}
                exact={true}
              />
              
              {/* <Route path="/home" render={() => (
                      <HomePage />
              )} exact={true} /> */}

              <Route path="/home" render={() => (
                isAuthenticated ? <HomePage /> : <Redirect to="/login" />
              )} exact={true} />
              
              <Route path="/c-category/:id" render={() => (
                isAuthenticated ? <Ccategorypage /> : <Redirect to="/login" />
              )} exact={true} />
              
              <Route path="/category/:id" render={() => (
                isAuthenticated ? <Category /> : <Redirect to="/login" />
              )} exact={true} />
              
              <Route path="/addtocard" render={() => (
                isAuthenticated ? <AddtocardPage /> : <Redirect to="/login" />
              )} exact={true} />
              
              <Route path="/wishlist" render={() => (
                isAuthenticated ? <WishlistPage /> : <Redirect to="/login" />
              )} exact={true} />
              
              <Route path="/myquotations" render={() => (
                isAuthenticated ? <Myquotations /> : <Redirect to="/login" />
              )} exact={true} />

              <Route path="/myquotationsview/:id" render={() => (
                isAuthenticated ? <Myquotationsview /> : <Redirect to="/login" />
              )} exact={true} />

              <Route path="/privacypolicy" render={() => (
                isAuthenticated ? <PrivacyPolicy /> : <Redirect to="/login" />
              )} exact={true} />

              <Route path="/search" render={() => (
                isAuthenticated ? <SearchPage /> : <Redirect to="/login" />
              )} exact={true} />

              <Route path="/product/:id" render={() => (
                isAuthenticated ? <Productpage /> : <Redirect to="/login" />
              )} exact={true} />

              <Route path="/head" render={() => (
                isAuthenticated ? <Head /> : <Redirect to="/login" />
              )} exact={true} />

              <Route path="/thanks" render={() => (
                isAuthenticated ? <Thanks /> : <Redirect to="/login" />
              )} exact={true} />

              <Route path="/video" render={() => (
                isAuthenticated ? <Videojewal /> : <Redirect to="/login" />
              )} exact={true} />

              <Route path="/videoshow/:id" render={() => (
                isAuthenticated ? <Videoshow /> : <Redirect to="/login" />
              )} exact={true} />

              <Route path="/deleteaccount" render={() => (
                isAuthenticated ? <AccountDelete /> : <Redirect to="/login" />
              )} exact={true} />

              {/* Public routes */}
              <Route path="/forgets" component={Forgets} exact={true} />
              <Route path="/registerhere" component={Registerhere} exact={true} />

              <Route component={NotFound} />
            </IonRouterOutlet>
          </IonTabs>
        </DataProvider>
    

      {!hideTabBarRoutes.includes(window.location.pathname) && (
        <IonHeader>
          <IonToolbar style={{ background: '#a97550' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', background: '#fff6ec' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <button onClick={toggleDropdown} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
                  <IonImg
                    slot="start"
                    src="/img/user.png"
                    style={{ height: '30px', margin: '0' }}
                  />
                </button>
              </div>
                <IonImg
                  slot="start"
                  src="/img/logo.svg"
                  style={{ height: '30px', margin: '0', marginLeft: '0px' }}
                />
              </div>
              <IonMenuButton fill='clear' autoHide={false} />

             
            </div>
          </IonToolbar>
        </IonHeader>
      )}
      
      {!hideTabBarRoutes.includes(window.location.pathname) && (
        <>
          {showDropdown && (
            <div className='dropdown-menu' style={{ position: 'absolute', left: '9px', top: '55px', border: '1px solid #ccc', zIndex: 1000 }}>
              <div className="profile">
                <h6 className="text-center mt-2">{username}</h6>
                <span className="email">{mobileNo}</span>
              </div>

              <a style={{ cursor: 'pointer' }} onClick={openModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"></path></svg>
                My Profile</a>
              <a style={{ cursor: 'pointer' , textDecoration:'none' }} href='/myquotations'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-blockquote-right" viewBox="0 0 16 16"><path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1zm10.113-5.373a7 7 0 0 0-.445-.275l.21-.352q.183.111.452.287.27.176.51.428.234.246.398.562.164.31.164.692 0 .54-.216.873-.217.328-.721.328-.322 0-.504-.211a.7.7 0 0 1-.188-.463q0-.345.211-.521.205-.182.569-.182h.281a1.7 1.7 0 0 0-.123-.498 1.4 1.4 0 0 0-.252-.37 2 2 0 0 0-.346-.298m-2.168 0A7 7 0 0 0 10 6.352L10.21 6q.183.111.452.287.27.176.51.428.234.246.398.562.164.31.164.692 0 .54-.216.873-.217.328-.721.328-.322 0-.504-.211a.7.7 0 0 1-.188-.463q0-.345.211-.521.206-.182.569-.182h.281a1.8 1.8 0 0 0-.117-.492 1.4 1.4 0 0 0-.258-.375 2 2 0 0 0-.346-.3z"></path></svg>
                My Quotation</a>
              <a style={{ cursor: 'pointer' , textDecoration:'none' }} href='/video'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-reels" viewBox="0 0 16 16">
                  <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
                  <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm6 8.73V7.27l-3.5 1.555v4.35zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1" />
                  <path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6M7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                </svg>
                Exclusive Jewellery</a>
              <a style={{ cursor: 'pointer' , textDecoration:'none' }} href="https://craft.greenlabjewels.com/" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-boxes" viewBox="0 0 16 16">
                  <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z" />
                </svg>
                Live Stock</a>
              <a style={{ cursor: 'pointer' }} onClick={LogOutHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-left" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"></path><path fill-rule="evenodd" d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z"></path></svg>
                Logout</a>
            </div>
          )}
          
          <IonMenu contentId="main-content" side="end">
            <IonHeader>
              <IonToolbar color="secondary">
                <div style={{ display: 'flex', alignItems: 'center' }} slot="start">
                  <IonImg
                    src="/img/min-logo.svg"
                    style={{
                      width: 'auto',  
                      height: '35px',
                      marginLeft: '20px',
                      filter: 'invert(1)',
                      display: 'inline-block', 
                    }}
                  />
                </div>
                <div slot='end'>
                  <IonMenuToggle>
                    <IonButton fill="clear">
                      <ion-icon name="close-outline" size="large" style={{ color: 'white' }}></ion-icon>
                    </IonButton>
                  </IonMenuToggle>
                </div>
              </IonToolbar>
            </IonHeader>

            <Sidebar loading={loading} homeDetails={homeDetails}/>
          </IonMenu>
          
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={2000}
          />
        </>
      )}

      {showModal && (
        <div className="modal1">
          <div className="modal2">
            <form onSubmit={handleSubmit}>
              <div className='user-img'>
                <IonImg
                  className='freemlogin2'
                  src="/img/userlogo.svg"
                ></IonImg>
                {/* <div class="cell smaldesignleft">
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
                      </div> */}
    
              </div>
              <IonItem>
                <IonInput type='text' label="Username : " placeholder=" Enter text " fill="clear"
                  color="secondary" value={username}
                  onBlur={handleChangeUsername}>
                </IonInput>
              </IonItem>
              <IonItem>
                <IonInput type='tel' label="Mobile No : " placeholder=" Enter number " fill="clear"
                  color="secondary" value={mobileNo}
                  onBlur={handleChangePhone}>
                </IonInput>
              </IonItem>
              <IonItem>
                <IonInput type='text' label="Email : " placeholder=" Enter Email " fill="clear"
                  color="secondary" value={email}
                  onBlur={handleChangeemail}>
                </IonInput>
              </IonItem>
              <IonItem>
                <IonInput type='text' label="Refrence Name : " placeholder="Enter Refrence " fill="clear"
                  color="secondary" value={refrence}
                  onBlur={handleChangrefrence}>
                </IonInput>
              </IonItem>
              <IonItem>
                <IonInput type='text' label="Company Name : " placeholder="Enter Company " fill="clear"
                  color="secondary" value={company}
                  onBlur={handleChangcompany}>
                </IonInput>
              </IonItem>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* <ion-router-link href="/deleteaccount" target="_blank"> */}
                      <IonButton onClick={handledelete} style={{ width: '100%', margin: '15px 0 0 0', background: '#f3a41c' }} expand="full">Account delete</IonButton>
                  {/* </ion-router-link> */}
                <IonButton type='submit' style={{ width: '100%', margin: '15px 0 0 0', background: '#f3a41c' }} expand="full">Save</IonButton>
                <IonButton onClick={closeModal} style={{ width: '100%', margin: '15px 0 0 0', background: '#f3a41c' }} expand="full">Close</IonButton>
              </div>
            </form>
          </div>
        </div>
        
      )}
        </IonReactRouter>

      </IonApp>
  );
}

export default Apps; 
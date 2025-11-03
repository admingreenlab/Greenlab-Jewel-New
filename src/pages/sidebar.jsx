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

import '../pages/Tab1.css';
import { IMG_PATH } from "../config";
import samplePDF1 from "../../public/footer/size.pdf";
import samplePDF2 from "../../public/footer/finding.pdf";
import { useHistory } from 'react-router-dom';


const Sidebar = ({homeDetails,loading}) =>{
        const history = useHistory();

    return(
        <IonContent class='main-saidebar'>
        <IonGrid style={{ marginTop: '6px' }}>
          <IonRow>
            <IonCol>
              <div className='bottom-footer-menu' style={{ marginBottom: '10px', fontSize: '18px' }}>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>- category</span>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            {loading ? (
              <IonCol><p>Loading...</p></IonCol>
            ) : (
              homeDetails.length > 0 ? (
                homeDetails.map((item) => (
                  <IonCol size="4" key={item._id}>
                    <a onClick={() => history.push(`/category/${item._id}`)} style={{ textDecoration: 'none', cursor: 'pointer' }}>
                      <div className='main-categoryimg'>
                        <IonImg className='categoryimg' src={IMG_PATH + item?.filepath} />
                        <IonImg className='categoryimg1' src="/img/catagory-bg.png" />
                      </div>
                      <span style={{color:'black', display:'flex',justifyContent:'center' , fontSize:'12px', marginBottom:'10px'}}>{item?.name}</span>
                    </a>
                  </IonCol>
                ))
              ) : (
                <IonCol><p>No categories available.</p></IonCol>
              )
            )}
          </IonRow>
          <IonRow>
            <IonCol>
              <div style={{ marginBottom: '10px', marginTop: '7px' }} className='bottom-footer-menu '>
                <div style={{ marginBottom: '10px', fontSize: '18px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>- About</span>
                </div>
                <a onClick={() => history.push('/privacypolicy')} style={{ cursor: 'pointer' }}>
                  <div className='d-flex' style={{ gap: '10px', marginBottom: '7px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-shield-lock" viewBox="0 0 16 16">
                      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
                      <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415" />
                    </svg>
                    <span>Privacy Policy</span>
                  </div>
                </a>

                <a href="https://master.greenlabjewels.com/footer/size.pdf" target="_blank" rel="noopener noreferrer">
                  <div className='d-flex' style={{ gap: '10px', marginBottom: '7px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-aspect-ratio" viewBox="0 0 16 16">
                      <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5z" />
                      <path d="M2 4.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H3v2.5a.5.5 0 0 1-1 0zm12 7a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H13V8.5a.5.5 0 0 1 1 0z" />
                    </svg>
                    <span style={{ color: "#f3a41c" }}>Size</span>
                  </div>
                </a>
                <a href="https://master.greenlabjewels.com/footer/finding.pdf" target="_blank" rel="noopener noreferrer">
                  <div className='d-flex' style={{ gap: '10px', marginBottom: '7px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-infinity" viewBox="0 0 16 16">
                      <path d="M5.68 5.792 7.345 7.75 5.681 9.708a2.75 2.75 0 1 1 0-3.916ZM8 6.978 6.416 5.113l-.014-.015a3.75 3.75 0 1 0 0 5.304l.014-.015L8 8.522l1.584 1.865.014.015a3.75 3.75 0 1 0 0-5.304l-.014.015zm.656.772 1.663-1.958a2.75 2.75 0 1 1 0 3.916z" />
                    </svg>
                    <span style={{ color: "#f3a41c" }}>Finding</span>
                  </div>
                </a>
              </div>
              <div style={{ marginBottom: '10px', }} className='bottom-footer-menu '>
                <div style={{ marginBottom: '10px', fontSize: '18px' }}>
                  <span style={{ fontSize: '16px', fontWeight: '600' }}>- Address</span>
                </div>
                <div className='d-flex' style={{ gap: '10px', marginBottom: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-geo-alt" viewBox="0 0 16 16">
                    <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                    <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                  </svg>
                  <span>Plot No. B-05 & B-06/2,
                  3rd Floor, Greenlab Diamonds LLP,
                  Gujarat Hira Bourse, Hajira Road,
                  Ichhapore, Surat – 394510
                  </span>
                </div>
                <div className='d-flex' style={{ gap: '10px', marginBottom: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#4c3226" class="bi bi-envelope" viewBox="0 0 16 16">
                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                  </svg>
                  <span>sales@greenlabjewels.com</span>
                </div>
              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    )
}

export default Sidebar; 
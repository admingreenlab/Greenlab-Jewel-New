import React from 'react';
import {
    IonPage,
    IonFooter,
    IonRouterLink
} from '@ionic/react';
import { useLocation } from "react-router-dom";

const Videoshow = () => {

    const location = useLocation();
    const rowData = location?.state?.rowData;
   // console.log('rowData',location.state.rowData)
  
    if (!rowData) {
        return <div>No video data available.</div>; 
    }

    return (
        <IonPage>
            <div>
            <div style={{ position: 'fixed', top: '60px',left: '20px', zIndex: 1000 }}>
  <IonRouterLink href="/video" style={{ textDecoration: 'none' }}>
    <div
      style={{
        background: '#ffe6c4', // blue background
        padding: '8px 14px',
        borderRadius: '25px', // pill shape
        display: 'flex',
        alignItems: 'center',
        gap: '8px', // space between icon and text
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        cursor: 'pointer',
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="#000" // white icon
        className="bi bi-house-door"
        viewBox="0 0 16 16"
      >
        <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
      </svg>
      <span style={{ color: '#000', fontWeight: '600', fontSize: '16px' }}>Home</span>
    </div>
  </IonRouterLink>
</div>

                <div style={{ background: "black", height: "100vh", paddingTop: '150px' }}>
                    <iframe
                        width="100%"
                        height='700px'
                        src={rowData?.filepath}
                        title="Video Player"
                        scrolling="no"
                        allowFullScreen
                        style={{ borderRadius: '10px' }}
                    ></iframe>
                </div>
                
                <div className='min-tiop text-center'  >
            <h5 style={{color: '#c0629a', textAlign:'center',marginTop:'150px'}}>{rowData?.name}</h5>
            <div className='min-tiop1'>
            <p class="videotip">Dia pcs: <span>{rowData?.diapcs}</span></p>
            <p class="videotip">Dia wt: <span>{rowData?.diawt}</span></p>
            <p class="videotip">Net wt: <span>{rowData?.netwt?.toFixed(2)}</span></p>
            </div>
          </div>
            </div>
        </IonPage >
    );
};

export default Videoshow;
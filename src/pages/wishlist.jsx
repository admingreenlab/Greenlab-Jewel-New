import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonItem,
  IonList,
  IonThumbnail,
  IonButton,
  IonCardTitle,
  IonToast
} from '@ionic/react';
import '../pages/Tab1.css';
import '../main';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import Header from './head';
import { IonTextarea } from '@ionic/react'; import { useParams } from "react-router-dom";
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { DataContext } from "../context/DataProvider";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const [counter, setCounter] = useState(0);
  const { wishData, setWishData } = useContext(DataContext);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const incrementCounter = () => setCounter(counter + 1);
  const decrementCounter = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  const handleRemove = (id) => {
    try {
      const item = wishData?.filter((item) => item._id !== id);
      setWishData(item);
      setToastMessage('Item Remove');
      setShowToast(true);
    }
    catch (error) {
      toast.error(error?.response?.data?.error);
    }
  };


  const handleView = (data) => {
    window.location.href=`/product/${data?._id}`;
  };


  return (
    <>
      <IonHeader>
        <h1>home</h1>
      </IonHeader>
      <Header />
      <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px' }}>
        <h4 className="text-center mb-5 element" style={{ marginTop: '80px' }}>Your Wishlist</h4>
        <div style={{ paddingBottom: '80x', marginBottom: '100px', position: 'relative' }}>

          {wishData?.length > 0 ? (
            wishData.map((item, i) => {
              return (
                <div style={{ padding: ' 0', border: '1px solid rgb(0 0 0 / 19%)', margin: '10px', borderRadius: '9px', background: '#fff' }}>
                  <IonGrid>
                    <IonRow>
                      <IonCol size='12' key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>
                          <IonThumbnail slot="start">
                            <img alt="Silhouette of mountains" src={IMG_PATH + item?.thumbnailImage} />
                          </IonThumbnail>
                          <IonCardTitle style={{ color: 'black', justifyContent: 'center',textTransform: 'uppercase', display: 'flex', fontSize: '12px', marginRight: 'auto' }}>
                            {item?.description}
                          </IonCardTitle>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <IonButton shape='round' onClick={() => {
                              handleView(item);
                            }}>
                              <Ion-Icon slot="icon-only" size='small' name="eye-outline" style={{ color: 'green' }}></Ion-Icon>
                            </IonButton>
                            <IonButton shape='round' onClick={() => handleRemove(item?._id)}>
                              <Ion-Icon slot="icon-only" size='small' name="trash-outline" style={{ color: ' red' }}></Ion-Icon>
                            </IonButton>
                          </div>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
              <h3>No items in your wishlist</h3>

            </div>
          )}
        </div >
        <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            />  
      </IonContent >
    </>
  );
};

export default WishlistPage;

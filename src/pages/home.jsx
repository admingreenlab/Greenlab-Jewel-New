import React, { useEffect, useState } from 'react';
import { IonContent, IonImg, IonTitle, IonToolbar, IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import '../main';
import Header from './head';
import { IonButtons, IonButton, IonModal, IonHeader, IonPage } from '@ionic/react';
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import Head from './head';
const HomePage = () => {

  const [homeDetails, setHomeDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchHomeData = async () => {
    setLoading(true);
    try {
      const response = await jwtAuthAxios.get(`client/dashboard`);
      setHomeDetails(response?.data.data.sec[0].data);
      // console.log('Fetched data:', response?.data?.data.sec[0].data);
    } catch (error) {

      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <>
      <IonPage>
        <Head />

        <IonHeader>
          {/* <h1>home</h1> */}
        </IonHeader>
        <IonContent color="primary" >
          <IonGrid style={{ marginTop: '65px' }}>
            <IonRow>
              <IonCol>
                <Swiper style={{ marginBottom: '20px', marginTop: '10px' }}
                  spaceBetween={50}
                  slidesPerView={1}
                  onSlideChange={() => console.log('slide change')}
                  onSwiper={(swiper) => console.log(swiper)}
                  autoplay={true}
                >
                  <SwiperSlide>
                    <IonImg className='slider-img'
                      src="/img/slider-banner-1.jpg"
                      style={{ width: '100%', height: '235px', margin: '0', objectFit: 'cover',  borderRadius: '9px', overflow: 'hidden' }}
                    ></IonImg>
                  </SwiperSlide>
                  <SwiperSlide>
                    <IonImg
                      src="/img/slider-banner-2.jpg"
                      style={{ width: '100%', height: '235px', margin: '0', objectFit: 'cover',  borderRadius: '9px', overflow: 'hidden' }}
                    ></IonImg>
                  </SwiperSlide>
                  {/* <SwiperSlide>
                  <IonImg
                    src="/img/slider-banner-3.jpg"
                    style={{ width: '100%', height: '235px', margin: '0', objectFit: 'cover', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                  ></IonImg>
                </SwiperSlide> */}
                  <SwiperSlide>
                    <IonImg
                      src="/img/slider-banner-4.jpg"
                      style={{ width: '100%', height: '235px', margin: '0', objectFit: 'cover',  borderRadius: '9px', overflow: 'hidden' }}
                    ></IonImg>
                  </SwiperSlide>
                </Swiper>
              </IonCol>
            </IonRow>
          </IonGrid>
          <div>
            <h6 class="text-center mb-5 element">Categories at a Glance</h6>
            <IonGrid style={{ marginBottom: '100px', marginTop: '30px' }}>
              <IonRow>
                {homeDetails.map((item) => (
                  <IonCol size-lg="3" size-md="4" size-sm="4" size="4" key={item._id}>
                    <ion-router-link href={`/category/${item._id}`} style={{ textDecoration: 'none' }}>
                      <div className='main-categoryimg'>
                        <IonImg className='categoryimg' src={IMG_PATH + item?.filepath} />
                        <IonImg
                          className='categoryimg1'
                          src="/img/catagory-bg.png"
                        ></IonImg>
                      </div>
                      <IonTitle>{item.name}</IonTitle>
                    </ion-router-link>
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          </div>
        </IonContent >
      </IonPage>
    </>

  )
};

export default HomePage;
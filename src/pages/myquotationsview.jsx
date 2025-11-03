import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
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
    IonSelect,
    IonSelectOption,
    IonPopover,
    IonAccordion,
    IonAccordionGroup,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
    IonChip,
    IonicSlides,
    IonButtons,
    IonRefresher, IonRefresherContent,
} from '@ionic/react';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Header from './head';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import Like from '../pages/like';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper/modules';
import { IMG_PATH } from "../config";
import { chevronDownCircleOutline } from 'ionicons/icons';

function Product() {
    const [counter, setCounter] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Handle modal open and close
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const incrementCounter = () => setCounter(counter + 1);
    const decrementCounter = () => {
        if (counter > 0) {
            setCounter(counter - 1);
        }
    };
    const [openAccordion, setOpenAccordion] = useState('first');

    const toggleAccordion = (value) => {
        setOpenAccordion(openAccordion === value ? '' : value);
    };

    const location = useLocation();
    console.log(location.state)
    const { quotation } = location.state;


    const handleRefresh = async (event) => {

        setTimeout(() => {
            // Any calls to load data go here
            event.detail.complete();
        }, 1500); // Signal that the refresh is complete
    };


    return (
        <IonPage>
            <Header />
            <IonHeader>
                <h1>home</h1>
            </IonHeader>
            <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px', marginTop: '10px' }}>
                {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh} style={{ marginTop: '20px' }}>
                    <IonRefresherContent
                        pullingIcon={chevronDownCircleOutline}
                        refreshingSpinner="circles"
                    ></IonRefresherContent>
                </IonRefresher> */}
                <div style={{ marginTop: '80px', marginBottom: '10px' }}>
                    <h5 class="text-center mb-5 element">My Quotations View</h5>
                </div>
                <div className='myquotations'>
                    <IonGrid>
                        <IonRow>
                            <IonCol size='12' style={{ marginBottom: '60px' }}>
                                <IonAccordionGroup className='main-qustion main-qustion1'>
                                    {quotation.items.map((item, index) => (
                                        <IonAccordion key={item._id} value={`item-${index}`} eventKey={index + 1} style={{ marginTop: '5px' }}>
                                            <IonItem slot="header" color="secondary">
                                                <p>SKU : {item.item.sku}</p>
                                            </IonItem>
                                            <div className="ion-padding" slot="content" style={{ border: '2px solid #4c322659' }}>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Thumbnail
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            <IonImg
                                                                className='thummail'
                                                                src={IMG_PATH + item?.item?.thumbnailImage}
                                                            ></IonImg>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            SKU
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.item.sku}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Description
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.item.description}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            KT
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.KT}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Diamond Color/Clarity
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.item.diacolororclarity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Size
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.size}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Finding
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.finding}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Item Quantity
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Diamond Quantity
                                                        </h6>
                                                    </div>

                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.item.diaqty}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Total Weight
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.item.ctswts}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Message
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {item.message}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </IonAccordion>
                                    ))}
                                </IonAccordionGroup>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>

            </IonContent >

            </IonPage>
    );
}
export default Product; 
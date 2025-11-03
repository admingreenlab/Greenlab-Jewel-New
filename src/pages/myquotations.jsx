import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
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
import jwtAuthAxios from "../service/jwtAuth";
import { DataContext } from "../context/DataProvider";
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { chevronDownCircleOutline } from 'ionicons/icons';

function Product() {
    const [counter, setCounter] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

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

    useEffect(()=>{
        console.log('quotation',quotations, quotations.length)
    },[quotations])

        const fetchQuotations = async () => {
            try {
                setLoading(true);
                const response = await jwtAuthAxios.get('/client/clientquote');
                console.log('clientquote', response.data)
                if(response?.data?.status === "error"){
                    setQuotations([]);
                }else{
                setQuotations(response?.data?.quoteRequests?.map(quoteRequests => ({
                    id: quoteRequests._id,
                    date: quoteRequests.createdAt,
                    fullName: quoteRequests.userData.fullName,
                    email: quoteRequests.userData.email,
                    referenceName: quoteRequests.userData.referenceName,
                    companyName: quoteRequests.userData.companyName,
                    mobileNumber: quoteRequests.userData.mobileNumber,
                    status: quoteRequests.status,
                    items: quoteRequests.items,
                    quantity:
                        quoteRequests.items?.reduce(
                            (sum, item) => sum + (item.quantity || 0),
                            0
                        ) || 0,
                })));
            }
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error('Error details:', error);
            }
        };


    useEffect(() => {
        fetchQuotations();
    }, []);

    const handleViewQuotation = (quotation) => {
        history.push({
            pathname: `/myquotationsview/${quotation.id}`,
            state: { quotation }
        });
    };

    const handleRefresh = async (event) => {
        await fetchQuotations();
        setTimeout(() => {
            // Any calls to load data go here
            event.detail.complete();
        }, 1500); // Signal that the refresh is complete
    };

    const sortedQuotations = [...quotations]?.sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <>

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
                <div style={{ marginTop: '90px' }}>
                    <h5 class="text-center mb-5 element">My quotations</h5>
                </div>
                {
                    quotations?.length === 0 ? <p style={{color:'black' ,display:'flex',justifyContent:'center'}}>No quotation found</p> : 
                    <div className='myquotations'>
                    <IonGrid>
                        <IonRow style={{marginBottom:'60px'}}>
                            <IonCol>
                                {sortedQuotations.map((quotation) => (
                                    <IonAccordionGroup className='main-qustion' key={quotation.id} value={quotation.id} >
                                        <IonAccordion value="first" eventKey="1" style={{ marginTop: '10px' }}>
                                            <IonItem slot="header" color="secondary">
                                                <p>{moment(quotation.date).format('DD/MM/YY')}</p>
                                                <ion-router-link onClick={() => handleViewQuotation(quotation)}>
                                                    <IonButton fill='clear'>
                                                        <ion-icon slot="icon-only" name="eye-outline" style={{color:'#fff'}}></ion-icon>
                                                    </IonButton>
                                                </ion-router-link>
                                            </IonItem>
                                            <div className="ion-padding" slot="content" style={{border: '2px solid #4c322659' }}>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Date
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {moment(quotation.date).format('DD/MM/YY')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Full Name
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {quotation.fullName}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Email
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {quotation.email}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Reference Name
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {quotation.referenceName}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Mobile Number
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {quotation.mobileNumber}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Quantity
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {quotation.quantity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Company Name
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {quotation.companyName}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className='d-flex'>
                                                    <div className='left-hed'>
                                                        <h6>
                                                            Status
                                                        </h6>
                                                    </div>
                                                    <div className='right-hed'>
                                                        <span>
                                                            {quotation.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </IonAccordion>
                                    </IonAccordionGroup>
                                ))}
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
                }
                

            </IonContent >

        </ >
    );
}
export default Product;




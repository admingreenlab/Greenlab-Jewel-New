import React, { useRef, useEffect, useState, useContext } from 'react';
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
    IonToast,
    IonRefresher, IonRefresherContent,
} from '@ionic/react';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Header from './head';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import { useParams } from "react-router-dom";
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { DataContext } from "../context/DataProvider";
import { useSelector, useDispatch } from "react-redux";
import { IonIcon } from "@ionic/react";
import { heartOutline, heart } from "ionicons/icons";
import { addToCart, showCarts } from "../store/actions";
import { chevronDownCircleOutline } from 'ionicons/icons';
import { toast } from "react-toastify";

function CategoryPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [categoryDetails, setCategoryDetails] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const isFetching = useRef(false)
    const [selectedMetal, setSelectedMetal] = useState("");
    const { wishData, fetchWishlist, addToWishlist, removeFromWishlist } = useContext(DataContext);

    const [checkedItems, setCheckedItems] = useState({});
    const [liked, setLiked] = useState(false);
    const [cart, setCart] = useState([]);
    const [quotations, setQuotations] = useState([]);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');


    const fetchCategoryData = async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const response = await jwtAuthAxios.get(`client/citems?id=${id}`);
            const items = response?.data?.data;
            setCategoryDetails(items);
            const initialSelectedMetals = {};
            items.forEach(item => {
                initialSelectedMetals[item._id] = item.metalcolor; // Default to item's metal color
            });
            setSelectedMetal(initialSelectedMetals);

            setError(null);
        } catch (error) {
            toast.error(error?.response?.data?.error);
            setError('Failed to load category details. Please try again later.');
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };






    const handleAddToCart = async (item) => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);

        try {
            const selectedMetalForItem = selectedMetal[item._id] || item.metalcolor;

            const payload = {
                itemId: item._id,
                quantity: 1,
                metal: `${item.metal}-${selectedMetalForItem}-GOLD`.toUpperCase(),
                diamondQuality: 'DE VVS',
                colorstone: item.colorstone,
                size: item.size,
                itemtype: item.itemtype,
                message: item.message,
                findings: item.findings,
                diaqty: item.diaqty,
                sidectwt: item.sidectwt,
                centerctwt: item.centerctwt
            };

            const response = await jwtAuthAxios.post('/client/cart/add', payload);
            setCart([...cart, response.data]);
            dispatch(addToCart({ item: item._id, quantity: 1 }));
            setToastMessage('Item added to cart');
            setShowToast(true);
        } catch (error) {
            console.error(error || "Invalid ");
            setToastMessage('Error adding item to cart');
            setShowToast(true);
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };
    const user = JSON.parse(localStorage.getItem('user')); // stored user object
    const userId = user?._id;

    const handleItemCheckboxChange = async (itemId) => {
        const isInWishlist = checkedItems[itemId];
        try {
            if (isInWishlist) {
                await removeFromWishlist(itemId);
                setCheckedItems((prev) => {
                    const updated = { ...prev };
                    delete updated[itemId];
                    return updated;
                });
                await fetchWishlist(); // ✅ Refresh wishlist data from backend
            } else {
                await addToWishlist(itemId);
                setCheckedItems((prev) => ({ ...prev, [itemId]: true }));
                await fetchWishlist(); // optional, if you want to keep it fully synced
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
        }
    };

    // Sync checked state with wishlist data
    useEffect(() => {
        const newChecked = {};
        wishData?.forEach((item) => {
            newChecked[item._id] = true;
        });
        setCheckedItems(newChecked);
    }, [wishData]);


    useEffect(() => {
        if (id) {
            fetchCategoryData();
            handleAddToCart()
            fetchWishlist();
        }
    }, [id]);




    return (
        <IonPage>
            <IonHeader>
                <h1>home</h1>
            </IonHeader>
            <Header />

            <IonContent color="primary">
                {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent
                            pullingIcon={chevronDownCircleOutline}
                            refreshingSpinner="circles"
                        ></IonRefresherContent>
                    </IonRefresher> */}
                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <Swiper className='main-toslider' style={{ marginBottom: '20px', height: '200px' }}
                                spaceBetween={20}
                                slidesPerView={3}
                                breakpoints={{
                                    340: {
                                        slidesPerView: 3,
                                    },
                                    440: {
                                        slidesPerView: 3,
                                    },
                                    640: {
                                        slidesPerView: 3,
                                    },
                                    768: {
                                        slidesPerView: 4,
                                    },
                                    1024: {
                                        slidesPerView: 5,
                                    },
                                }}
                                onSlideChange={() => console.log('slide change')}
                                onSwiper={(swiper) => console.log(swiper)}
                                autoplay={true}
                            >
                                <SwiperSlide >
                                    <IonImg className='slider-img pulsating-circle'
                                        src="/img/big-banner1.png"
                                        style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                    ></IonImg>
                                </SwiperSlide>
                                <SwiperSlide >
                                    <IonImg
                                        src="/img/big-banner2.png"
                                        style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                    ></IonImg>
                                </SwiperSlide>
                                <SwiperSlide >
                                    <IonImg
                                        src="/img/big-banner3.png"
                                        style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                    ></IonImg>
                                </SwiperSlide>
                                <SwiperSlide >
                                    <IonImg
                                        src="/img/big-banner4.png"
                                        style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                    ></IonImg>
                                </SwiperSlide>

                                <SwiperSlide >
                                    <IonImg
                                        src="/img/big-banner2.png"
                                        style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                    ></IonImg>
                                </SwiperSlide>
                                <SwiperSlide >
                                    <IonImg
                                        src="/img/big-banner3.png"
                                        style={{ width: '100%', height: '100%', maxwidth: '180px', background: '#fff6ec', margin: '0', objectFit: 'contain', borderRadius: '9px', borderRadius: '9px', overflow: 'hidden' }}
                                    ></IonImg>
                                </SwiperSlide>
                            </Swiper>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <IonGrid>


                    <div>
                        <h5 class="text-center mb-5 element">Sub Category</h5>
                    </div>
                    <div className='main-catagory'>
                        <IonRow>
                            {/* <IonCol>
                                        <h6>Home - Ring - Category</h6>
                                    </IonCol> */}
                        </IonRow>
                        <IonRow>

                            {loading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p className="error-message">{error}</p>
                            ) : (
                                categoryDetails?.map(item =>
                                    <IonCol size-lg="3" size-md="4" size-sm="6" size="12">
                                        <div key={item._id} className='main-card-ctgy' style={{ marginBottom: '30px' }}>
                                            <ion-router-link href={`/product/${item?._id}`}>
                                                <div className='main-card-top'>
                                                    <img src={IMG_PATH + item?.thumbnailImage} alt="ig145" />
                                                    <span className='igsticky'>{item.sku}</span>
                                                </div>
                                            </ion-router-link>
                                            <div className='main-card-bottom'>
                                                <div>
                                                    <h5 style={{ textTransform: 'uppercase' }}>{item.description}</h5>
                                                </div>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <IonButton fill="clear" size="large" onClick={() => {
                                                        handleAddToCart(item);
                                                    }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" fill="#67686d" class="bi bi-cart3" viewBox="0 0 16 16">
                                                            <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                                                        </svg>
                                                    </IonButton>
                                                    <IonRadioGroup
                                                        value={selectedMetal[item._id]}
                                                        onIonChange={e =>
                                                            setSelectedMetal({
                                                                ...selectedMetal,
                                                                [item._id]: e.detail.value
                                                            })
                                                        }
                                                        style={{ display: 'flex', alignItems: 'center', gap: '15px' }}
                                                    >
                                                        <IonRadio className='pink' value="ROSE" />
                                                        <IonRadio className='silver' value="WHITE" />
                                                        <IonRadio className='yellow' value="YELLOW" />
                                                    </IonRadioGroup>
                                                    <IonButton
                                                        key={item._id}
                                                        color={checkedItems[item._id] ? "danger" : "medium"}
                                                        fill="clear"
                                                        onClick={() => handleItemCheckboxChange(item._id)}
                                                    >
                                                        <IonIcon
                                                            slot="icon-only"
                                                            size="large"
                                                            icon={checkedItems[item._id] ? heart : heartOutline}
                                                        />
                                                    </IonButton>
                                                </div>
                                            </div>
                                        </div>
                                    </IonCol>
                                )
                            )}
                        </IonRow>
                    </div>

                </IonGrid>
            </IonContent>
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            />
        </IonPage >
    );
}
export default CategoryPage; 
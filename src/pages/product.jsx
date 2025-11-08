import React, { useContext, useRef, useEffect, useState, useCallback } from 'react';
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
    IonToast,
    IonRefresher, IonRefresherContent,
    useIonRouter,
    IonBreadcrumbs,
    IonBreadcrumb,
} from '@ionic/react';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useDispatch, useSelector } from "react-redux";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import Like from '../pages/like';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import Header from './head';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import { Autoplay, Keyboard, Pagination, Scrollbar, Zoom, Navigation } from 'swiper/modules';
import { useParams } from "react-router-dom";
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { heartOutline, heart } from "ionicons/icons";
import { IonIcon } from "@ionic/react";
import { DataContext } from "../context/DataProvider";
import { updateToCart, addToCart, showCarts } from "../store/actions";
import { toast } from "react-toastify";
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import { FreeMode, Thumbs } from 'swiper/modules';
import { chevronDownCircleOutline } from 'ionicons/icons';

function Product() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [productDetails, setProductDetails] = useState([]);
    const isFetching = useRef(false)
    const [count, setCount] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [diamondGroup, setDiamondGroup] = useState([]);
    const {fetchWishlist, wishData, addToWishlist, removeFromWishlist } = useContext(DataContext);
    const [checkedItems, setCheckedItems] = useState({});
    const [liked, setLiked] = useState(false);
    const [sizeDetails, setSizeDetails] = useState([]);
    const [selectSize, setSelectSize] = useState(null);
    const [findings, setFindings] = useState([]);
    const [selectedFindings, setSelectedFindings] = useState('');
    const [cart, setCart] = useState([]);
    const [typeMessage, setTypeMessage] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [categoryattr, setCategoryattr] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    const ionRouter = useIonRouter();

    const openModal = (index) => {
        setActiveIndex(index); // Set active index based on clicked image
        setShowModal(true);    // Open modal
    };

    const closeModal = () => setShowModal(false);

    const incrementCounter = () => {
        if (count > 0) {
            setCount(count + 1);
        }
    };

    const decrementCounter = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    

    const fetchProductData = async () => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);
        try {
            const response = await jwtAuthAxios.get(`master/citems/${id}`);
            setProductDetails(response?.data?.item);
            setDiamondGroup(response?.data?.diamGroup?.data);
            setSelectSize(response?.data?.size?.sizes[0]?.size);
            setSizeDetails(response?.data?.size?.sizes);
            setFindings(response?.data?.size?.findings);
            setCategoryattr(response?.data?.categoryattr?.attr);
            setError(null);
        } catch (error) {
            setError('Failed to load category details. Please try again later.');
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };


    const handleAddToCart = async (e, id) => {
        if (isFetching.current) return;
        isFetching.current = true;
        try {
            let payload = {
                itemId: id,
                quantity: count,
                metal: `${selectedType}-${selectedMetal}-GOLD`,
                diamondQuality: selectedQuality,
                size: selectSize ? selectSize : sizeDetails?.[0]?.size,
                message: typeMessage,
                finding: selectedFindings,
                colorstone: colorstone,
                diaqty: diaqty,
                centerctwt: centerctwt,
                sidectwt: sidectwt

            };
            setToastMessage('Item added to cart');
            setShowToast(true);
            await jwtAuthAxios.post("client/cart/add", payload);
            dispatch(addToCart({ itemId: id, quantity: count }));

        } catch (error) {
            console.error(error?.response?.data?.error);
            setToastMessage('Error adding item to cart')
            setShowToast(true);
        }
        finally {
            setLoading(false);
            isFetching.current = false;
        }
    };



    const {
        _id,
        sku,
        name,
        description,
        category,
        collection,
        otherUploadImg,
        gramwt,
        diaqty,
        ctswts,
        diacolororclarity,
        metalType,
        metalcolor,
        price,
        metal,
        thumbnailImage,
        centerctwt,
        sidectwt,
        colorstone,
        wgt14k,
        wgt18k,
        pointer,
        itemsize,
        itemtype,
        attr,
        videopath
    } = productDetails;
    const [selectedMetal, setSelectedMetal] = useState(metalcolor);
    const [selectedQuality, setSelectedQuality] = useState(diamondGroup[0]);
    const [selectedType, setSelectedType] = useState("14K");
    const [otherImg, setOtherImg] = useState(null);

    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        if (metalcolor) {
            setSelectedMetal(metalcolor?.toUpperCase());
        }
    }, [metalcolor]);

    useEffect(() => {
        if (diamondGroup) {
            setSelectedQuality(diamondGroup[0]);
        }
    }, [diamondGroup]);


    const handleSizeChange = (e) => {
        setSelectSize(e.target.value);
    };

    useEffect(() => {
        if (findings?.length > 0) {
            setSelectedFindings(findings[0].finding);
        }
    }, [findings]);

    const parseSize = (size) => {
        const match = size?.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    };

    const sortedSizes = sizeDetails?.sort(
        (a, b) => parseSize(a?.size) - parseSize(b?.size)
    );

    const handleFindingsChange = (e) => {
        setSelectedFindings(e.target.value);
    };

    const handleRefresh = async (event) => {
        await fetchProductData();
        setTimeout(() => {
            // Any calls to load data go here
            event.detail.complete();
        }, 1500); // Signal that the refresh is complete
    };

    // useEffect(() => {
    // }, [selectedType]);

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
      
      
        
          useEffect(() => {
          const newChecked = {};
          wishData?.forEach((item) => {
            newChecked[item._id] = true;
          });
          setCheckedItems(newChecked);
        }, [wishData]);

    const handleTypeMessage = (e) => {
        setTypeMessage(e.target.value);
    };
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    // Create a function to handle the Swiper instance
    const handleThumbsSwiper = (swiper) => {
        setThumbsSwiper(swiper); // Set the Swiper instance
    };


    

    return (
        <IonPage>
            <IonHeader>
                <h1>home</h1>
            </IonHeader>
            <Header />
            <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px', marginTop: '10px' }}>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent
                        pullingIcon={chevronDownCircleOutline}
                        refreshingSpinner="circles"
                    ></IonRefresherContent>
                </IonRefresher>
                <div style={{ marginTop: '90px' }}>
                    <h5 class="text-center mb-5 element">Products</h5>
                </div>

                <div className='main-catagory' style={{ marginBottom: '70px' }}>
                    <IonGrid>
                        <IonRow>
                            <IonCol size-lg='6' size='12' >
                                 <IonBreadcrumbs>
                                      <IonBreadcrumb href="/home">Home</IonBreadcrumb>
                                      <IonBreadcrumb onClick={()=>{
                                        window.history.back();
                                      }} style={{cursor:'pointer'}}>Category</IonBreadcrumb>
                                       <IonBreadcrumb style={{cursor:'pointer'}}>Product</IonBreadcrumb>
                                    </IonBreadcrumbs>
                                
                                <IonRow>
                                    <IonCol size-sm='8' size='12' style={{ backgroundColor: '#fff' }}>
                                        <div className="product-img">
                                            {/* <div className='imgbtn' >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
                                                    <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
                                                    <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5" />
                                                </svg>
                                            </div> */}
                                            <Swiper
                                                spaceBetween={0}
                                                thumbs={{ swiper: thumbsSwiper }}
                                                modules={[FreeMode, Navigation, Thumbs]}
                                                className="mySwiper2 mySwipermain"
                                            >
                                                {/* Main Swiper Slides */}
                                                {otherUploadImg ? (
                                                    otherUploadImg?.split(",")?.map((img, index) => (
                                                        <SwiperSlide>

                                                            <div onClick={() => openModal(index)}  >
                                                                <div className='imgbtn' >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-zoom-in" viewBox="0 0 16 16">
                                                                        <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
                                                                        <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
                                                                        <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5" />
                                                                    </svg>
                                                                </div>
                                                                <img src={IMG_PATH + img} key={index} className="slider-img" />
                                                            </div>
                                                        </SwiperSlide>
                                                    ))
                                                ) : (
                                                    <SwiperSlide>

                                                        <img src={IMG_PATH + thumbnailImage} className="slider-img pulsating-circle" />

                                                    </SwiperSlide>
                                                )}
                                                {/* <SwiperSlide >
                                                    <img className="slider-img pulsating-circle"  src={IMG_PATH + otherUploadImg} alt="Img" />
                                                </SwiperSlide>
                                                <SwiperSlide >
                                                    <img className="slider-img pulsating-circle"  src={IMG_PATH + otherUploadImg} alt="Img" />
                                                </SwiperSlide>
                                                <SwiperSlide >
                                                    <img className="slider-img pulsating-circle"  src={IMG_PATH + otherUploadImg} alt="Img" />
                                                </SwiperSlide> */}

                                            </Swiper>

                                        </div>


                                    </IonCol>
                                    <IonCol size-sm='4' size='12'>
                                        <div className='product-imgmini'>
                                            <Swiper
                                                // style={{ display: 'flex', alignItems: 'center' }}
                                                onSwiper={handleThumbsSwiper} // Use the handler function here
                                                spaceBetween={10}
                                                slidesPerView={4}
                                                freeMode={true}
                                                watchSlidesProgress={true}
                                                modules={[FreeMode, Navigation, Thumbs]}
                                                className="mySwiper twominimgmain">
                                                {/* Thumbnail Swiper Slides */}
                                                {/* <SwiperSlide >
                                                    <img class="twominimg"  src={IMG_PATH + otherUploadImg} alt="Img" />
                                                </SwiperSlide>

                                                <SwiperSlide >
                                                    <img class="twominimg"  src={IMG_PATH + otherUploadImg} alt="Img" />
                                                </SwiperSlide>

                                                <SwiperSlide >
                                                    <img class="twominimg"  src={IMG_PATH + otherUploadImg} alt="Img" />
                                                </SwiperSlide> */}
                                             
                                              
                                                {otherUploadImg ? (
                                                    otherUploadImg?.split(",")?.map((img, index) => (
                                                        <SwiperSlide>
                                                            <img src={IMG_PATH + img} key={index} class="twominimg" />
                                                        </SwiperSlide>
                                                    ))
                                                ) : (
                                                    <SwiperSlide>
                                                        <img src={IMG_PATH + thumbnailImage} class="twominimg" />
                                                    </SwiperSlide>
                                                )}

{videopath?.length > 0 && (
  <SwiperSlide>
    <div className='thumblineimage'>
      <a href={videopath} target="_blank" rel="noopener noreferrer">
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Play Icon SVG */}
          <div
            key={videopath} // Force re-render on change
            style={{
              width: "30px",
              height: "30px",
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1, // Ensure it's above the image
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="white"
              className="bi bi-play-circle"
              viewBox="0 0 16 16"
              style={{ display: "block" }} // Ensure SVG is displayed as a block
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445" />
            </svg>
          </div>
          {/* Thumbnail Image */}
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "9px",
              marginBottom: "0",
            }}
            src={`https://pub-dde01f21c9dd4895a14c71b5ea622cb4.r2.dev/imaged/${videopath?.split('d=')[1]}/still.jpg`}
            alt="Video Thumbnail"
          />
        </div>
      </a>
    </div>
  </SwiperSlide>
)}
                                                 
                                                 
                                            </Swiper>

                                        </div >

                                    </IonCol >
                                </IonRow >
                            </IonCol >
                            <IonCol size-lg='6' size='12'>
                                <IonRow>
                                    <IonCol>
                                        <div className='productreduiom' >
                                            <IonChip color="secondary" style={{ fontWeight: '500px' }}>{sku}</IonChip>
                                            <h5 style={{ textTransform: 'uppercase', fontSize: '15px' }}>{description}</h5>
                                        </div >
                                        <div className='productreduio'>
                                            <h6>Metal</h6>
                                            <div className='main-lan'>
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '10px',
                                                            margin: '0',
                                                            width: '100%',
                                                        }}
                                                    >
                                                        {['14K', '18K'].map((type) => (
                                                            <label
                                                                key={type}
                                                                className="btn btn-default"
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: 'black',
                                                                    marginRight: '0',
                                                                    width: '100%',
                                                                    maxWidth: '300px',
                                                                    textAlign: 'center',
                                                                    border: selectedType === type ? '2px solid rgb(195 152 98)' : '2px solid #ccc',
                                                                    padding: '10px',
                                                                    borderRadius: '5px',
                                                                    cursor: 'pointer',
                                                                    backgroundColor: selectedType === type ? 'rgb(255 230 202)' : '#fff',
                                                                }}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="goldType"
                                                                    value={type}
                                                                    checked={selectedType === type}
                                                                    onChange={() => setSelectedType(type)}
                                                                    style={{ display: 'none' }}
                                                                />
                                                                <div style={{ width: '100%' }}>
                                                                    <span className="option-label">{type === '14K' ? '14K Gold' : '18K Gold'}</span>
                                                                    <div
                                                                        className="px-product"
                                                                        style={{
                                                                            display: 'flex',
                                                                            flexWrap: 'wrap',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                    >
                                                                        {type === '14K' ? `${wgt14k?.toFixed(2)} Grams` : `${wgt18k?.toFixed(2)} Grams`}
                                                                        <sub
                                                                            style={{
                                                                                color: 'rgb(76 50 38)',
                                                                                display: 'block',
                                                                            }}
                                                                        >
                                                                            * Approx. Weight
                                                                        </sub>
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className='main-color'>
                                                    <h6>Metal Color</h6>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0' }}>
                                                        {["ROSE", "WHITE", "YELLOW"].map((metal) => (
                                                            <label
                                                                key={metal}
                                                                className="btn btn-default"
                                                                style={{
                                                                    display: 'flex',
                                                                    flexDirection: 'column',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    color: 'black',
                                                                    marginRight: '0',
                                                                    maxWidth: '110px',
                                                                    cursor: 'pointer',
                                                                    border: selectedMetal === metal ? '2px solid rgb(195, 152, 98)' : '2px solid #ccc',
                                                                    backgroundColor: selectedMetal === metal ? 'rgb(255, 230, 202)' : '#fff',
                                                                }}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="metal"
                                                                    value={metal}
                                                                    checked={selectedMetal === metal}
                                                                    onChange={() => setSelectedMetal(metal)}
                                                                    style={{ display: 'none' }} // Hide the default radio button
                                                                />
                                                                <div style={{ width: '85%', textAlign: 'center' }}>
                                                                    <img
                                                                        className="slider-img"
                                                                        src={`/img/color-${metal.toLowerCase()}.svg`} // Assuming images are named color-rose.svg, etc.
                                                                        alt={metal}
                                                                        style={{
                                                                            width: '26px',
                                                                            height: '26px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '9px',
                                                                        }}
                                                                    />
                                                                    <div className="px-product">{metal}</div>
                                                                </div>
                                                            </label>
                                                        ))}
                                                    </div>


                                                </div>
                                            </div>
                                            <div className='diamondcolmin'>
                                                {/* <IonRadioGroup value="end" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0' }}>
                                                    <div className='diamondcol'>
                                                        <IonRadio slot='end' labelPlacement="end" value="grapes" color='secondary' style={{ color: '#4c3226', marginRight: '0', width: '100%' }}>DEF VS+</IonRadio>
                                                    </div>
                                                    <div className='diamondcol'>
                                                        <IonRadio value="strawberries" labelPlacement="end" color='secondary' style={{ color: '#4c3226', marginRight: '0', width: '100%' }}>EF VS+</IonRadio>
                                                    </div>
                                                </IonRadioGroup> */}
                                                 <h6>Diamond Quality</h6>
                                            <div className="radio-group">
                                        {diamondGroup?.map((item, i) => (
                                            <label
                                            key={i}
                                            className={`radio-button ${selectedQuality === item ? 'selected' : ''}`}
                                            >
                                            <input
                                                type="radio"
                                                name="diamondQuality"
                                                value={item}
                                                checked={selectedQuality === item}
                                                onChange={() => setSelectedQuality(item)}
                                            />
                                            <span>{item}</span>
                                            </label>
                                        ))}
                                        </div>
                                            </div>
                                            <IonRow>
                                                <IonCol size='12'>
                                                    {colorstone ? (
                                                        <div value="end" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0' }}>
                                                            <span style={{ color: 'rgb(73 69 69)', fontSize: '15px', borderRadius: '20  px', marginTop: '16px', padding: '5px 25px', border: '1px solid #9f9993', borderRadius: '20px' }}>Color Stone Details : <div slot='end'
                                                                labelPlacement="end" style={{ color: 'rgb(76, 50, 38)', marginRight: '0', marginTop: '5px', fontSize: '14px' }}>{colorstone}</div></span>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}
                                                </IonCol>
                                                <IonCol size='12'>
                                                    {/* {sortedSizes?.length > 0 && (
                                                        <IonSelect
                                                            label-placement="floating"
                                                            value={selectSize}
                                                            placeholder="Select Size"
                                                            onIonChange={(e) => handleSizeChange(e)}
                                                            interface="popover"
                                                            style={{
                                                                fontSize: '14px',
                                                                border: '1px solid #7f7d7d',
                                                                backgroundColor: '#fff6ec',
                                                                color: 'rgb(76 50 38)',
                                                                padding: '0px 10px',
                                                                borderRadius: '7px'

                                                            }}
                                                            size="small"
                                                        >
                                                            {sortedSizes?.map((size) => (
                                                                <IonSelectOption key={size?._id} value={size?.size}>
                                                                    {size?.size}
                                                                </IonSelectOption>
                                                            ))}
                                                        </IonSelect>
                                                    )} */}
                                                    {sortedSizes?.length > 0 && (
                                                        <>
                                                          <label
                                                            style={{
                                                                fontWeight: '500',
                                                                fontSize: '16px',
                                                                color: 'rgb(76 50 38)',
                                                                display: 'block',
                                                                marginBottom: '5px'
                                                            }}
                                                        > Select Size</label>
                                                        <select
                                                            value={selectSize}
                                                            onChange={(e) => handleSizeChange(e)}
                                                            style={{
                                                                fontSize: '16px',
                                                                border: '1px solid #7f7d7d',
                                                                backgroundColor: '#fff6ec',
                                                                color: 'rgb(76 50 38)',
                                                                padding: '12px 10px',
                                                                borderRadius: '7px',
                                                                width: '100%',
                                                                cursor: 'pointer',
                                                          
                                                            }}
                                                        >
                                                            <option value="" disabled>Select Size</option>
                                                            {sortedSizes?.map((size) => (
                                                                <option key={size?._id} value={size?.size}>
                                                                    {size?.size}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        </>
                                                    )}
                                                </IonCol>
                                                <IonCol size='12'>
                                                    {findings?.length > 0 && (
                                                        <>
                                                         <label
                                                            style={{
                                                                fontWeight: '500',
                                                                fontSize: '16px',
                                                                color: 'rgb(76 50 38)',
                                                                display: 'block',
                                                                marginBottom: '5px'
                                                            }}
                                                        >
                                                            Select Finding
                                                        </label>
                                                        <select
                                                            value={selectedFindings || (findings.length > 0 ? findings[0].finding : "")}
                                                            onChange={(e) => handleFindingsChange(e)}
                                                            style={{
                                                                fontSize: '15px',
                                                                border: '1px solid #7f7d7d',
                                                                backgroundColor: '#fff6ec',
                                                                color: 'rgb(76 50 38)',
                                                                padding: '5px 10px',
                                                                borderRadius: '7px',
                                                                width: '100%',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            <option value="" disabled>Select Finding</option>
                                                            {findings?.map((finding) => (
                                                                <option key={finding?._id} value={finding?.finding}>
                                                                    {finding?.finding}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        </>
                                                    )}

                                                </IonCol>
                                                <textarea
                                                    onChange={(e) => handleTypeMessage(e)}
                                                    placeholder="Type Message (Special Instruction eg: Nickel Free, No Rhodium Tip, Inscriptions etc.)"
                                                    style={{
                                                        color: 'rgb(41 41 41)',
                                                        height: '70px',
                                                        fontSize: '14px',
                                                        width: '100%',
                                                        padding: '8px',
                                                        borderRadius: '5px',
                                                        border: '2px solid #ccc',
                                                        outline: 'none',
                                                        resize: 'none',
                                                        background: 'transparent',
                                                        marginTop: '10px'
                                                    }}
                                                    onFocus={(e) => {
                                                        // Slight delay to wait for keyboard to appear on mobile
                                                        setTimeout(() => {
                                                        e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                        }, 600); // increase delay if needed
                                                    }}
                                                    ></textarea>


                                            </IonRow>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <div className='main-coune' style={{ display: 'flex', alignItems: 'center', margin: '10px 0', fontFamily: 'Poppins' }}>
                                                    <IonButton fill="clear" size='large' slot="icon-only" onClick={decrementCounter}>
                                                        <div style={{ border: '2px solid rgb(159 153 147)', padding: '8px 13px', borderRadius: ' 5px 0px 0px 5px' }}>
                                                            <ion-icon name="remove-circle-outline" slot="icon-only" style={{ color: ' black' }}></ion-icon>
                                                        </div>
                                                    </IonButton>
                                                    <span style={{
                                                        margin: '0px 2px', width: '40px', textAlign: 'center', color: '#47342b'
                                                    }}>{count}</span>
                                                    < IonButton fill="clear" size='large' onClick={incrementCounter} >
                                                        <div style={{ border: '2px solid rgb(159 153 147)', padding: '8px 13px', borderRadius: ' 0px 5px 5px 0px' }}>
                                                            <ion-icon name="add-circle-outline" slot="icon-only" style={{ color: ' black' }}></ion-icon>
                                                        </div>
                                                    </IonButton>
                                                </div>
                                                <IonButton
                                                    id={_id}
                                                    color={checkedItems[_id] ? "danger" : "medium"}
                                                    fill="clear"
                                                    onClick={() => handleItemCheckboxChange(_id, productDetails)}
                                                >
                                                    <IonIcon
                                                        slot="icon-only"
                                                        size="large"
                                                        icon={checkedItems[_id] ? heart : heartOutline}
                                                    />
                                                </IonButton>
                                            </div>
                                            <div className='adtocard'>
                                                <IonButton className='addticaed' expand="block" onClick={(e) => handleAddToCart(e, _id)}>ADD  TO   CART</IonButton>
                                            </div>
                                            <div className="product-detail text-center mb-3 mt-3">

                                                <div
                                                    className="product-details-title d-flex align-items-center justify-content-between"
                                                    style={{
                                                        borderBottom: "1px solid #bfbfbf",
                                                        paddingBottom: "5px",
                                                    }}
                                                >
                                                    <span className="d-block">Diamond  Specification</span>
                                                    <span
                                                        className="d-block "
                                                        style={{ fontSize: "15px" }}
                                                    >
                                                        {sku}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className='product-detail-mainc' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <div
                                                                style={{
                                                                    fontSize: "16px",
                                                                    display: "block",
                                                                    marginBottom: "7px",
                                                                    paddingTop: "14px",
                                                                }}
                                                            >
                                                                Side Cts.
                                                            </div>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="25"
                                                                height="25"
                                                                fill="currentColor"
                                                                className="bi bi-gem"
                                                                viewBox="0 0 16 16"
                                                            >
                                                                <path d="M3.1.7a.5.5 0 0 1 .4-.2h9a.5.5 0 0 1 .4.2l2.976 3.974c.149.185.156.45.01.644L8.4 15.3a.5.5 0 0 1-.8 0L.1 5.3a.5.5 0 0 1 0-.6zm11.386 3.785-1.806-2.41-.776 2.413zm-3.633.004.961-2.989H4.186l.963 2.995zM5.47 5.495 8 13.366l2.532-7.876zm-1.371-.999-.78-2.422-1.818 2.425zM1.499 5.5l5.113 6.817-2.192-6.82zm7.889 6.817 5.123-6.83-2.928.002z" />
                                                            </svg>
                                                            <a
                                                                href="#"

                                                                style={{
                                                                    color: "rgb(195 152 98)",
                                                                    fontSize: "15px",
                                                                    fontFamily: 'Poppins',
                                                                    fontWeight: "400",
                                                                    lineHeight: "1",
                                                                    width: "fit-content",
                                                                    margin: "14px auto 0px",
                                                                    display: "block",
                                                                    textDecoration: "none",

                                                                }}
                                                            >

                                                                {sidectwt?.toFixed(2)} Total Cts
                                                            </a>
                                                        </div>
                                                        <div style={{fontSize:'14px'}}>*Approx. Weight</div>
                                                        <div style={{ textAlign: 'center' }}>
                                                            <div
                                                                style={{
                                                                    fontSize: "16px",
                                                                    display: "block",
                                                                    marginBottom: "7px",
                                                                    paddingTop: "14px",
                                                                }}
                                                            >
                                                                Center Cts.
                                                            </div>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                xlink="http://www.w3.org/1999/xlink"
                                                                fill="#000000"
                                                                height="25"
                                                                width="25"
                                                                version="1.1"
                                                                id="Capa_1"
                                                                viewBox="0 0 434.781 434.781"
                                                                space="preserve"
                                                            >
                                                                <g>
                                                                    <path d="M296.774,28.276c-2.813-2.813-6.628-4.394-10.606-4.394H128.395c-3.979,0-7.793,1.58-10.606,4.394L6.226,139.839   c-2.813,2.813-4.394,6.628-4.394,10.606v157.773c0,3.979,1.581,7.794,4.394,10.606l111.563,111.563   c2.813,2.813,6.628,4.394,10.606,4.394h157.773c3.979,0,7.794-1.58,10.606-4.394l111.563-111.563   c2.813-2.813,4.394-6.628,4.394-10.606V150.445c0-3.979-1.58-7.794-4.394-10.606L296.774,28.276z M302.73,258.044V200.62l80-33.137   v123.698L302.73,258.044z M235.993,133.883h-57.424l-33.137-80H269.13L235.993,133.883z M176.029,153.883h62.504l12.458,12.458   L140.758,269.51l-8.926-8.926V198.08L176.029,153.883z M265.14,180.49l7.58,7.581L162.487,291.239l-7.58-7.581L265.14,180.49z    M178.569,324.781h57.424l33.137,80H145.432L178.569,324.781z M238.533,304.781h-61.248l105.446-98.688v54.49L238.533,304.781z    M375.077,149.004l-80,33.137l-40.604-40.604l33.137-80L375.077,149.004z M126.954,61.537l33.137,80l-40.606,40.605l-80-33.137   L126.954,61.537z M111.832,200.62v57.425l-80,33.137V167.483L111.832,200.62z M39.486,309.66l80-33.137l40.606,40.605l-33.137,80   L39.486,309.66z M287.609,397.127l-33.137-80l40.604-40.604l80,33.137L287.609,397.127z" />
                                                                    <path d="M422.949,35h-25V10c0-5.522-4.478-10-10-10s-10,4.478-10,10v25h-25c-5.522,0-10,4.478-10,10s4.478,10,10,10h25v25   c0,5.522,4.478,10,10,10s10-4.478,10-10V55h25c5.522,0,10-4.478,10-10S428.472,35,422.949,35z" />
                                                                </g>
                                                            </svg>
                                                            <a
                                                                href="#"
                                                                className="d-block mb-2"
                                                                style={{
                                                                    color: "rgb(195 152 98)",
                                                                    fontSize: "15px",
                                                                    fontFamily: 'Poppins',
                                                                    fontWeight: "400",
                                                                    lineHeight: "1",
                                                                    width: "fit-content",
                                                                    margin: "14px auto 0px",
                                                                    display: "block",
                                                                    textDecoration: "none",

                                                                }}
                                                            >
                                                                {centerctwt?.toFixed(2)} Total Cts{" "}
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: "1px solid #bfbfbf",
                                                        paddingTop: "5px"
                                                    }}  >
                                                        <h6 style={{ margin: '0' }}>Total Weight</h6>
                                                        <span>  {ctswts?.toFixed(2)} Cts</span>
                                                    </div>


                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <h6 style={{ margin: '0' }}>Number of Diamonds</h6>
                                                        <span> {diaqty} Pcs</span>
                                                    </div>


                                                    {itemsize ? (
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <h6 style={{ margin: '0' }}>Item size</h6>
                                                            <span> {itemsize}</span>
                                                        </div>
                                                    ) : (
                                                        ""
                                                    )}

                                                    {
                                                        attr && categoryattr?.map((val, index) => {
                                                            return Number(attr[index]?.value) && <div href="#/action-2">
                                                                <div
                                                                    key={index}
                                                                    className="product-details-title d-flex align-items-center justify-content-between"
                                                                    style={{
                                                                        paddingBottom: "5px",
                                                                    }}
                                                                >
                                                                    <span className="d-block">
                                                                        {val?.name}
                                                                    </span>
                                                                    <span
                                                                        className="d-block"
                                                                        style={{
                                                                            fontSize: "15px",
                                                                            fontFamily: "monospace",
                                                                        }}
                                                                    >
                                                                        {Number(attr[index]?.value).toFixed(2)}
                                                                        {/* {?.toFixed(2)} */}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        })
                                                    }

                                                </div>
                                            </div>
                                            <div className='disclaimer-main'>
                                                <div className='stickdsclaimer'>Disclaimer</div>
                                                <h6>- Unless otherwise stated, the color, purity, and metal tone will be as mentioned in the master and prompt style.</h6>

                                                <h6>- A diamond tolerance of 5% will be allowed.</h6>

                                                <h6>- The size may differ from what is suggested, affecting the diamond quantity and gold weight.</h6>
                                            </div>
                                        </div>
                                    </IonCol >
                                </IonRow >
                            </IonCol >
                        </IonRow >


                    </IonGrid >

                </div >
            </IonContent >
            {/* Modal to open Swiper slider */}
            {
                showModal && (
                    <div className="modalimage1">
                        <div className="modalimage2">
                            <div type='button' onClick={closeModal} style={{ justifyContent: 'end', padding: '0', display: 'flex', }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="bi bi-x-lg" viewBox="0 0 16 16">
                                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                                </svg>
                            </div>


                            <Swiper
                                style={{ marginBottom: '0px', width: '100%' }}
                                spaceBetween={0}
                                slidesPerView={1}
                                onSlideChange={() => console.log('slide change')}
                                onSwiper={(swiper) => console.log(swiper)}
                                autoplay={true}
                                initialSlide={activeIndex}
                            >
                                {otherUploadImg ? (
                                    otherUploadImg.split(",").map((img, index) => (
                                        <SwiperSlide key={index}> {/* Add key prop here */}
                                            <img
                                                src={IMG_PATH + img}
                                                onClick={() => openModal(index)} // Pass index correctly
                                                alt={`Product Image ${index}`}
                                            />
                                        </SwiperSlide>
                                    ))
                                ) : (
                                    <SwiperSlide key={0}> {/* Add key prop here */}
                                        <img
                                            src={IMG_PATH + thumbnailImage}
                                            onClick={() => openModal(0)} // Open modal for thumbnail image
                                            alt="Thumbnail Image"
                                        />
                                    </SwiperSlide>
                                )}


                                {/* <SwiperSlide>
                            <IonImg
                                src="src/img/produc-maoin.jpg"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    borderRadius: '9px',
                                    overflow: 'hidden',
                                }}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <IonImg
                                src="src/img/produc-maoin.jpg"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    borderRadius: '9px',
                                    overflow: 'hidden',
                                }}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <IonImg
                                src="src/img/produc-maoin.jpg"
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    objectFit: 'cover',
                                    borderRadius: '9px',
                                    overflow: 'hidden',
                                }}
                            />
                        </SwiperSlide> */}
                            </Swiper>
                        </div>
                    </div>
                )
            }
            <IonToast
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
            />
        </IonPage >
    );
}
export default Product; 
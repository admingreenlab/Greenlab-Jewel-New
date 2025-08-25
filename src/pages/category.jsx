import React, { useRef, useState, useEffect } from 'react';
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
    IonInput,
    IonCheckbox,
    IonRange,
    IonRefresher, IonRefresherContent,
} from '@ionic/react';
import { useParams } from "react-router-dom";
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Header from './head';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import '../pages/Tab1.css';
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { Navigation, Autoplay } from 'swiper/modules';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../store/actions';
import { chevronDownCircleOutline } from 'ionicons/icons';

function Category() {
    const { id } = useParams();
    const [categoryDetails, setCategoryDetails] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);
    const [selectedSku, setSelectedSku] = useState('');
    const [selectedDescription, setSelectedDescription] = useState('');
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(1);
    const [hoveredImage, setHoveredImage] = useState('');
    const [pageSize, setPageSize] = useState(100);
    const [CategoryFilter, setCategoryFilter] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState([])
    const [subcollection, setSubcollection] = useState([])
    const [itemname, setItemname] = useState('')
    const isFetching = useRef(false)
    const dispatch = useDispatch();
    const { filters } = useSelector((state) => state.filter);
    const [pendingFetch, setPendingFetch] = useState(false);
    const [attr, setAttr] = useState([]);
    const [filterDetails, setFilterDetails] = useState(filters?.filter || {
        minctswts: 0, maxctswts: null, minGramWt: 0, maxGramWt: null, minpointer: 0,
        maxpointer: 0,
        attr: [], shape: []
    });
    const [sortOrder, setSortOrder] = useState("asc");
    const [maxattr, setMaxttr] = useState({});
    const [maxctswts, setMaxctswts] = useState(null);
    const [maxGramWt, setMaxGramWt] = useState(null);
    const [shape, setShape] = useState([])
    const [sortctswts, setSortctswts] = useState("");


    const fetchCategoryData = async (filterflag) => {
        if (isFetching.current) return;
        isFetching.current = true;
        setLoading(true);



        try {
            const response = await jwtAuthAxios.post(`client/category?id=${id}&page=${page}&limit=${pageSize}&sort=${sortOrder}&sortctswts=${sortctswts}`, {
                CategoryFilter,
                CollectionFilter: selectedCollection,
                filter: filterDetails,

            });
            // console.log("Fetching with filters:", selectedCategories);
            setMaxttr(response?.data?.maxAttr);
            if (filterDetails.attr.length <= 0) {
                setAttr(response?.data.attribute[0].attr);
            }
            if (filterflag) {
                setFilterDetails({
                    minctswts: 0,
                    maxctswts: null,
                    minGramWt: 0,
                    maxGramWt: null,
                    minpointer: 0,
                    maxpointer: 0,
                    attr: [],
                    shape: []
                });
            } else {
                setFilterDetails(response?.data?.filter);
                if (maxctswts === null && response?.data?.maxctswts !== undefined) {
                    // console.log("Max CTWTS from API:", response.data.maxctswts);
                    setMaxctswts(response.data.maxctswts);
                    setFilterDetails(prev => ({
                        ...prev,
                        maxctswts: response.data.maxctswts
                    }));

                }

                if (maxGramWt === null && response?.data?.maxGramWt !== undefined) {
                    setMaxGramWt(response.data.maxGramWt);
                    setFilterDetails(prev => ({
                        ...prev,
                        maxGramWt: response.data.maxGramWt
                    }));
                }

            }
            setCategoryDetails(response?.data?.data);
            // setSubcategories(response?.data.CategoryFilter);
            setShape(response?.data?.shapeData);
            setSubcollection(response.data.CollectionFilter)
            setTotalCount(response?.data?.pagination?.totalCount);
            setItemname(response.data.data[0].itemtype.name)
            setError(null);

        } catch (error) {
            console.error(error?.response?.data?.error)
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    const demosub = async () => {
        const response = await jwtAuthAxios.post(`client/category?id=${id}&page=${page}&limit=${pageSize}&sort=${sortOrder}`, {
            CategoryFilter,
            CollectionFilter: selectedCollection,
            filter: filterDetails,

        });
        setSubcategories(response?.data.CategoryFilter);
    }

    useEffect(() => {
        demosub()
    }, [])

    const handleCategoryChange = (categoryId) => {
        // Toggle the selected category
        const updatedCategories = CategoryFilter.includes(categoryId)
            ? CategoryFilter.filter(id => id !== categoryId)
            : [...CategoryFilter, categoryId];

        setCategoryFilter(updatedCategories);
        dispatch(setFilter(updatedCategories));
    };

    const handleCollectionChange = (collectionId) => {
        const updatedCollection = selectedCollection.includes(collectionId)
            ? selectedCollection.filter(id => id !== collectionId)
            : [...selectedCollection, collectionId];

        setSelectedCollection(updatedCollection);
        dispatch(setFilter(updatedCollection));
    };

    const handleSelectChange = (value) => {
        const [order, ctWts] = value.split('-');
        setSortOrder(order || "");
        setSortctswts(ctWts || "");
        setPage(1);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;

        const numericValue = value === '' ? '' : parseFloat(value);

        if (value !== '' && isNaN(numericValue)) {
            console.error(`Invalid input for ${name}: ${value}`);
            return;
        }

        setFilterDetails((prevDetails) => ({
            ...prevDetails,
            [name]: numericValue,
        }));

        setPendingFetch(true);
    };

    const handleFilterAttrChange = (attr, attributeName, newValue) => {
        if (newValue === "") {
            console.log('" " value found');
            setAttr([]);
            setFilterDetails((prevDetails) => ({
                ...prevDetails,
                attr: [],
            }));
            setPendingFetch(true);
            return;
        }

        const updatedAttr = attr.map((attribute) => {
            if (attribute.name === attributeName) {
                return { ...attribute, value: newValue };
            }
            return attribute;
        });

        setAttr(updatedAttr);
        setFilterDetails((prevDetails) => ({ ...prevDetails, attr: updatedAttr }));
        setPendingFetch(true);
    };

    useEffect(() => {
        if (id) {
            fetchCategoryData();

        }
    }, [id, page, CategoryFilter, selectedCollection, pageSize, sortOrder, sortctswts]);

    const handleSortChange = (order) => {
        setSortOrder(order);
        setPage(1);
    };
    useEffect(() => {
        if (pendingFetch) {
            fetchCategoryData();
            setPendingFetch(false);

        }
    }, [filterDetails, pendingFetch]);

    const handleMouseEnter = (sku, description, image, itemId) => {
        setHoveredItemId(itemId);
        setSelectedSku(sku);
        setSelectedDescription(description);
        setHoveredImage(image);
    };

    const handleMouseLeave = () => {
        setHoveredItemId(null);
        setHoveredImage('');
    };

    const handleNextPage = () => {
        if (page * pageSize < totalCount) {
            setPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(prevPage => prevPage - 1);
        }
    };
    const [isOpen, setIsOpen] = useState(false);

    const toggleOffcanvas = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        // console.log('filter', filterDetails)
    }, [filterDetails])

    const handleReset = () => {
        setFilterDetails({
            minctswts: 0,
            maxctswts: 0,
            minGramWt: 0,
            maxGramWt: 0,
            minpointer: 0,
            maxpointer: 0,
            attr: [],
            shape: [],
        });
        setCategoryFilter([]);
        setSelectedCollection([]);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(Number(event.target.value));
        setPage(1);
    };

    const handleRefresh = async (event) => {
        await fetchCategoryData();
        setTimeout(() => {
            // Any calls to load data go here
            event.detail.complete();
        }, 1500); // Signal that the refresh is complete
    };

    // useEffect(() => {
    //     console.log("filterDetails", filterDetails);
    // }, [filterDetails])

    // useEffect(() => {
    //     jwtAuthAxios.get(`/master/tags/shapes`)
    //         .then(response => setShape(response.data[0]?.data))
    //         .catch(error => console.error('Error fetching synonyms:', error));
    // }, []);

    const handleShapeCheckboxChange = (event, item) => {
        const { checked } = event.target;

        // console.log("Before update:", filterDetails.shape);

        setFilterDetails((prev) => {
            const newShapes = checked
                ? [...new Set([...prev.shape, item])]
                : prev.shape.filter((shapeName) => shapeName !== item);

            // console.log("After update:", newShapes);
            return { ...prev, shape: newShapes };
        });

        setPendingFetch(true);
    };


    return (
        <>
            <Header />

            <IonPage>
                <div style={{ margin: '30px' }}></div>

                <IonContent color="primary">
                    <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                        <IonRefresherContent
                            pullingIcon={chevronDownCircleOutline}
                            refreshingSpinner="circles"
                        ></IonRefresherContent>
                    </IonRefresher>
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
                        <div>
                            <h5 class="text-center mb-5 element" style={{ marginBottom: '20px' }}>{itemname}  Category </h5>
                        </div>

                        <IonCol size='12' style={{ display: 'flex', justifyContent: 'center' }}>
                            <select
                                className="form-select form-select-main"
                                style={{ width: 'auto', margin: '0 10px 0 0' }}
                                value={`${sortOrder}-${sortctswts}`}
                                onChange={(e) => handleSelectChange(e.target.value)}
                            >
                                <option value="asc-">Sort by Style NO ASC</option>
                                <option value="desc-">Sort by Style NO DESC</option>
                                <option value="-min">Sort by Min CtWts</option>
                                <option value="-max">Sort by Max CtWts</option>
                            </select>
                            <select
                                className="form-select form-select-main"
                                style={{ marginLeft: 'auto', display: 'flex', color: '#4c3226', border: '2px solid #9d7664', marginLeft: 'auto', width: 'auto', padding: '0 10px', borderRadius: '9px' }}
                                value={pageSize}
                                onChange={handlePageSizeChange}
                            >
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                                <option value={72}>72</option>
                                <option value={100}>100</option>
                            </select>
                        </IonCol>     <div className='main-catagory'>
                            <IonRow>
                                <IonCol>
                                    <h5></h5>
                                </IonCol>
                            </IonRow>
                            <IonRow>

                                {loading ? (
                                    <p style={{ color: '#000', display: 'flex', justifyContent: 'center' }}>Loading...</p>
                                ) : error ? (
                                    <p className="error-message" style={{ color: '#000', display: 'flex', justifyContent: 'center' }}>{error}</p>
                                ) : categoryDetails && categoryDetails.length > 0 ? (
                                    categoryDetails?.map(item => {
                                        const hasSubItems = item.subItems && item.subItems.length > 0;
                                        const redirectTo = hasSubItems ? `/c-category/${item._id}` : `/product/${item._id}`;

                                        return (
                                            <IonCol size-md='4' size-sm='6' size='12' key={item._id}>
                                                <div className='main-card-ctgy' style={{ marginBottom: '30px' }}>
                                                    <ion-router-link href={redirectTo}>
                                                        <div className='main-card-top'>
                                                            <img src={hoveredItemId === item._id ? hoveredImage : IMG_PATH + item?.thumbnailImage} alt="ig145" />
                                                            <span className='igsticky'>{hoveredItemId === item._id ? selectedSku : item.sku}</span>
                                                        </div>
                                                    </ion-router-link>
                                                    <div className='main-card-bottom'>
                                                        <div>
                                                            <h5 style={{ textTransform: 'uppercase' }}>{hoveredItemId === item._id ? selectedDescription : item.description}</h5>
                                                        </div>
                                                        <div>
                                                            <h5 style={{ color: '#bc7700' }}>{item.category[0].name}</h5>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div className='ctstop'>
                                                            <span>CTS:</span>
                                                        </div>
                                                        <div style={{ width: '80%', margin: '0px 0px 0px 20px' }}>
                                                            <div style={{ width: '100%', maxWidth: "250px" }}>
                                                                <div className='right'>
                                                                    {/* <Swiper style={{ margin: '4px 4px' }} spaceBetween={5} slidesPerView={4}>
                                                                    {[item, ...item?.subItems]?.map(subItem => (
                                                                        <SwiperSlide
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                window.location.href = `/product/${subItem._id}`;
                                                                            }}
                                                                            key={subItem._id}
                                                                            onMouseEnter={() => handleMouseEnter(subItem.sku, subItem.description, IMG_PATH + subItem.thumbnailImage, item._id)}
                                                                            onMouseLeave={handleMouseLeave}
                                                                        >
                                                                            <span style={{ fontSize: '12px' }}>{subItem?.ctswts?.toFixed(2)}</span>
                                                                        </SwiperSlide>
                                                                    ))}
                                                                </Swiper> */}
                                                                    <Swiper
                                                                        style={{ padding: '4px 4px', margin: '0px 0px 0px 10px' }}
                                                                        spaceBetween={5}
                                                                        slidesPerView={3}
                                                                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                                                                        modules={[Navigation]}
                                                                        navigation
                                                                        breakpoints={{
                                                                            320: { slidesPerView: 3, spaceBetween: 6 },
                                                                            480: { slidesPerView: 3, spaceBetween: 6 },
                                                                            768: { slidesPerView: 3, spaceBetween: 6 },
                                                                            1024: { slidesPerView: 4, spaceBetween: 5 },
                                                                        }}
                                                                    >
                                                                        {[item, ...item?.subItems]?.map(subItem => (
                                                                            <SwiperSlide
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    window.location.href = `/product/${subItem._id}`;
                                                                                }}
                                                                                key={subItem._id}
                                                                                onMouseEnter={() => handleMouseEnter(subItem.sku, subItem.description, IMG_PATH + subItem.thumbnailImage, item._id)}
                                                                                onMouseLeave={handleMouseLeave}

                                                                            >
                                                                                <span style={{ fontSize: '12px' }}>{subItem?.ctswts?.toFixed(2)}</span>
                                                                            </SwiperSlide>
                                                                        ))}
                                                                    </Swiper>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            </IonCol>
                                        );
                                    })
                                ) : (
                                    <div
                                        style={{
                                            background: "#fff6ec",
                                            margin: 'auto'
                                        }}
                                    >
                                        <div>
                                            <IonImg
                                                src='/img/datanotfound.png'
                                                style={{ maxWidth: "360px", width: "100%" }}
                                            />
                                            <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Data Not Found</h3>
                                        </div>
                                    </div>
                                )}
                            </IonRow>


                            <IonButton className='right_bottom_fix' shape='round' size='large' color='secondary' onClick={toggleOffcanvas}>
                                {isOpen ? (
                                    <ion-icon name="close-outline" slot="icon-only"></ion-icon>
                                ) : (
                                    <ion-icon name="filter-outline" slot="icon-only"></ion-icon>
                                )}
                            </IonButton>
                            <div className={`offcanvas ${isOpen ? "show" : ""}`}>
                                <div className="content">
                                    <div color='secondary'>
                                        <div className='topbtn'>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgb(255 216 174 / 22%)" }}>
                                                <div>
                                                    <span>Filter by:</span>
                                                </div>
                                                <div>
                                                    <ion-button onClick={toggleOffcanvas} fill="clear" style={{ width: '100%', color: "#ffd8ae" }} size="large"><ion-icon name="close-outline"></ion-icon></ion-button>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <IonButton onclick={handleReset} style={{ width: '100%', margin: '15px 0', background: '#f3a41c' }} expand="full">Reset</IonButton>
                                                <IonButton onClick={toggleOffcanvas} style={{ width: '100%', margin: '15px 0', background: '#f3a41c' }} expand="full">Apply</IonButton>
                                            </div>
                                        </div>
                                        <IonAccordionGroup
                                            class='filter-drop'
                                            multiple={true}
                                            // Set the first accordion as open by default
                                            style={{ padding: '0' }}>
                                            <IonAccordion value="first">
                                                <IonItem slot="header" color='secondary'>
                                                    <p>Sub Category</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content">
                                                    {subcategories.map(subcategory => (
                                                        <div key={subcategory._id} style={{ display: 'flex' }}>
                                                            <IonCheckbox
                                                                size='large'
                                                                labelPlacement="end"
                                                                style={{ marginBottom: '10px' }}
                                                                //checked={selectedCategories.includes(subcategory._id)}
                                                                checked={Array.isArray(CategoryFilter) && CategoryFilter.includes(subcategory._id)}
                                                                onIonChange={() => handleCategoryChange(subcategory._id)}
                                                                disabled={loading}
                                                            />
                                                            <span style={{ margin: '1px 0px 0px 10px' }}>{subcategory.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </IonAccordion>

                                            <IonAccordion value="third" >
                                                <IonItem slot="header" color='secondary'>
                                                    <p>CT Wts</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content">
                                                    <IonRange
                                                        style={{ border: 'none', boxShadow: 'none', fontWeight: '500', fontSize: '18px', padding: '21px 12px 0 12px' }}
                                                        dualKnobs={true}
                                                        min={0}
                                                        step={0.05}
                                                        max={maxctswts?.toFixed(2) || 100} // Set a default max if maxctswts is null
                                                        value={{
                                                            lower: filterDetails?.minctswts,
                                                            upper: filterDetails?.maxctswts || maxctswts || 100 // Default upper value
                                                        }}
                                                        pinFormatter={(value) => `${value}`}
                                                        pin={true}
                                                        ticks={true}
                                                        snaps={true}
                                                        onIonChange={(e) => {
                                                            const newMinValue = e?.detail?.value?.lower;
                                                            const newMaxValue = e?.detail?.value?.upper;
                                                            setFilterDetails(prev => ({
                                                                ...prev,
                                                                minctswts: newMinValue,
                                                                maxctswts: newMaxValue
                                                            }));
                                                            setPendingFetch(true);
                                                        }}
                                                    />
                                                </div>
                                            </IonAccordion>
                                            <IonAccordion value="fore">
                                                <IonItem slot="header" color='secondary'>
                                                    <p>Gram Wts</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content">
                                                    <IonRange
                                                        style={{ border: 'none', boxShadow: 'none', fontWeight: '500', fontSize: '18px', padding: '21px 12px 0 12px' }}
                                                        dualKnobs={true}
                                                        min={0}
                                                        step={0.05}
                                                        max={maxGramWt?.toFixed(2) || 100} // Set a default max if maxctswts is null
                                                        value={{
                                                            lower: filterDetails?.minGramWt,
                                                            upper: filterDetails?.maxGramWt || maxGramWt || 100 // Default upper value
                                                        }}
                                                        pinFormatter={(value) => `${value}`}
                                                        pin={true}
                                                        ticks={true}
                                                        snaps={true}
                                                        onIonChange={(e) => {
                                                            const newMinValue = e?.detail?.value?.lower;
                                                            const newMaxValue = e?.detail?.value?.upper;
                                                            setFilterDetails(prev => ({
                                                                ...prev,
                                                                minGramWt: newMinValue,
                                                                maxGramWt: newMaxValue
                                                            }));
                                                            setPendingFetch(true);
                                                        }}
                                                    />
                                                </div>
                                            </IonAccordion>
                                            {shape?.length > 0 && (
                                                <IonAccordion value="six">
                                                    <IonItem slot="header" color='secondary'>
                                                        <p>Shape</p>
                                                    </IonItem>
                                                    <div className="ion-padding" slot="content">
                                                        {shape?.map((item, index) => (
                                                            <div key={index} style={{ display: 'flex' }}>
                                                                <IonCheckbox
                                                                    id={item}
                                                                    size='large'
                                                                    labelPlacement="end"
                                                                    style={{ marginBottom: '10px' }}

                                                                    onIonChange={(event) => handleShapeCheckboxChange(event, item)}
                                                                    checked={filterDetails?.shape?.includes(item)}
                                                                    disabled={loading}
                                                                />
                                                                <span style={{ margin: '1px 0px 0px 10px', textTransform: 'uppercase' }}>{item}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </IonAccordion>
                                            )}
                                            <IonAccordion value="second">
                                                <IonItem slot="header" color='secondary'>
                                                    <p>Collection</p>
                                                </IonItem>
                                                <div className="ion-padding" slot="content">
                                                    {subcollection.map(CollectionFilter => (
                                                        <IonCheckbox
                                                            key={CollectionFilter._id}
                                                            size='large'
                                                            labelPlacement="end"
                                                            style={{ marginBottom: '10px' }}
                                                            checked={Array.isArray(selectedCollection) && selectedCollection.includes(CollectionFilter._id)}
                                                            onIonChange={() => handleCollectionChange(CollectionFilter._id)}
                                                            disabled={loading}
                                                        >
                                                            <span>{CollectionFilter.name}</span>
                                                        </IonCheckbox>
                                                    ))}
                                                </div>
                                            </IonAccordion>
                                            {attr?.length > 0 && (
                                                <IonAccordion value="five">
                                                    <IonItem slot="header" color='secondary'>
                                                        <p>Pointer</p>
                                                    </IonItem>
                                                    <div slot="content" style={{ margin: '10px 0px 0px 20px', width: '90%', padding: '21px 12px 0 12px' }}>
                                                        <div>
                                                            <>
                                                                {attr?.map((attribute, index) => {
                                                                    switch (attribute.type) {
                                                                        case "singleinput":
                                                                            return (
                                                                                <div key={attribute._id} >
                                                                                    <label>
                                                                                        {attribute?.name}
                                                                                    </label>
                                                                                    <input
                                                                                        type="text"
                                                                                        style={{ width: "65%" }}
                                                                                        id={attribute.name}
                                                                                        name={`attr${index}`}
                                                                                        value={attribute.value}
                                                                                        onChange={(e) =>
                                                                                            handleFilterAttrChange(
                                                                                                attr,
                                                                                                attribute.name,
                                                                                                e.target.value
                                                                                            )
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            );
                                                                        case "radio":
                                                                            return (
                                                                                <div key={attribute._id} >
                                                                                    <label >
                                                                                        {attribute?.name}
                                                                                    </label>
                                                                                    <input
                                                                                        type="radio"
                                                                                        id={attribute.value}
                                                                                        name={attribute.name}
                                                                                        value={attribute.value}
                                                                                        onChange={handleFilterAttrChange}
                                                                                    />
                                                                                    <label htmlFor={attribute.value}>
                                                                                        {attribute.value}
                                                                                    </label>
                                                                                </div>
                                                                            );
                                                                        case "range1":
                                                                            return (
                                                                                <div key={attribute._id} >
                                                                                    <label >
                                                                                        {attribute?.name}
                                                                                    </label>

                                                                                    <IonRange
                                                                                        style={{ border: 'none', boxShadow: 'none', fontWeight: '500', fontSize: '18px' }}
                                                                                        dualKnobs={true}
                                                                                        id={attribute.value}
                                                                                        min={0.00}
                                                                                        name={`attr${index}`}
                                                                                        max={maxattr?.value}
                                                                                        step={0.01}
                                                                                        value={{
                                                                                            lower: parseFloat(attribute.value.split("-")[0]) || 0,
                                                                                            upper: parseFloat(attribute.value.split("-")[1]) || (maxattr?.value)
                                                                                        }}
                                                                                        pinFormatter={(value) => `${value}`}
                                                                                        pin={true}
                                                                                        ticks={true}
                                                                                        snaps={true}
                                                                                        onIonChange={(e) => {
                                                                                            const newMinValue = e.detail.value.lower;
                                                                                            const newMaxValue = e.detail.value.upper;
                                                                                            handleFilterAttrChange(attr, attribute.name, `${newMinValue}-${newMaxValue}`);
                                                                                        }}
                                                                                    />
                                                                                </div>
                                                                            );
                                                                        case "range":
                                                                            return (
                                                                                <div key={attribute._id} >
                                                                                    <label >
                                                                                        {attribute?.name}
                                                                                    </label>
                                                                                    <form
                                                                                        name="price"
                                                                                        action=""
                                                                                        method="POST"
                                                                                        style={{ display: "flex", marginTop: "5px" }}
                                                                                    >
                                                                                        <label htmlFor="price-start">
                                                                                            min
                                                                                            <input
                                                                                                id="price-start"
                                                                                                type="number"
                                                                                                min={0}
                                                                                                max={100}
                                                                                                name={`max${attribute.name}`}
                                                                                                value={attribute.value.split("-")[0]}
                                                                                                onChange={(e) =>
                                                                                                    handleFilterAttrChange(
                                                                                                        attr,
                                                                                                        attribute.name,
                                                                                                        `${e.target.value}-${attribute.value.split("-")[1]
                                                                                                        }`
                                                                                                    )
                                                                                                }
                                                                                                style={{
                                                                                                    marginLeft: "5px",
                                                                                                    marginRight: "15px",
                                                                                                }}
                                                                                            />
                                                                                        </label>
                                                                                        <label htmlFor="price-end">
                                                                                            Max
                                                                                            <input
                                                                                                id="price-end"
                                                                                                type="number"
                                                                                                min={0}
                                                                                                max={100}
                                                                                                name={`min${attribute.name}`}
                                                                                                value={attribute.value.split("-")[1]}
                                                                                                onChange={(e) =>
                                                                                                    handleFilterAttrChange(
                                                                                                        attr,
                                                                                                        attribute.name,
                                                                                                        `${attribute.value.split("-")[0]}-${e.target.value
                                                                                                        }`
                                                                                                    )
                                                                                                }
                                                                                                style={{ marginLeft: "5px" }}
                                                                                            />
                                                                                        </label>
                                                                                    </form>
                                                                                </div>
                                                                            );
                                                                        default:
                                                                            return null;
                                                                    }
                                                                })}
                                                            </>
                                                        </div>
                                                    </div>
                                                </IonAccordion>
                                            )}
                                        </IonAccordionGroup>

                                    </div>
                                </div>
                            </div>
                            <div className="pagination-controls" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={page === 1}
                                    style={{
                                        color: page === 1 ? 'rgb(40 39 39)' : 'rgb(24 9 2)',
                                        padding: '12px',
                                        border: '1px solid #e5e0db',
                                        background: page === 1 ? '#f0e4d7' : '#ffe4c4',
                                        borderRadius: '10px',
                                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page * pageSize >= totalCount}
                                    style={{
                                        color: (page * pageSize >= totalCount) ? 'rgb(40 39 39)s' : 'rgb(24 9 2)',
                                        padding: '12px',
                                        border: '1px solid #e5e0db',
                                        borderRadius: '10px',
                                        background: (page * pageSize >= totalCount) ? '#f0e4d7' : '#ffe4c4',
                                        cursor: (page * pageSize >= totalCount) ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </IonGrid>
                </IonContent>
            </IonPage>
        </>
    );
}
export default Category; 
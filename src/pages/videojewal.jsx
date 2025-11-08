import React, { useState,useRef, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonRow,
    IonCol,
    IonButton,
    IonIcon,
    IonGrid,
    IonImg,
    IonFooter,
    IonButtons,
    IonRefresher, IonRefresherContent,IonLoading
} from '@ionic/react';
import { Tooltip } from 'react-tooltip'
import { camera } from 'ionicons/icons';
import jwtAuthAxios from "../service/jwtAuth";
import { useHistory } from 'react-router-dom';
import { chevronDownCircleOutline } from 'ionicons/icons';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@awesome-cordova-plugins/file-opener';


const Videojewal = () => {
    const [selectedOption, setSelectedOption] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const filteredItems = selectedOption ? data.filter(item => item.type === selectedOption) : data;
    const history = useHistory();
    const [selectedItems, setSelectedItems] = useState([]);
    const [hoveredItemId, setHoveredItemId] = useState(null);
    const [selectAll, setSelectAll] = useState(false);
    const [loadings, setLoadings] = useState(false);

    const fetchVideoData = async () => {
        try {
            const response = await jwtAuthAxios.get('/master/upload-videofile');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleCheckboxChange = (itemId) => {
        setSelectedItems(prevSelected => {
            let updatedSelected;
            if (prevSelected.includes(itemId)) {
                updatedSelected = prevSelected.filter(id => id !== itemId);
            } else {
                updatedSelected = [...prevSelected, itemId];
            }
    
            // Update the Select All checkbox
            if (updatedSelected.length === filteredItems.map(item => item._id).length) {
                setSelectAll(true);
            } else {
                setSelectAll(false);
            }
    
            return updatedSelected;
        });
    };
    

    useEffect(() => {
        fetchVideoData();
    }, []);


    const handleItemClick = (item) => {
        history.push({
            pathname: `/videoshow/${item?._id}`,
            state: { rowData: item }
        });

    };

    const handleSelectAllChange = () => {
        setSelectAll(prevSelectAll => {
            const newSelectAll = !prevSelectAll;
    
            if (newSelectAll) {
                // Only select the items on the current page
                const currentPageIds = currentItems.map(item => item._id);
                setSelectedItems(prevSelected => {
                    // Merge with already selected items outside current page
                    const otherSelected = prevSelected.filter(id => !currentPageIds.includes(id));
                    return [...otherSelected, ...currentPageIds];
                });
            } else {
                // Deselect only the items on the current page
                const currentPageIds = currentItems.map(item => item._id);
                setSelectedItems(prevSelected => prevSelected.filter(id => !currentPageIds.includes(id)));
            }
    
            return newSelectAll;
        });
    };
    
    
    
    const handlePDFDownload = async () => {
        setLoadings(true);
        try {
            // Determine items to download
            const itemsInCategory = selectedOption
                ? data.filter(item => item.type === selectedOption)
                : data;
    
            const idsToDownload = selectedItems.length > 0
                ? selectedItems.filter(id => itemsInCategory.some(item => item._id === id))
                : itemsInCategory.map(item => item._id);
    
            // Validation: limit to 40 items
            if (idsToDownload.length > 40) {
                alert("You can only download a maximum of 40 items at a time for this category.");
                setLoadings(false);
                return;
            }
    
            // Request PDF from server
            const response = await jwtAuthAxios.post(
                '/master/downloadpdf',
                { ids: idsToDownload, category: selectedOption },
                { responseType: 'blob' }
            );
    
            if (response.status === 200) {
                const blob = new Blob([response.data], { type: 'application/pdf' });
    
                // iOS native share
                if (
                    navigator.canShare &&
                    navigator.canShare({ files: [new File([blob], 'file.pdf', { type: 'application/pdf' })] })
                ) {
                    navigator
                        .share({
                            files: [new File([blob], 'file.pdf', { type: 'application/pdf' })],
                            title: 'Download PDF',
                            text: 'Here is your PDF',
                        })
                        .catch(err => console.error('Share failed:', err));
                } else {
                    // Fallback for all other browsers
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'file.pdf'); // Filename
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    window.URL.revokeObjectURL(url);
                }
            } else {
                console.error('Download failed: Status', response.status);
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
        } finally {
            setLoadings(false);
        }
    };
    
    
      
      
    const getHoverImageUrl = (filePath) => {
        const filename = filePath.split('/')[5].split('?')[0];
        return `https://console.studio360.tech/explore/e/${filename}?mode=p`; // adjust the URL
    }; 

    const handleRefresh = async (event) => {
        await fetchVideoData();
        setTimeout(() => {
            // Any calls to load data go here
            event.detail.complete();
        }, 1500); // Signal that the refresh is complete
    };

    const getUniqueCategories = () => {
        const uniqueTypes = [...new Set(data.map(item => item.type))];
        return uniqueTypes;
    };

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        setCurrentPage(1);
    };


    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleClearAll = () => {
        setSelectedItems([]);  // Clear all selected IDs
        setSelectAll(false);   // Uncheck the "Select All" box
    };
    
    useEffect(() => {
        if (contentRef.current) {
          const scrollToTop = async () => {
            const el = await contentRef.current.getScrollElement();
            el.scrollTo({ top: 0, behavior: 'smooth' });
          };
          scrollToTop();
        }
      }, [currentPage]);

    const contentRef = useRef(null);
    
      const handleupper = () => {
        console.log("upper");
        contentRef.current?.scrollToTop(1000); // 500ms smooth
      }

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    return (
        <IonPage>
            <IonContent ref={contentRef} style={{ background: "rgba(188, 119, 0, 0.07)" }}>
                {/* <IonRefresher slot="fixed" onIonRefresh={handleRefresh} style={{ marginTop: '20px' }}>
                    <IonRefresherContent
                        pullingIcon={chevronDownCircleOutline}
                        refreshingSpinner="circles"
                    ></IonRefresherContent>
                </IonRefresher> */}
                <div className="pb-3" style={{marginTop:'70px'}}>
                    <IonGrid>
                        <IonRow className="ion-align-items-center mb-4">
                        <IonCol size="12">
                            <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap', // responsive layout
                                padding: '0 10px',
                            }}
                            >
                            {/* 🏠 Home Icon */}
                            <a href="/home" size="small">
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="26"
                                height="26"
                                fill="#4c3226"
                                className="bi bi-house-door"
                                viewBox="0 0 16 16"
                                >
                                <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
                                </svg>
                            </a>

                            {/* 🔽 Select Dropdown */}
                            <select
                                id="simple-select"
                                value={selectedOption}
                                onChange={handleSelectChange}
                                style={{
                                padding: '0 10px',
                                backgroundColor: '#fff',
                                color: 'black',
                                height: '48px',
                                borderRadius: '9px',
                                fontSize: '16px',
                                width: '220px',
                                border: '1px solid #ccc',
                                }}
                            >
                                <option value="">All Select Jewellery</option>
                                {getUniqueCategories().map((type, index) => (
                                <option key={index} value={type}>
                                    {type}
                                </option>
                                ))}
                            </select>

                            {/* ⬇️ Download Button */}
                            <IonButton
                                color="secondary"
                                style={{ height: '48px', width: '48px' }}
                                onClick={handlePDFDownload}
                            >
                                <ion-icon name="download-outline" slot="icon-only"></ion-icon>
                                <IonLoading
                                isOpen={loadings}
                                message="Downloading PDF..."
                                spinner="circles"
                                />
                            </IonButton>
                            </div>
                        </IonCol>
                        </IonRow>

                        <IonRow>
                            <IonCol>
                                <div style={{ marginTop: '15px', paddingTop: '10px', borderTop: '1.6px solid #00000047', display: 'flex', alignItems: "center", justifyContent: 'space-between' }}>
                                    <h4>Exclusive Jewellery</h4>
                                    <select value={itemsPerPage} className="w-auto" style={{ marginLeft: 'auto', display: 'flex', width: 'auto' }} onChange={handleItemsPerPageChange}>
                                        <option value={24}>24</option>
                                        <option value={48}>48</option>
                                        <option value={72}>72</option>
                                        <option value={100}>100</option>
                                    </select>
                                </div>
                            </IonCol>
                        </IonRow>
                        <IonRow style={{marginBottom:'15px'}}>
                        <IonCol style={{display:'flex', justifyContent:'space-between',alignItems:'center'}}>
                        <div className='' style={{margin:'0px 0px 0px 0px'}}>
                            <label style={{color:'#4C3226', fontSize:'17px'}}>Select All Box : </label>
                            <input
                                style={{ margin: '-10px 0px 3px 0px', width:'20px', height:'20px'}}
                                type='checkbox'
                                checked={currentItems.every(item => selectedItems.includes(item._id))}
                                onChange={handleSelectAllChange}
                            />
                            
                                    </div>
                                    <IonButton 
                            size="small"
                            onClick={handleClearAll}
                            style={{
                                backgroundColor: '#B87700', // 🔸 your theme color (change if needed)
                                color: '#fff',              // white text
                                borderRadius: '6px',        // optional: smoother look
                                fontWeight: '500'           // optional: bold text
                            }}
                            >
                            Clear All
                            </IonButton>

                            </IonCol>
                        </IonRow>
                                <IonButton style={{margin:'0px 0px 10px 0px'}} className='left_bottom_fix' shape='round' size='large' color='secondary' onClick={handleupper}>
                                                                <ion-icon name="arrow-up-outline" slot="icon-only"></ion-icon>
                                </IonButton>
                        <IonRow>
                            {currentItems.map(item => (
                                <IonCol size="12" size-sm="6" size-md="4" size-lg="2" key={item._id}>
                                    <IonCard style={{ background: '#fbf2e5', position: 'relative', margin: '0px' }}>
                                        <IonButton
                                            href={`https://api.whatsapp.com/send?text=Check out this item: ${item.filepath}`}
                                            color='secondary'
                                            fill="solid"
                                            shape="round"
                                            target="_blank"
                                            style={{
                                                position: 'absolute',
                                                width: '40px',
                                                height: '40px',
                                                top: '7px',
                                                right: '10px',
                                            }}
                                        >
                                            <ion-icon name="logo-whatsapp" slot="icon-only"></ion-icon>
                                        </IonButton>
                                        <div
                                            onMouseEnter={() => setHoveredItemId(item._id)}
                                            onMouseLeave={() => setHoveredItemId(null)}
                                        >
                                            {hoveredItemId === item._id ? (
                                                <img
                                                    src={getHoverImageUrl(item.filepath)}
                                                    alt="Jewelry Hover"
                                                    className='picjewels hover-image'
                                                />
                                            ) : (
                                                <img
                                                    src={`https://s3.ap-south-1.amazonaws.com/console.v360.tech.output/thumbnails/${item.filepath.split('/')[5].split('?')[0]}.jpg`}
                                                    alt="Jewelry"
                                                    className='picjewels'
                                                />
                                            )}
                                        </div>
                                        <div class='videogld'>
                                            <h6 style={{ margin: '0' }}>{item.name}</h6>
                                            <IonButton

                                                onClick={() => handleItemClick(item)}
                                                color='success'
                                                fill="solid"
                                                shape="round"
                                                target="_blank"
                                            >
                                                <ion-icon name="videocam-outline" slot="icon-only" style={{ color: 'white' }}></ion-icon>
                                            </IonButton>
                                        </div>
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                fontFamily: 'Outfit',
                                                gap: '10px',
                                                padding: '13px',
                                                borderTop: '1px solid rgba(0, 0, 0, 0.22)',
                                            }}
                                        >
                                            <p className='videotip'>Dia pcs: <span> {item?.diapcs}</span></p>
                                            <p className='videotip'>Dia wt: <span>{item?.diawt.toFixed(2)}</span></p>
                                            <p className='videotip'>Net wt: <span>{item?.netwt.toFixed(2)}</span></p>
                                        </div>
                                        <div className='select-cart'>
                                            <input
                                                style={{ margin: 'auto', display: 'block' }}
                                                type='checkbox'
                                                checked={selectedItems.includes(item._id)}
                                                onChange={() => handleCheckboxChange(item._id)}
                                            />
                                        </div>
                                    </IonCard>
                                </IonCol>
                            ))}
                        </IonRow>
                        <IonRow style={{ justifyContent: 'center' }}>
                            <IonCol size='12' style={{ justifyContent: 'center' }}>
                                <IonButtons style={{ justifyContent: 'center' }}>
                                    <IonButton
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ion-icon name="arrow-back-circle-outline" style={{color:'#000'}}></ion-icon>
                                    </IonButton>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <IonButton
                                            key={index + 1}
                                            style={{
                                                backgroundColor: index + 1 === currentPage ? '#f3a41c' : 'transparent',
                                                color: index + 1 === currentPage ? '#fff' : '#000',
                                                borderRadius: index + 1 === currentPage ? '100%' : '100%',
                                                padding: index + 1 === currentPage ? '2px 7px' : '2px 7px',

                                            }}
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </IonButton>
                                    ))}
                                    <IonButton
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ion-icon name="arrow-forward-circle-outline" style={{color:'#000'}}></ion-icon>
                                    </IonButton>
                                </IonButtons>
                            </IonCol>

                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
            <p style={{ textAlign: 'center', fontSize: '13px', backgroundColor: "transparent" }}>All rights are reserved. GreenLab Jewels</p>
        </IonPage >
    );
};

export default Videojewal;

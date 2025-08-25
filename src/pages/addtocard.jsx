import React, { useRef, useEffect, useState, useContext } from 'react';
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
  IonButtons,
  IonCardTitle,
  IonRadio,
  IonRadioGroup,
  IonImg,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonInput,
  IonToast,
  IonRefresher, IonRefresherContent,

} from '@ionic/react';
import '../pages/Tab1.css';
import '../main';
import { IonCol, IonGrid, IonRow, IonTabButton } from '@ionic/react';
import Header from './head';
import { IonTextarea } from '@ionic/react';
import { IonModal } from '@ionic/react';
import { addToCart, clearCart, updateToCart } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { IMG_PATH } from "../config";
import jwtAuthAxios from "../service/jwtAuth";
import { DataContext } from "../context/DataProvider";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { chevronDownCircleOutline } from 'ionicons/icons'


const RadioPage = () => {
  const { id } = useParams();
  const [counter, setCounter] = useState(0);
  const items = useSelector((state) => state.items.cart);
  const dispatch = useDispatch();
  const [productDetails, setProductDetails] = useState([]);
  const [selectedType, setSelectedType] = useState("14K");
  const [sizeDetails, setSizeDetails] = useState([]);
  const [selectSize, setSelectSize] = useState(null);
  const [findings, setFindings] = useState([]);
  const [selectedFindings, setSelectedFindings] = useState('');
  const [diamondGroup, setDiamondGroup] = useState([]);
  const [openModalId, setOpenModalId] = useState(null);
  const [cartDetails, setCartDetails] = useState([]);
  const isFetching = useRef(false)
  const {
    wgt14k,
    wgt18k,
    metalcolor,
  } = productDetails;
  const [selectedMetal, setSelectedMetal] = useState(metalcolor);
  const [selectedQuality, setSelectedQuality] = useState('');
  const [editId, setEditId] = useState(null);
  const [editItemId, setEditItemId] = useState(null);
  const [editItemDetails, setEditItemDetails] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userDetail, setUserDetail] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [form, setForm] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    companyName: "",
    referenceName: "",
  });
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');



  const fetchDataForItem = async (item) => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await jwtAuthAxios.get(
        `master/alldetails?id=${item?.item?.itemtype}`
      );
      setProductDetails(response?.data);
      setSizeDetails(response?.data?.categorySizes);
      setDiamondGroup(response?.data?.diamondParams);
      setFindings(response?.data?.categorySizes[0]?.findings);

      // Set the state variables here
      const metalParts = item.metal.split("-");
      const metalType = metalParts[0];
      const metalcolor = metalParts[1];

      setSelectedType(metalType);
      setSelectedMetal(metalcolor?.toUpperCase());
      setSelectedFindings(item?.finding);
      setSelectedQuality(item?.diamondQuality);
      setSelectSize(item?.size);
      setEditId(item?._id);
      setEditItemId(item?.item?._id);
      setEditItemDetails(item);

    } catch (error) {
      console.error(error?.response?.data?.error);
    }
    finally {
      isFetching.current = false;
    }
  };


  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const closeDropdown = () => {
    setShowDropdown(false);
  };

  const handleRefresh = async (event) => {
    await fetchCartData();
    setTimeout(() => {
      // Any calls to load data go here
      event.detail.complete();
    }, 1500); // Signal that the refresh is complete
  };

  const handleRemoveItem = async (id) => {
    try {
      let payload = {
        itemId: id,
      };
      const response = await jwtAuthAxios.post("client/cart/remove", payload);
      dispatch(addToCart());
      fetchCartData();
      setToastMessage('Item removed successfully');
      setShowToast(true);
    } catch (error) {
      console.error(error?.response?.data?.error);
    }
  };


  const handleSaveChanges = (e, index) => {
    const updatedItem = {
      ...editItemDetails,
      metal: `${selectedType}-${selectedMetal}-GOLD`,
      diamondQuality: selectedQuality,
      size: selectSize,
      finding: selectedFindings,
    };

    setCartDetails((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item, ind) =>
        item.item._id === editItemId && ind === index ? updatedItem : item
      ),
    }));

    dispatch(
      updateToCart({
        itemId: editId,
        quantity: editItemDetails?.quantity,
        metal: `${selectedType}-${selectedMetal}-GOLD`,
        diamondQuality: selectedQuality,
        size: selectSize,
        finding: selectedFindings,
      })
    );
    setToastMessage('Update successfully');
    setShowToast(true);
    setOpenModalId(false);
  };

  const handleSizeChange = (e) => {
    setSelectSize(e.target.value);
  };

  const handleFindingsChange = (e) => {
    setSelectedFindings(e.target.value);
  };


  const openModal = (itemId) => {
    setOpenModalId(itemId);
  };

  const closeModal = () => {
    setOpenModalId(null);
  };


  const handleEditClick = (item) => {
    fetchDataForItem(item);
    openModal(item?._id);
  };


  const handleQuantityChange = (itemId, ind, delta, quantity, id) => {
    setCartDetails((prevCart) => ({
      ...prevCart,
      items: prevCart.items.map((item, index) =>
        item.item._id === itemId && index === ind
          ? { ...item, quantity: item.quantity + delta }
          : item
      ),
    }));
    dispatch(updateToCart({ itemId: id, quantity: quantity + delta }));
  };


  const parseSize = (size) => {
    const match = size?.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  const sortedSizes = sizeDetails?.sort(
    (a, b) => parseSize(a?.size) - parseSize(b?.size)
  );

  useEffect(() => {
    if (findings?.length > 0) {
      setSelectedFindings(findings[0].finding);
    }
  }, [findings]);



  const fetchCartData = async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    try {
      const response = await jwtAuthAxios.get("client/cart");
      setCartDetails(response?.data);
    } catch (error) {
      console.error(error?.response?.data?.error);
    }
    finally {
      isFetching.current = false;
    }
  };


  useEffect(() => {
    fetchCartData();
  }, []);


  useEffect(() => {
    if (metalcolor) {
      setSelectedMetal(metalcolor?.toUpperCase());
    }
  }, [metalcolor]);

  const handleTypeMessage = (id, e, index) => {
    setCartDetails((prevCart) => {
      return {
        ...prevCart,
        items: prevCart.items?.map((item, ind) =>
          item?.item._id === id && ind === index
            ? {
              ...item,
              message: e.target.value,
            }
            : item
        ),
      };
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let err = [];

    if (err?.length > 0) {
      alert("Please address the following issues: \n" + err.join("\n"));
      return err;
    } else {
    }

    if (
      !form.fullName ||
      !form.mobileNumber ||
      !form.email ||
      !form?.companyName
    ) {
      alert("Please fill in all User required fields.");
      return;
    }
    try {
      let payload = {
        user: form,
        items: cartDetails,
      };
      const response = await jwtAuthAxios.post("client/quote-request", payload);
      setToastMessage('Quote Request submitted successfully');
      setShowToast(true);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userDetail,
          username: form?.fullName,
          email: form?.email,
          phone: form?.mobileNumber,
          companyName: form?.companyName,
          referenceName: form?.referenceName,
        })
      );
      dispatch(clearCart());
      history.push("/thanks")
      window.location.href = '/thanks';

    } catch (error) {
      console.error(error?.response?.data?.error);
    }
  };

  useEffect(() => {
    setForm({
      fullName: userDetail?.username,
      mobileNumber: userDetail?.mobileNo,
      email: userDetail?.email,
      companyName: userDetail?.company,
      referenceName: userDetail?.refrence,
    });
  }, [userDetail]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUserDetail(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  return (
    <>
      <IonHeader>
        <h1>home</h1>
      </IonHeader>
      <Header />
      <IonContent color="primary" style={{ paddingBottom: '80x', marginBottom: '100px' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh} >
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            refreshingSpinner="circles"
          ></IonRefresherContent>
        </IonRefresher>
        <h4 className="text-center mb-5 element" style={{ marginTop: '20px' }}>add to Card</h4>
        {cartDetails?.items?.length === 0 || cartDetails?.message ? (
          <div
            style={{
              background: "#fff6ec",
              display: "flex",
              alignItems: "center",
              justifyContent: 'center'
            }}
          >
            <div>
              <IonImg
                src='/img/datanotfound.png'
                style={{ maxWidth: "360px", width: "100%" }}
              />
              <h3 style={{ textAlign: 'center' }}>Your cart is empty</h3>
            </div>
          </div>
        ) : (
          <div style={{ paddingBottom: '80x', marginBottom: '75px', position: 'relative' }}>
            {cartDetails?.items?.map((item, index) => (
              <div style={{ padding: ' 0', border: '1px solid rgb(0 0 0 / 19%)', margin: '10px', borderRadius: '9px', background: '#fff' }}>
                <IonGrid>
                  <IonRow key={`${item.item?._id}-${index}`} >
                    <IonCol size='12'>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'space-between' }}>
                        <IonCardTitle style={{ color: '#4c3226', textTransform: 'uppercase', justifyContent: 'center', display: 'flex', fontSize: '16px' }}>
                          {item?.item?.name}
                        </IonCardTitle>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <div>
                            <IonButton shape='round' onClick={() => handleEditClick(item)} >
                              <div key={`${item.item?._id}-${index}`}>
                                <Ion-Icon name="create-outline" slot="icon-only" size='small' style={{ color: 'red' }}></Ion-Icon>
                              </div>
                            </IonButton>
                          </div>
                          <IonButton shape='round' onClick={() => handleRemoveItem(item?.item?._id)}>
                            <Ion-Icon slot="icon-only" size='small' name="trash-outline" style={{ color: ' red' }}></Ion-Icon>
                          </IonButton>
                        </div>
                      </div>
                    </IonCol>
                    <IonCol size="4">
                      <IonCardHeader style={{ padding: '0px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                        <img src={IMG_PATH + item?.item?.thumbnailImage}
                          alt={item?.sku} style={{ maxWidth: "160px", width: '100%', height: '125px', objectFit: 'contain' }} />
                      </IonCardHeader>
                    </IonCol>
                    <IonCol size="8">
                      <IonCardContent style={{ padding: '0', border: '0' }} border="0">
                        <IonList style={{ border: '0' }}>
                          <div style={{ border: '0' }}>
                            <div className='d-block' style={{ paddingBottom: '10px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '5px' }}>
                                <h5 className="badge me-2" >{item?.metal}</h5>
                                <h5 className="badge me-2" >{item?.size}</h5>
                                <h5 className="badge me-2" >{item?.finding}</h5>
                                <h5 className="badge me-2" >{item?.diamondQuality}</h5>
                                <h5 className="badge me-2" >{item?.item?.colorstone}</h5>
                                {item?.item?.sidectwt > 0 && (
                                  <h5 className="badge me-2" >
                                    Side Cts : {(item?.item?.sidectwt).toFixed(2)}
                                  </h5>
                                )}
                                {item?.item?.centerctwt > 0 && (
                                  <h5 className="badge me-2" >
                                    Center Cts :{" "}
                                    {(item?.item?.centerctwt).toFixed(2)}
                                  </h5>
                                )}
                                <h5 className="badge me-2" >Total Diamonds :{item?.item?.diaqty}</h5>
                                <h5 className="badge me-2" >
                                  {selectedType === "14K" && `14k weight : ${item?.item?.wgt14k?.toFixed(2)}`}
                                </h5>
                                <h5 className="badge me-2" >
                                  {selectedType === "18K" && `18k weight : ${item?.item?.wgt18k?.toFixed(2)}`}
                                </h5>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Poppins' }}>
                                <IonButton fill="clear" size='large' slot="icon-only" onClick={() =>
                                  handleQuantityChange(
                                    item?.item?._id,
                                    index,
                                    -1,
                                    item?.quantity,
                                    item?._id
                                  )
                                }
                                  disabled={item?.quantity === 1}
                                >
                                  <div style={{ border: '1px solid #000000b8', padding: '6px 12px', borderRadius: ' 10px 0px 0px 10px' }}>
                                    <ion-icon name="remove-circle-outline" slot="icon-only" style={{ color: ' black' }}></ion-icon>
                                  </div>
                                </IonButton>
                                <span style={{
                                  margin: '0px 2px', width: '16px', textAlign: 'center', color: 'black'
                                }}>{item?.quantity}</span>
                                < IonButton fill="clear" size='large' onClick={() =>
                                  handleQuantityChange(
                                    item?.item?._id,
                                    index,
                                    1,
                                    item?.quantity,
                                    item?._id
                                  )
                                }
                                >
                                  <div style={{ border: '1px solid #000000b8', padding: '6px 12px', borderRadius: ' 0px 10px 10px 0px' }}>
                                    <ion-icon name="add-circle-outline" slot="icon-only" style={{ color: ' black' }}></ion-icon>
                                  </div>
                                </IonButton>
                              </div>
                              {/* <IonTextarea
                                fill="outline"
                                placeholder="Type Message"
                                style={{ color: 'black' }}
                                value={item?.message || ''}
                                onIonChange={(e) => handleTypeMessage(item?.item?._id, e, index)}
                              ></IonTextarea> */}
                              <textarea
                                placeholder="Type Message"
                                style={{ color: 'black', width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc', outline: 'none', resize: 'none' }}
                                value={item?.message || ''}
                                onChange={(e) => handleTypeMessage(item?.item?._id, e, index)}
                              ></textarea>

                            </div>
                          </div>
                        </IonList>
                      </IonCardContent>
                    </IonCol>
                    <div>
                      {openModalId === item?._id && (
                        <div className="popup-1" >
                          <div className="popup popup235">

                            <div>
                              <h6>Metal</h6>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  margin: '0',
                                }}
                              >
                                <div
                                  className={`btn btn-default ${selectedType === '14K' ? 'selected' : ''}`}
                                  onClick={() => setSelectedType('14K')}
                                  style={{
                                    color: 'black',
                                    marginRight: '0',
                                    width: '100%',
                                    maxWidth: '100%',
                                    border: selectedType === '14K' ? '2px solid #c39862' : '2px solid #ccc',
                                    background: selectedType === '14K' ? '#ffe6ca' : '#fff',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <div style={{ width: '100%' }}>
                                    <span className="option-label">14K Gold</span>
                                    <div
                                      className="px-product"
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexFlow: 'wrap',
                                      }}
                                    >
                                      {item?.item.wgt14k?.toFixed(2)} Grams
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
                                </div>

                                <div
                                  className={`btn btn-default ${selectedType === '18K' ? 'selected' : ''}`}
                                  onClick={() => setSelectedType('18K')}
                                  style={{
                                    color: 'black',
                                    marginRight: '0',
                                    width: '100%',
                                    maxWidth: '100%',
                                    border: selectedType === '18K' ? '2px solid #c39862' : '2px solid #ccc',
                                    background: selectedType === '18K' ? ' #ffe6ca' : '#fff',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <div style={{ width: '100%' }}>
                                    <span className="option-label">18K Gold</span>
                                    <div
                                      className="px-product"
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexFlow: 'wrap',
                                      }}
                                    >
                                      {item?.item.wgt18k?.toFixed(2)} Grams
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
                                </div>
                              </div>
                            </div>
                            <div className='main-color'>
                              <h6>Metal Color</h6>
                              <IonRadioGroup class='radio-group-wrapper-main' value={selectedMetal} onIonChange={e => setSelectedMetal(e.detail.value)} expand="block" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '0', justifyContent: 'space-between' }}>
                                {["ROSE", "WHITE", "YELLOW"].map((metal) => (
                                  <IonRadio
                                    key={metal}
                                    className="btn btn-default"
                                    value={metal}
                                    color='secondary'
                                    labelPlacement="fixed"
                                    alignment="center"
                                    style={{ color: 'black', marginRight: '0', maxWidth: '100px' }}
                                  >
                                    <div style={{ width: '80%' }}>
                                      <span className="option-label">
                                        <IonImg className='slider-img '
                                          src={`/img/color-${metal.toLowerCase()}.svg`}
                                          style={{ width: '26px', height: '26px', objectFit: 'cover', borderRadius: '9px' }}
                                        />
                                      </span>
                                      <div className="px-product">
                                        {metal}
                                      </div>
                                    </div>
                                  </IonRadio>
                                ))}
                              </IonRadioGroup>
                            </div>

                            <div className="diamondcolmin" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px' }}>
                              <h6>Diamond Quality</h6>
                              <div className='radio-group-main'>

                              
                              {diamondGroup.length > 0 ? (
                                diamondGroup.map((item, i) =>
                                  item.data.map((ele, j) => (
                                    <div
                                      key={`${i}-${j}`}
                                      className="diamondcol"
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        margin: '0',
                                      }}
                                    >
                                      <label
                                        htmlFor={`diamond-${i}-${j}`}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '10px',
                                          margin: '0',
                                        }}
                                      >
                                        <input
                                          type="radio"
                                          id={`diamond-${i}-${j}`}
                                          name="diamondQuality"
                                          value={ele}
                                          checked={selectedQuality === ele}
                                          onChange={() => setSelectedQuality(ele)}
                                          style={{
                                            color: '#4c3226',
                                            padding: '5px 6px',
                                            backgroundColor: selectedQuality === ele ? 'rgb(255 230 202)' : 'rgb(255 246 236)',
                                            cursor: 'pointer',
                                            borderRadius: '24px',
                                            border: '1px solid #a7a7a7',
                                            transition: 'background-color 0.3s ease',
                                            accentColor: '#4c3226',
                                          }}
                                        />
                                        <span>{ele}</span>
                                      </label>
                                    </div>
                                  ))
                                )
                              ) : (
                                <p>No diamond group data available</p>
                              )}
                              </div>
                            </div>
                            <div>
                              <IonCol size='12' style={{}}>
                                {sortedSizes?.length > 0 &&
                                  sortedSizes[0]?.sizes &&
                                  sortedSizes[0]?.sizes?.length > 0 && (
                                    <select
                                      value={selectSize}
                                      placeholder="Select Size"
                                      onChange={(e) => handleSizeChange(e)}
                                      style={{
                                        borderRadius: '10px',
                                        // margin: '0px 0px 0px 10px',
                                        fontSize: '14px',
                                        border: '1px solid #7f7d7d',
                                        width: "100%",
                                        backgroundColor: '#fff6ec',
                                        color: 'rgb(76 50 38)',
                                        padding: '12px 15px',
                                        margin: "15px -5px"
                                      }}
                                    >
                                      {sortedSizes[0]?.sizes?.map(
                                        (size, i) => (
                                          <option
                                            key={size?._id}
                                            value={size?.size}
                                          >
                                            {size?.size}
                                          </option>
                                        )
                                      )}

                                    </select>
                                  )}
                                {findings?.length > 0 && (
                                  <select
                                    value={selectedFindings || ""}
                                    placeholder="Select Size"
                                    // label-placement="floating"
                                    onChange={(e) => handleFindingsChange(e)}
                                    // interface="popover"
                                    style={{
                                      borderRadius: '10px',
                                      maxWidth: '100%',
                                      fontSize: '14px',
                                      border: '1px solid #7f7d7d',
                                      backgroundColor: '#fff6ec',
                                      color: 'rgb(76 50 38)',
                                      padding: '10px 5px',
                                      margin: '15px -5px'
                                    }}
                                  // size="small"
                                  >
                                    {findings.map((finding, i) => (
                                      <option
                                        key={finding?._id}
                                        value={finding?.finding}
                                      >
                                        {finding?.finding}
                                      </option>
                                    ))}

                                  </select>
                                )}
                              </IonCol>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <IonButton onClick={(e) => handleSaveChanges(e, index)} style={{ width: '100%', margin: '15px 0', background: '#f3a41c' }} expand="full">Save</IonButton>
                              <IonButton onClick={() => setOpenModalId(null)} style={{ width: '100%', margin: '15px 0', background: '#f3a41c' }} expand="full">Close</IonButton>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </IonRow>
                </IonGrid>

              </div>
            ))}
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message={toastMessage}
              duration={2000}
            />
            <div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <IonButton color='secondary' onClick={toggleDropdown}>
                  Quotation Details
                </IonButton>
              </div>
            </div>
          </div>
        )}


        {showDropdown && (
          <div className='profileque'>
            <div className='profileque-1'>
              <div style={{ fontSize: '24px', justifyContent: 'end', padding: '0', display: 'flex', marginBottom: '-14px', marginRight: '10px', marginTop: '10px' }}>
                <ion-icon name="close-outline" onClick={closeDropdown} style={{ color: '#000' }}></ion-icon>
              </div>
              <div className="profile" style={{ marginTop: '10px' }}>
                <IonCardHeader>
                  <IonCardTitle style={{ color: 'rgb(76 50 38)', fontSize: '20px', letterSpacing: '1.1px' }}>Quotation Details</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={handleSubmit}>
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Name:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.fullName}
                      onIonChange={handleInputChange}
                      type="text"
                      name="fullName"
                      required
                      disabled
                    />
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Customer Mobile No:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.mobileNumber}
                      type="tel"
                      name="mobileNumber"
                      onIonChange={handleInputChange}
                      required
                      fill="clear"
                      color="secondary"
                    />
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Customer Email:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.email}
                      type="email"
                      name="email"
                      onIonChange={handleInputChange}
                      color="secondary"
                      required
                    />
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Company Name:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.companyName}
                      type="text"
                      name="companyName"
                      color="secondary"
                      onIonChange={handleInputChange}
                      required
                    />
                    <IonLabel position="stacked" style={{ display: 'flex' }}>
                      Reference Name:<span className="text-danger" style={{ color: 'red' }}>*</span>
                    </IonLabel>
                    <IonInput
                      style={{ textAlign: 'start' }}
                      value={form?.referenceName}
                      onIonChange={handleInputChange}
                      type="text"
                      color="secondary"
                      name="referenceName"
                      required
                    />
                  </form>
                  <form onSubmit={handleSubmit}>
                    <IonButton expand="full" type="submit" style={{ background: '#feddb2', letterSpacing: '0.1px', marginTop: '10px', color: '#4c3226', display: 'block' }} >
                      Confirm Order
                      <span style={{ fontSize: '10px' }}>(Ask for Quotation)</span>
                    </IonButton>
                  </form>
                </IonCardContent>
              </div>
            </div>
          </div>
        )}
      </IonContent >



    </>
  );
};

export default RadioPage;
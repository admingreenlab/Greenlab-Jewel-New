import React, { useContext, useEffect, useState, useMemo, useRef } from "react";
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
// import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonSearchbar,
  IonRow,
  IonCol,
  IonPage,
  IonButton
} from '@ionic/react';
import { useHistory } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import Header from './head';
import jwtAuthAxios from "../service/jwtAuth";

const LibraryPage = () => {
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [searchName, setSearchName] = useState();
  // const navigate = useNavigate();
  const history = useHistory();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await jwtAuthAxios.get(`master/search?name=${searchName}`);
      if (response.data.items.length > 0) {
        if (response.data.items.length <= 5) {
          history.push(`/product/${response.data.items[0]._id}`);
        } else {
          history.push(`/category/${response.data.items[0].category[0]._id}`);
        }
      }
      setSearchName("");
    } catch (error) {
      console.error(error?.response?.data?.error);

    }
  };

  const handleSuggestionClick = (category) => {
    history.push(`/category/${category._id}`);
    setSearchName(category.name);
    setCategorySuggestions([]);
  };

  const handleCategorySuggestions = async (input) => {
    if (input.length === 0) {
      setCategorySuggestions([]);
      return;
    }
    try {
      const response = await jwtAuthAxios.get(`master/search?name=${input}`);
      setCategorySuggestions(response.data.categories);
    } catch (error) {
      console.error("Error fetching category suggestions:", error);
    }
  };

  return (
    <>
      <IonPage>
      <Header />
      <IonContent>
        <IonRow>
          <IonCol>
            <div>
              <IonCard style={{
                marginBottom: '20px',
                marginTop: '85px'
              }}>
                <IonCardHeader className='maindheadider' style={{ backgraount: '#a97550' }}>
                  <IonCardTitle> Search </IonCardTitle>
                </IonCardHeader>
                <IonCardContent style={{ paddingLeft: '0', paddingRight: '0', height: '100vh' }}>
                  <form onSubmit={handleSearch}>
                    <div className="search">
                      <input

                        style={{ border: '0', width0: '100%' }}
                        type="text"
                        placeholder="Type your search Name..."
                        value={searchName}
                        onChange={(e) => {
                          setSearchName(e.target.value);
                          handleCategorySuggestions(e.target.value);
                        }}

                      />
                      <span style={{ position: 'absolute', top: '13px', right: '36px', fontSize: '18px' }}><ion-icon name="search-outline"></ion-icon></span>
                    </div>
                    {categorySuggestions?.length > 0 && (
                      <ul style={{ listStyleType: "none", padding: 0 }} className="Search">
                        {categorySuggestions?.map((category) => (
                          <li
                            key={category._id}
                            style={{ cursor: "pointer", padding: "5px 0px 0px 20px", marginTop: "2px" }}
                            onClick={() => handleSuggestionClick(category)}
                          >
                            {category.name}
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* <IonButton
                  type="submit"
                  style={{ margin: '20px', color: '#000' }}
                  className="button --shutter --up w-100"
                  disabled={searchName?.length === 0}
                >
                  Search
                </IonButton> */}
                  </form>
                  {/* <IonToolbar
              >
                <IonSearchbar style={{ marginTop: "20px" }}></IonSearchbar>
              </IonToolbar> */}
                </IonCardContent>
              </IonCard>
            </div>
          </IonCol>
        </IonRow>

      </IonContent>

      </IonPage>
    </>
  );
};

export default LibraryPage;

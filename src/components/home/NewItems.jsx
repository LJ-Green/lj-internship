import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "./styles.css";

SwiperCore.use([Navigation, Pagination]);

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      );

      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching new items:", error);
    }
  };

  useEffect(() => {
    const updateRemainingTime = () => {
      const currentTime = Date.now();
      const updatedItems = items.map((item) => {
        const remainingTime = Math.max(0, item.expiryDate - currentTime);
        return { ...item, remainingTime };
      });
      setItems(updatedItems);
    };

    const intervalId = setInterval(updateRemainingTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [items]);

  const formatTime = (time) => {
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const renderItems = () => {
    if (loading) {
      return (
        <>
          {[...Array(4)].map((_, index) => (
            <SwiperSlide key={index}>
              <div className="nft__item-skeleton"></div>
            </SwiperSlide>
          ))}
        </>
      );
    } else {
      return items.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="nft__item">
            <div className="author_list_pp">
              <Link
                to={`/author/${item.authorId}`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={`Creator: ${item.authorId}`}
              >
                <img className="lazy" src={item.authorImage} alt="" />
                <i className="fa fa-check"></i>
              </Link>
            </div>
            <div
              className={`de_countdown ${
                !item.expiryDate || isNaN(item.remainingTime) ? "hidden" : ""
              }`}
            >
              {item.expiryDate && formatTime(item.remainingTime)}
            </div>
            <div className="nft__item_wrap">
              <div className="nft__item_extra">
                <div className="nft__item_buttons">
                  <button>Buy Now</button>
                  <div className="nft__item_share">
                    <h4>Share</h4>
                    <a href="" target="_blank" rel="noreferrer">
                      <i className="fa fa-facebook fa-lg"></i>
                    </a>
                    <a href="" target="_blank" rel="noreferrer">
                      <i className="fa fa-twitter fa-lg"></i>
                    </a>
                    <a href="">
                      <i className="fa fa-envelope fa-lg"></i>
                    </a>
                  </div>
                </div>
              </div>

              <Link to={`/item-details/${item.nftId}`}>
                <img
                  src={item.nftImage}
                  className="lazy nft__item_preview"
                  alt=""
                />
              </Link>
            </div>
            <div className="nft__item_info">
              <Link to="/item-details">
                <h4>{item.title}</h4>
              </Link>
              <div className="nft__item_price">{item.price} ETH</div>
              <div className="nft__item_like">
                <i className="fa fa-heart"></i>
                <span>{item.likes}</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ));
    }
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <Swiper
            slidesPerView={4}
            spaceBetween={20}
            navigation
            loop
            breakpoints={{
              390: {
                slidesPerView: 1,
              },
              660: {
                slidesPerView: 2,
              },
              856: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
            }}
            style={{
              "--swiper-navigation-size": "15px",
            }}
          >
            {renderItems()}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
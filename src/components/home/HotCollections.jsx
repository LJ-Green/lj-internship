import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import "./styles.css";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
        );
        setCollections(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching hot collections:", error);
      }
    };

    window.onload = () => {
      const timer = setTimeout(() => {
        fetchData();
      }, 1000);

      return () => clearTimeout(timer);
    };
  }, []);

  const breakpoints = {
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
  };

  const renderSkeleton = () => {
    return (
      <div className="skeleton-container">
        <div className="skeleton-row">
          {[...Array(4)].map((_, index) => (
            <div className="hc__skeleton-item" key={index}></div>
          ))}
        </div>
      </div>
    );
  };

  const collectionItems = collections.map((collection, index) => (
    <SwiperSlide key={index}>
      <div className="nft_coll">
        <div className="nft_wrap">
          <Link to={`/item-details/${collection.nftId}`}>
            <img
              src={collection.nftImage}
              className="lazy img-fluid"
              alt=""
              style={{ width: "100%", height: "100%" }}
            />
          </Link>
        </div>
        <div className="nft_coll_pp">
          <Link to={`/author/${collection.authorId}`}>
            <img
              className="lazy pp-coll"
              src={collection.authorImage}
              alt=""
            />
          </Link>
          <i className="fa fa-check"></i>
        </div>
        <div className="nft_coll_info">
          <Link to="/explore">
            <h4>{collection.title}</h4>
          </Link>
          <span>ERC-{collection.code}</span>
        </div>
      </div>
    </SwiperSlide>
  ));

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          {loading && !collections.length ? (
            <div className="skeleton-container">{renderSkeleton()}</div>
          ) : collections.length > 0 ? (
            <Swiper
              navigation
              modules={[Navigation]}
              className="mySwiper"
              breakpoints={breakpoints}
              loop
              spaceBetween={20}
              style={{
                "--swiper-navigation-size": "15px",
              }}
            >
              {collectionItems}
            </Swiper>
          ) : (
            <div>No collections available</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

const TopSellers = () => {
  const [topSellers, setTopSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetchTopSellers();
  }, []);

  const fetchTopSellers = async () => {
    try {
      setTimeout(async () => {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );
        setTopSellers(response.data);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const renderSkeletonLoading = () => {
    return [...Array(12)].map((_, index) => (
      <li key={index}>
        <div className="author_list_pp skeleton-loading">
          <div className="skeleton-loading-image"></div>
        </div>
        <div className="author_list_info skeleton-loading">
          <div className="skeleton-loading-text"></div>
          <div className="skeleton-loading-text"></div>
        </div>
      </li>
    ));
  };

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            {isLoading ? (
              <ol className="author_list">
                {renderSkeletonLoading()}
              </ol>
            ) : (
              topSellers.length > 0 ? (
                <ol className="author_list">
                  {topSellers.map((seller) => (
                    <li key={seller.authorId}>
                      <div className="author_list_pp">
                        <Link to={`/author/${seller.authorId}`}>
                          <img
                            className="lazy pp-author"
                            src={seller.authorImage}
                            alt=""
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${seller.authorId}`}>{seller.authorName}</Link>
                        <span>{seller.price} ETH</span>
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No top sellers available.</p>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;

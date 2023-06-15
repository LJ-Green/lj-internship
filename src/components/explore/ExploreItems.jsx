import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ExploreItems = () => {
  const [items, setItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(8);
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const url = `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore${
        selectedFilter ? `?filter=${selectedFilter}` : ""
      }`;

      try {
        const response = await axios.get(url);
        setItems(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, [selectedFilter]);

  const handleLoadMore = () => {
    setVisibleItems((prevVisibleItems) => prevVisibleItems + 4);
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const CountdownTimer = ({ expiryDate }) => {
    const calculateTimeLeft = () => {
      const difference = new Date(expiryDate) - new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }, []);

    return (
      <div>
        {timeLeft.hours > 0 && <span>{timeLeft.hours}h </span>}
        {timeLeft.minutes > 0 && <span>{timeLeft.minutes}m </span>}
        {timeLeft.seconds > 0 && <span>{timeLeft.seconds}s</span>}
      </div>
    );
  };

  return (
    <>
      <div>
        <select id="filter-items" value={selectedFilter} onChange={handleFilterChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      {items.slice(0, visibleItems).map((item, index) => (
        <div
          key={index}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
            <div className="author_list_pp">
              <Link
                to={`/author/${item.authorId}`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <img className="lazy" src={item.authorImage} alt="" />
                <i className="fa fa-check"></i>
              </Link>
            </div>
            <div className="de_countdown">
              <CountdownTimer expiryDate={item.expiryDate} />
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
              <Link to={`/item-details/${item.nftId}`}>
                <h4>{item.title}</h4>
              </Link>
              <div className="nft__item_price">{item.price} ETH</div>
              <div className="nft__item_like">
                <i className="fa fa-heart"></i>
                <span>{item.likes}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
      {visibleItems < items.length && (
        <div className="col-md-12 text-center">
          <button onClick={handleLoadMore} className="btn-main lead">
            Load more
          </button>
        </div>
      )}
    </>
  );
};

export default ExploreItems;
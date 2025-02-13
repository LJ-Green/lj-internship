import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import axios from "axios";
import "./styles.css"; 
import AuthorItems from "../components/author/AuthorItems";

const ProfileSkeleton = () => (
  <div className="profile-skeleton">
    <div className="profile-avatar-skeleton"></div>
    <div className="profile-name-skeleton"></div>
  </div>
);

const AuthorItemsSkeleton = () => (
  <div className="author-items-skeleton">
    <div className="author-item-skeleton"></div>
    <div className="author-item-skeleton"></div>
    <div className="author-item-skeleton"></div>
    <div className="author-item-skeleton"></div>
    <div className="author-item-skeleton"></div>
    <div className="author-item-skeleton"></div>
    <div className="author-item-skeleton"></div>
    <div className="author-item-skeleton"></div>
  </div>
);

const Author = () => {
  const { authorId } = useParams();
  const [authorData, setAuthorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followed, setFollowed] = useState(false); 

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const response = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        setAuthorData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };

    fetchAuthorData();
  }, [authorId]);

  useEffect(() => {
    const isFollowed = localStorage.getItem("followed");
    if (isFollowed) {
      setFollowed(true);
    }
  }, []);

  const handleFollow = async () => {
    try {
      const isFollowed = localStorage.getItem("followed");
      if (isFollowed) {
        return;
      }
  
      await axios.post(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?",
        {
          authorId: authorData?.authorId,
        }
      );
  
      setAuthorData((prevAuthorData) => ({
        ...prevAuthorData,
        followers: prevAuthorData.followers + 1,
      }));
  
      setFollowed((prevFollowed) => !prevFollowed); // Toggle the followed state
      localStorage.setItem("followed", true);
    } catch (error) {
      console.error("Error following the author:", error);
    }
  };

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                {isLoading ? (
                  <ProfileSkeleton />
                ) : (
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={authorData?.authorImage} alt="" />

                        <i className="fa fa-check"></i>
                        <div className="profile_name">
                          <h4>
                            {authorData?.authorName}
                            <span className="profile_username">
                              @{authorData?.tag}
                            </span>
                            <span id="wallet" className="profile_wallet">
                              {authorData?.address}
                            </span>
                            <button id="btn_copy" title="Copy Text">
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {authorData?.followers} followers
                        </div>
                        <button
                          className="btn-main"
                          onClick={handleFollow}
                          disabled={followed}
                        >
                          {followed ? "Followed" : "Follow"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-md-12">
                {isLoading ? (
                  <AuthorItemsSkeleton />
                ) : (
                  <div className="de_tab tab_simple">
                    <AuthorItems authorId={authorData?.authorId} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
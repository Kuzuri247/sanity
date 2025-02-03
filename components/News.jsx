"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";
import NewsItem from "./NewsItem";
import { PacmanLoader } from "react-spinners";

const apikey = process.env.NEWS_URL;

const News = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [esportsNews, setEsportsNews] = useState([]);
  const [gamingNews, setGamingNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
  
  useEffect(() => {
    const fetchNews = async (category, setter) => {
      try {
        const url = `https://gnews.io/api/v4/search?q=${category}&lang=en&country=us&max=10&apikey=6116667592e791bb2e912ebe3a45ad18`;
        const response = await axios.get(url);

        if (response.status === 200) {
          const articlesWithImages = response.data.articles.filter(
            (article) => article.image
          );
          setter(articlesWithImages);
        } else {
          console.error(`Error fetching ${category} news: ${response.status}`);
          setError(`Something wrong happened with ${category} news.`);
        }
      } catch (error) {
        console.error(`Error fetching ${category} news:`, error);
        setError(`Something wrong happened with ${category} news.`);
      }
    };

    const fetchAllNews = async () => {
      setIsLoading(true); // Start loading
      await Promise.all([
        fetchNews("Gaming", setLatestNews),
        fetchNews("Esports", setEsportsNews),
        fetchNews("Gaming News", setGamingNews)
      ]);
      setIsLoading(false); // Stop loading after all fetches complete
    };

    fetchAllNews();
  }, []);

  const sliderRefs = {
    latestNews: useRef(null),
    esportsNews: useRef(null),
    gamingNews: useRef(null),
  };

  const scroll = (category, direction) => {
    const slider = sliderRefs[category].current;
    if (slider) {
      const scrollAmount = direction === "left" ? -300 : 300;
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const renderNewsSlider = (title, articles, category) => (
    <div className="mb-16 mt-2 h-fit">
      <div className="uppercase text-center text-2xl md:text-3xl h-fit font-semibold flex justify-center items-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        {title}
      </div>

      <div className="w-full flex justify-center mt-4 h-fit">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <PacmanLoader color="yellow" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 text-base font-semibold">
            {error}
          </div>
        ) : (
          <div
            ref={sliderRefs[category]}
            className="grid grid-cols-1 p-2 m-2 md:grid-cols-2 md:p-1 md:m-1 w-full max-w-6xl"
          >
            {articles.map((article, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-lg border border-slate-700 shadow-md bg-black my-10 mx-5"
              >
                <div className="w-full h-fit">
                  <NewsItem
                    title={article.title}
                    description={article.description}
                    url={article.url}
                    urlToImage={article.image}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container px-2 h-fit">
      {renderNewsSlider("Latest News", latestNews, "latestNews")}
      {renderNewsSlider("Esports", esportsNews, "esportsNews")}
      {renderNewsSlider("Gaming News", gamingNews, "gamingNews")}
    </div>
  );
};

export default News;

import "react-vertical-timeline-component/style.min.css";
import "./style.scss";

import {
    API_NEWS_KEY,
    API_NEWS_URL,
} from "../../Common/APIUtils/News/ApiParameter";
import React, { useEffect, useState } from "react";
import { SIX_HOURS, getExecutionTimeToNow } from "../../../utils/getTime";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { currentDate, getThreeDaysAgo } from "../../../utils/getDate";
import { readFromCache, writeToCache } from "../../../utils/cache";

import { Card } from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";

/* Function to render card newspaper item */
const cardRender = (data) => {
    return (
        <Card className="border-0">
            <Card.Img variant="top" src={data.urlToImage} />
            <Card.Body>
                <Card.Subtitle className="fw-bold text-white">
                    { data.title }
                </Card.Subtitle>
                <Card.Text className="fw-normal mb-2 d-none d-lg-block">
                    { data.content.slice(0, 70) + "..." }
                </Card.Text>
                <a
                    href={ data.url }
                    className="text-decoration-none text-warning fw-bold stretched-link d-none d-lg-block"
                >
                    Continue reading
                </a>
            </Card.Body>
        </Card>
    );
};

/* Function to render newspapers */
const NewsTimeline = () => {
    const [dataItem, setData] = useState([]);
    const selectedStock = useSelector((state) => state.selectedStock);
    const [stock, setstock] = useState(selectedStock);

    const getAPINewsKey = API_NEWS_KEY;
    const getAPINewsURL = API_NEWS_URL;

    const URL_NEWS = () => {
        let url = getAPINewsURL;
        url = url.concat(
            "q=",
            `${stock === null ? "" : stock.stockName.split(" ")[0]}`,
            " +stock"
        );
        url = url.concat("&language=en");
        url = url.concat("&from=", `${getThreeDaysAgo()}`);
        url = url.concat("&to=", `${currentDate()}`);
        url = url.concat("&sortBy=relevancy");
        url = url.concat("&pageSize=20");
        url = url.concat("&apiKey=", `${getAPINewsKey}`);
        return url;
    };

    const fetchAPI = async (URL) => {
        return await axios.get(URL).then((res) => {
            if (res.data.status === "ok") {
                return res.data.articles;
            } else {
                return [];
            }
        });
    };

    const fetchNewDataAPI = async (URL, keyStorage) => {
        let items = readFromCache("NewsAPI");

        fetchAPI(URL).then((data) => {
            const itemToCache = {
                name: keyStorage,
                keyStorage: data,
                fetch_time: new Date().getTime(),
            };
            items.push(itemToCache);
            writeToCache("NewsAPI", items);
        });

        console.log("fetchNewDataAPI");
        return items;
    };

    const fetchFreshDataAPI = async (URL, keyStorage) => {
        let items = readFromCache("NewsAPI");
        let checkItem = items.filter((item) => item["name"] === keyStorage);

        let mem_index = -1;
        let flag_checked = false;

        if (checkItem.length > 0) {
            flag_checked = true;
            for (let i = 0; i < items.length; i++) {
                if (items[i]["name"] === keyStorage) {
                    if (
                        getExecutionTimeToNow(items[i]["fetch_time"]) >=
                        SIX_HOURS
                    ) {
                        mem_index = i;
                    }
                    break;
                }
            }
        }

        if (mem_index === -1 && flag_checked === true) {
            // This means item found, but no enough time
            console.log("Caching case!");
            console.log(items);
            return items;
        }

        fetchAPI(URL).then((data) => {
            if (flag_checked === false) {
                // Item not found
                const itemToCache = {
                    name: keyStorage,
                    keyStorage: data,
                    fetch_time: new Date().getTime(),
                };
                items.push(itemToCache);
                writeToCache("NewsAPI", items);
                console.log("Append case");
            } else {
                // Item found and enough time
                if (items[mem_index]["name"] === keyStorage) {
                    items[mem_index]["keyStorage"] = data;
                    items[mem_index]["fetch_time"] = new Date().getTime();
                }
                console.log(
                    "Modify case",
                    items[mem_index]["name"] === keyStorage
                );
            }
        });
        return items;
    };

    const getNewsAPIData = async (URL, keyStorage) => {
        let items;
        setData([]);

        let cachedData = readFromCache("NewsAPI");

        if (cachedData.length === 0) {
            writeToCache("NewsAPI", []);
            items = await fetchNewDataAPI(URL, keyStorage);
        } else {
            items = await fetchFreshDataAPI(URL, keyStorage);
        }

        for (let i = 0; i < items.length; i++) {
            if (items[i]["name"] === keyStorage) {
                setData(items[i]["keyStorage"]);
                break;
            }
        }
    };

    useEffect(() => {
        setstock(selectedStock);
        console.log("News API updates to", selectedStock);
        getNewsAPIData(
            URL_NEWS(),
            "".concat(
                `${stock === null ? "" : stock.stockName.split(" ")[0]}`,
                " +stock"
            )
        );
    }, [selectedStock]);

    return (
        <div className="timeline-container">
            <div className="fs-4 fw-bold text-center text-warning ms-5">
                <span className="me-2 pb-1">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="28" 
                        height="28" 
                        fill="currentColor" 
                        className="bi bi-newspaper text-warning" 
                        viewBox="0 0 16 16"
                    >
                        <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5v-11zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5H12z"/>
                        <path d="M2 3h10v2H2V3zm0 3h4v3H2V6zm0 4h4v1H2v-1zm0 2h4v1H2v-1zm5-6h2v1H7V6zm3 0h2v1h-2V6zM7 8h2v1H7V8zm3 0h2v1h-2V8zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1z"/>
                    </svg>
                </span>
                TRENDING NEWS
            </div>
            <VerticalTimeline 
                layout="1-column"
                lineColor="yellow"
            >
                {dataItem.map((event, index) => (
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        date={event.publishedAt}
                        dateClassName="text-light ms-2"
                        iconStyle={{
                            background: "rgb(33, 150, 243)",
                            color: "#fff",
                        }}
                        key={index}
                    >
                        <h3
                            className="vertical-timeline-element-title"
                            dangerouslySetInnerHTML={{ __html: event.event }}
                        />
                        {cardRender(event)}
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </div>
    );
};

export default NewsTimeline;

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
        <Card>
            <Card.Img variant="top" src={data.urlToImage} />
            <Card.Body>
                <Card.Subtitle>{data.title}</Card.Subtitle>
                <Card.Text className="fw-normal mb-2">
                    {data.content.slice(0, 100) + "..."}
                </Card.Text>
                <a
                    href={data.url}
                    className="text-decoration-none text-danger stretched-link"
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
            <VerticalTimeline layout="1-column">
                {dataItem.map((event, index) => (
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        date={event.publishedAt}
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

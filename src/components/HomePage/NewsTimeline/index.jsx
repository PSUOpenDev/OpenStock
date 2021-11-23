import React, { useEffect, useState } from "react";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Card } from "react-bootstrap";
import axios from "axios";
import {API_NEWS_KEY, API_NEWS_URL} from "../../common/APIUtils/News/ApiParameter"
import { currentDate } from "../../../utils/getDate"
import { readFromCache, writeToCache } from "../../../utils/cache";
import { getExecutionTimeToNow, SIX_HOURS } from "../../../utils/getTime";

/* Function to render card newspaper item */
const cardRender = (data) => {
    return (
        <Card>
            <Card.Img 
                variant="top" 
                src={data.urlToImage} 
            />
            <Card.Body>
                <Card.Subtitle> 
                    { data.title } 
                </Card.Subtitle>
                <Card.Text className="fw-normal mb-2">
                    {data.content.slice(0, 100) + "..."}
                </Card.Text>
                <a 
                    href={data.url} 
                    class="text-decoration-none text-danger stretched-link"
                >
                    Continue reading
                </a>
            </Card.Body>
        </Card>
    )
}

/* Function to render newspapers */
const NewsTimeline = () => {
    const [data, setData] = useState([]);
    const getCurrentDate = currentDate();

    const URL_NEWS = () => {
        let url = API_NEWS_URL;
        url.concat("qInTitle=Apple +stock");
        url.concat("&language=en");
        url.concat("&from=", `${getCurrentDate}`);
        url.concat("&to=", `${getCurrentDate}`);
        url.concat("&sortBy=relevancy");
        url.concat("&page=1");
        url.concat("&pageSize=20");
        url.concat("&apiKey=", `${API_NEWS_KEY}`);
        return url;
    }

    const fetchNewDataAPI = async (URL, keyStorage) => {
        let items = readFromCache("NewsAPI");

        const { data } = 
            await axios.get(URL)
                    .then((res) => {
                        if (res.data.status === "ok") {
                            console.log(res.data.articles)
                            return res.data.articles
                        }
                    });
        
        const itemToCache = {
            "name" : keyStorage,
            keyStorage : data,
            "fetch_time" : new Date().getTime()
        }
        items.push(itemToCache);
        writeToCache("NewsAPI", items);
        return items;
    }

    const fetchFreshDataAPI = async (URL, keyStorage) => {
        let items = readFromCache("NewsAPI");
        let checkItem = items.filter(item => item["name"] === keyStorage);

        let mem_index = -1;
        let flag_checked = false;

        if (checkItem.length > 0) {
            flag_checked = true;
            for (let i = 0; i < items.length; i++) {
                if (items[i]["name"] === keyStorage) {
                    if (getExecutionTimeToNow(items[i]["fetch_time"]) >= SIX_HOURS) {
                        mem_index = i;
                    }
                    break;
                }
            }
        }

        if (mem_index === -1 && flag_checked === true) {
            // This means item found, but no enough time
            return items;
        }

        const { data } = 
            await axios.get(URL)
                .then((res) => {
                    if (res.data.status === "ok") {
                        console.log(res.data.articles)
                        return res.data.articles
                    }
                });
        
        if (flag_checked === false) {
            // Item not found
            const itemToCache = {
                "name" : keyStorage,
                keyStorage : data,
                "fetch_time" : new Date().getTime()
            }
            items.push(itemToCache);
            writeToCache("NewsAPI", items);
        } else {
            // Item found and enough time
            if (items[mem_index]["name"] === keyStorage) {
                items[mem_index][keyStorage] = data;
                items[mem_index]["fetch_time"] = new Date().getTime();
            }
        }
        return items;
    }

    const getNewsAPIData = async (URL, keyStorage) => {
        let items = [];
        setData([])

        let cachedData = readFromCache("NewsAPI");
        
        if (cachedData.length === 0) {
            writeToCache("NewsAPI", []);
            items = await fetchNewDataAPI(URL, keyStorage);
        } else {
            items = await fetchFreshDataAPI(URL, keyStorage);
        }

        for (let i = 0; i < items.length; i++) {
            if (items[i]["name"] === keyStorage) {
                setData(items[i][keyStorage]);
                break;
            }
        }
    }

    useEffect(() => {
        getNewsAPIData(URL_NEWS, "Apple +stock")
    }, [])

    return (
        <div className="timeline-container">
            <VerticalTimeline>
                {data.length > 0 && data.map((event, index) => (
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        date={event.publishedAt}
                        iconStyle={{
                            background: "rgb(33, 150, 243)",
                            color: "#fff",
                        }}
                        key={ index }
                    >
                        <h3
                            className="vertical-timeline-element-title"
                            dangerouslySetInnerHTML={{ __html: event.event }}
                        />
                        { cardRender(event) }
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </div>
    );
}

export default NewsTimeline;

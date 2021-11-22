import React, { useEffect, useState } from "react";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { Card } from "react-bootstrap";
import axios from "axios";
import {API_NEWS_KEY, API_NEWS_URL} from "../../common/APIUtils/News/ApiParameter"

/* Function to get the current date */
function currentDate() {
    let today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
}

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
    const URL_NEWS = () => {
        let url = API_NEWS_URL;
        url.concat("q=Apple");
        url.concat("&from=", `${currentDate()}`);
        url.concat("&sortBy=popularity");
        url.concat("&apiKey=", `${API_NEWS_KEY}`);
        return url;
    }

    const fetchAPI = (URL) => {
        axios.get(URL)
            .then((res) => {
                setData(res.data.articles)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        fetchAPI(URL_NEWS)
    })

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

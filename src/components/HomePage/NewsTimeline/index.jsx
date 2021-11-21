import React from "react";
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

const events = [
    {
        date: "22/09/2017",
        event: '\'<a href="#">Apple release a new iphone</a>',
    },
    {
        date: "01/12/2017",
        event: '\'<a href="#">Apple release a new iphone</a>',
    },
    {
        date: "01/01/2018",
        event: '\'<a href="#">Apple release a new iphone</a>',
    },
    {
        date: "02/01/2018",
        event: '\'<a href="#">Apple release a new iphone</a>',
    },
    {
        date: "16/01/2018",
        event: '\'<a href="#">Apple release a new iphone</a>',
    },
    {
        date: "18/01/2018",
        event: '\'<a href="#">Apple release a new iphone</a>',
    },

];
function NewsTimeline() {
    return (
        <div className="timeline-container">
            <VerticalTimeline>
                {events.map((event) => (
                    <VerticalTimelineElement
                        className="vertical-timeline-element--work"
                        date={event.date}
                        iconStyle={{
                            background: "rgb(33, 150, 243)",
                            color: "#fff",
                        }}
                    >
                        <h3
                            className="vertical-timeline-element-title"
                            dangerouslySetInnerHTML={{ __html: event.event }}
                        />
                    </VerticalTimelineElement>
                ))}
            </VerticalTimeline>
        </div>
    );
}

export default NewsTimeline;

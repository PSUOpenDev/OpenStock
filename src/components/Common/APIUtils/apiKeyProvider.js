let currentYahooIndex = -1;
const arrayYahoo = JSON.parse(process.env.REACT_APP_YAHOO_API_KEY_ARRAY);
let currentNewsIndex = -1;
const arrayNews = JSON.parse(process.env.REACT_APP_NEWS_API_KEY_ARRAY);


function apiKeyProvider(name) {
    switch (name) {
        case "YahooAPI": {
            currentYahooIndex = currentYahooIndex + 1;
            currentYahooIndex = currentYahooIndex % arrayYahoo.length;
            return arrayYahoo[currentYahooIndex];
        }
        case "NewsAPI": {
            currentNewsIndex = currentNewsIndex + 1;
            currentNewsIndex = currentNewsIndex % arrayNews.length;
            return arrayNews[currentNewsIndex];
        }

        default:
            break;
    }
    return "";
}
export default apiKeyProvider;

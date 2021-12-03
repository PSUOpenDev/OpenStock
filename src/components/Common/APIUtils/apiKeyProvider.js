const arrayYahoo = JSON.parse(process.env.REACT_APP_YAHOO_API_KEY_ARRAY);
const arrayNews = JSON.parse(process.env.REACT_APP_NEWS_API_KEY_ARRAY);
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
let currentYahooIndex = randomNumber(0, arrayYahoo.length - 1);
let currentNewsIndex = randomNumber(0, arrayNews.length - 1);
export function apiKeyProvider(name) {
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

import { durationInMilliseconds } from "./../../../../utils/timeStamp";

export const API_URL_AUTO_COMPLETE =
    "https://yfapi.net/v6/finance/autocomplete?region=US&lang=en&query=";

export const API_URL_STOCK_CHART = "https://yfapi.net/v8/finance/chart/";
export const API_URL_MARKET_SUMMARY =
    "https://yfapi.net/v6/finance/quote/marketSummary?lang=en&region=US";
export const API_URL_STOCK_SUMMARY =
    "https://yfapi.net/v11/finance/quoteSummary/";

export const API_URI_STOCK_QUOTE =
    "https://yfapi.net/v6/finance/quote?region=US&lang=en&symbols=";

export const TIME_TO_REFRESH_STOCK_DETAILS = durationInMilliseconds(1, 0, 0, 0);
export const TIME_TO_REFRESH_INDEXES =  durationInMilliseconds(0,1, 0, 0, 0);
export const TIME_TO_REFRESH_CHART_OVER_DATE =  durationInMilliseconds(1, 0, 0, 0, 0);
export const TIME_TO_REFRESH_CHART_IN_CALL =  durationInMilliseconds(0, 1, 0, 0, 0);




import { 
    useRef, 
    useCallback 
} from "react";

const useInfiniteScroll = (callback, isFetching) => {
    const mutableRefObj = useRef();

    const lastRefObj = useCallback((item) => {
        if (isFetching){
            return;
        }

        if (mutableRefObj.current) {
            mutableRefObj.current.disconnect();
        }

        mutableRefObj.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                callback();
            }
        });

        if (item) {
            mutableRefObj.current.observe(item);
        }
    }, [callback, isFetching]);

    return [lastRefObj];
};

export default useInfiniteScroll;
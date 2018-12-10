export default class UrlUtils {
    static addAppBaseUrl(path) {
        if (typeof process.env.REACT_APP_BASE_URL === "undefined") {
            return path;
        }

        return process.env.REACT_APP_BASE_URL + path;
    }
}

let refreshAccessToken = null;

export const setRefreshAccessToken = (refreshFunction) => {
    refreshAccessToken = refreshFunction;
};

export const apiRequest = async (url, options = {}) => {
    const requestOptions = {
        ...options,
        credentials: "include",
    };

    const response = await fetch(url, requestOptions);

    if (response.status !== 401) {
        return response;
    }

    if (!refreshAccessToken) {
        return response;
    }

    const refreshed = await refreshAccessToken();

    if (!refreshed) {
        return response;
    }

    // Retry the original request once.
    return fetch(url, requestOptions);
};
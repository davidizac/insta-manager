
export const searchUrl = (username) => {
    return `https://www.instagram.com/web/search/topsearch/?query=${username}`;
};

export const getPostUrl = (userId, nextCursor) => {
    // tslint:disable-next-line:max-line-length
    return `https://www.instagram.com/graphql/query/?query_hash=e769aa130647d2354c40ea6a439bfc08&variables={"id":"${userId}","first":50,"after":"${nextCursor}"}`;
};

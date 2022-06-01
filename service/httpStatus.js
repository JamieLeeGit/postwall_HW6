/** HTTP 連線請求結果狀態碼 */
const httpStatus = {
    /** HttpStatusCode 200，請求成功 */
    OK: 200,
    /** HttpStatusCode 201，請求已建立 */
    CREATED: 201,
    /** HttpStatusCode 204，請求成功，但無內容可回傳 */
    NO_CONTENT: 204,
    /** HttpStatusCode 400，請求失敗，無效語法 */
    BAD_REQUEST: 400,
    /** HttpStatusCode 401，請求失敗，登入授權失敗 */
    UNAUTHORIZED: 401, // 
    /** HttpStatusCode 404，請求失敗，拒絕或者沒有其他適合的回應 */
    NOT_FOUND: 404,
};

module.exports = httpStatus;

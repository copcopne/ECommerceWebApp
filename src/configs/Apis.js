import cookie from "react-cookies"
import axios from "axios"

const BASE_URL = 'http://localhost:8080/ECommerceProject/api';
export const endpoints = {
    'register': '/users',
    'sellerRegister' : '/registerSeller',
    'login': '/login',
    'profile': '/secure/profile',

    'categories': '/categories',
    'products': '/products',
    'secureProducts': `/secure/products`,
    'secureProduct': (id) => `/secure/products/${id}`,
    'product': (id) => `/products/${id}`,
    'compare': (id1, id2) => `/products/compare?ids=${id1}&ids=${id2}`,
    'productReviews': (id) => `/products/${id}/reviews`,
    'productReviewReplies': (id) => `/reviews/${id}/replies`,
    'secureReplyReviewProduct': (id) => `/secure/products/${id}/reviews`,
    'reviewProduct': (id) => `/secure/products/${id}/reviews`,

    'store': (id) =>  `/stores/${id}`,
    'storeProducts': (id) =>  `/stores/${id}/products`,
    'secureStore': `/secure/stores`,
    'storeReviews': (id) => `/stores/${id}/reviews`,
    'reviewStore': (id) => `/secure/stores/${id}/reviews`,

    'securePay': `/secure/cart`,


}
export const authApis = () => axios.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Bearer ${cookie.load('token')}`
    }
})

export default axios.create({
    baseURL: BASE_URL,
});

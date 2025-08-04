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
    'productReviews': (id) => `/reviews/products/${id}`,
    'productReviewReplies': (id) => `/reviews/${id}/replies`,
    'reviewProduct': (id) => `/secure/products/${id}/reviews`,

    'store': (id) =>  `/stores/${id}`,
    'createStore': `/secure/stores`,
    'storeReviews': (id) => `/stores/${id}/reviews`,
    'reviewStore': (id) => `/secure/stores/${id}/reviews`,


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

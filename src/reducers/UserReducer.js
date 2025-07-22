import { Cookies } from "react-cookie";

export default (current, action) => {
    switch (action.type) {
        case 'login':
            return action.payload;
        case 'logout':
            Cookies.remove("access-token");
            return null;
    }
    return current;
}
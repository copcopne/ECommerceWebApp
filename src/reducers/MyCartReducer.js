import cookie from "react-cookies";
export default (current, action) => {
    switch (action.type) {
        case "update":
            let total = 0;
            let cart = cookie.load("cart");
            if (cart) {
                for (var x of Object.values(cart))
                    total += +x["quantity"];
            }
            return total;
    }
    return current;
};
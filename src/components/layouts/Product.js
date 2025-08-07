import { memo, useContext } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import cookie from "react-cookies"
import { MyCartContext, MyToastContext } from "../../configs/Contexts";

const Product = ({ p }) => {
    const [, cartDispatch] = useContext(MyCartContext);
    const [, myToastDispatch] = useContext(MyToastContext);
    const handleAddToCart = () => {
        let cart = cookie.load("cart") || null;
        if (!cart) {
            cart = {};
        }
        if (p.productId in cart) {
            cart[p.productId]["quantity"]++;
        } else {
            cart[p.productId] = {
                "productId": p.productId,
                "productName": p.productName,
                "price": p.price,
                "quantity": 1
            }
        };
        cookie.save("cart", cart);
        cartDispatch({
            "type": "update"
        });
        myToastDispatch({
            "type": "set",
            "payload": {
                "variant": "success",
                "message": "Thêm vào giỏ hàng thành công!"
            }
        });
    };
    return <>
        <div style={{ minWidth: "160px", flexShrink: 0 }}>
            <Link to={`/details?id=${p.productId}`} className="text-decoration-none text-dark">
                <Card className="rounded h-100 d-flex flex-column justify-content-between">
                    <Card.Img variant="top" className="rounded" src={p.imageURL} />
                    <Card.Body>
                        <Card.Title>{p.productName}</Card.Title>
                        <Card.Text>{p.price} VNĐ</Card.Text>
                        <Button
                            variant="outline-success"
                            size="sm"
                            className="mt-2 mx-1"
                            onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart();
                            }}
                        >
                            Thêm vào giỏ hàng
                        </Button>
                    </Card.Body>
                </Card>
            </Link>
        </div>
    </>;
};
export default memo(Product);
import { memo, useContext, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import cookie from "react-cookies"
import { MyCartContext, MyToastContext, StoreContext } from "../../configs/Contexts";
import ProductModal from "./ProductModal";

const Product = ({ p, update, setLoading }) => {
    const [, cartDispatch] = useContext(MyCartContext);
    const [, myToastDispatch] = useContext(MyToastContext);
    const [myStore,] = useContext(StoreContext);
    const [show, setShow] = useState(false);
    const handleAddToCart = () => {
        let cart = cookie.load("cart") || null;
        if (!cart) {
            cart = {};
        }
        if (p.productId in cart) {
            cart[p.productId]["quantity"]++;
        } else {
            cart[p.productId] = {
                "id": p.productId,
                "name": p.productName,
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
            <div to={`/details?id=${p.productId}`} className="text-decoration-none text-dark">
                <Card className="rounded h-100 d-flex flex-column justify-content-between">
                    <Card.Img variant="top" className="rounded" src={p.imageURL} />
                    <Card.Body>
                        <Card.Title>{p.productName}</Card.Title>
                        <Card.Text>{p.price.toLocaleString('vi-VN')} VND</Card.Text>
                        <Link
                            className="mb-2 btn btn-sm btn-outline-dark"
                            to={`/details?id=${p.productId}`}
                        >
                            Xem chi tiết
                        </Link>
                        {p?.storeId?.storeId == myStore?.storeId ?
                            <Button variant="success"
                                size="sm"
                                className="mx-1 mb-2 flex-fill"
                                onClick={() => setShow(true)}
                            >
                                Chỉnh sửa
                            </Button> :
                            <Button
                                variant="outline-success"
                                size="sm"
                                className="mx-1 mb-2 flex-fill"
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </Button>}

                    </Card.Body>
                </Card>
            </div>
        </div>
        
        <ProductModal
            currentProduct={p}
            isUpdate={true}
            update={update}
            show={show}
            setShow={setShow}
            setLoading={setLoading}
            myToastDispatch={myToastDispatch}
        />
    </>;
};
export default memo(Product);
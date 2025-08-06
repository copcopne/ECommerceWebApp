import { memo } from "react";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Product = ({ p, myToastDispatch }) => {
    const handleAddToCart = () => {
        
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
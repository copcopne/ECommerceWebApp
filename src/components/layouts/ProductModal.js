import { memo, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Apis, { authApis, endpoints } from "../../configs/Apis";

const ProductModal = ({
    showNewProduct,
    setShowNewProduct,
    setTabData,
    setLoading,
    activeKey,
    tabData,
    myToastDispatch
}) => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState(0);
    const productImg = useRef(null);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const loadCates = async () => {
            if (showNewProduct)
                try {
                    setLoading(true);
                    let res = await Apis.get(endpoints['categories']);
                    setCategories(res.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                };
        };
        loadCates();
    }, [showNewProduct]);

    const validateProduct = () => {
        if (categoryId === "") {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Vui lòng chọn danh mục!"
                }
            });
            return false;
        }
        if (productName.trim() === '' ||
            productDescription.trim() === '' ||
            price <= 0
        ) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Thông tin sản phẩm không hợp lệ!"
                }
            });
            return false;
        }

        if (!productImg.current.files[0]) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Vui lòng chọn ảnh sản phẩm!"
                }
            });
            return false;
        }
        return true;
    };

    const handleUploadProduct = async (event) => {
        event.preventDefault();
        if (!validateProduct())
            return;
        try {
            setLoading(true);
            let form = new FormData();
            form.append("image", productImg.current.files[0]);
            form.append("categoryId", categoryId);
            form.append("productName", productName);
            form.append("price", price);
            form.append("description", productDescription);
            let res = await authApis().post(endpoints['secureProducts'], form);
            if (activeKey === 'products')
                setTabData([res.data, ...tabData]);
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "success",
                    "message": "Tạo sản phẩm thành công!"
                }
            });
            setShowNewProduct(false);
        } catch (error) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "LỖI xảy ra khi tạo sản phẩm!"
                }
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!showNewProduct) {
            setProductName('');
            setProductDescription('');
            setCategoryId('');
            setPrice(0);
        }
    }, [showNewProduct]);
    return <>
        <Modal show={showNewProduct} onHide={() => setShowNewProduct(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Sản phẩm mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">-- Chọn danh mục --</option>
                            {categories.map(c => (
                                <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ảnh sản phẩm</Form.Label>
                        <Form.Control
                            size="sm"
                            type="file"
                            ref={productImg}
                            accept="image/png, image/jpeg"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control
                            type="text"
                            value={productName}
                            onChange={e => setProductName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group
                        className="mb-3"
                    >
                        <Form.Label>Mô tả sản phẩm</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={productDescription}
                            onChange={e => setProductDescription(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá tiền (VNĐ)</Form.Label>
                        <Form.Control
                            type="number"
                            min={0}
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowNewProduct(false)}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleUploadProduct}>
                    Thêm sản phẩm
                </Button>
            </Modal.Footer>
        </Modal>
    </>;
};
export default memo(ProductModal);
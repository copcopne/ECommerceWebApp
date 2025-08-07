import { memo, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";

const ProductModal = ({
    show,
    setShow,
    setTabData,
    setLoading,
    activeKey,
    tabData,
    myToastDispatch,
    isUpdate,
    update,
    currentProduct,
    setCurrentProduct
}) => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [price, setPrice] = useState(0);
    const productImg = useRef(null);
    const [categories, setCategories] = useState([]);
    const nav = useNavigate();
    useEffect(() => {
        if (show) {
            const loadCates = async () => {
                if (show)
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
            if (currentProduct) {
                setProductName(currentProduct.productName);
                setProductDescription(currentProduct.description);
                setCategoryId(currentProduct.categoryId.categoryId);
                setPrice(currentProduct.price);
            }
        }
    }, [show]);

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

        if (!isUpdate && !productImg.current.files[0]) {
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
            if (productImg)
                form.append("image", productImg.current.files[0]);

            form.append("categoryId", categoryId);
            form.append("productName", productName);
            form.append("price", price);
            form.append("description", productDescription);
            let res;
            if (isUpdate) {
                res = await authApis().patch(endpoints['secureProduct'](currentProduct.productId), form);
                if (setCurrentProduct)
                    setCurrentProduct(res.data);
            }
            else
                res = await authApis().post(endpoints['secureProducts'], form);

            update && update();

            if (activeKey && activeKey === 'products')
                setTabData([res.data, ...tabData]);
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "success",
                    "message": `${!isUpdate ? "Tạo" : "Cập nhật"} sản phẩm thành công!`
                }
            });
            setShow(false);
        } catch (error) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": `LỖI xảy ra khi ${!isUpdate ? "tạo" : "cập nhật"} sản phẩm!`
                }
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async () => {
        let result = window.confirm("Bạn có chắc muốn xóa sản phẩm này không?");
        if (result) {
            try {
                await authApis().delete(endpoints['secureProduct'](currentProduct.productId));
                if (setCurrentProduct)
                    nav("/");
                update && update();
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "success",
                        "message": `Xóa sản phẩm thành công!`
                    }
                });
                setShow(false);
            } catch (error) {
                myToastDispatch({
                    "type": "set",
                    "payload": {
                        "variant": "danger",
                        "message": `LỖI xảy ra khi xóa sản phẩm!`
                    }
                });
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };
    useEffect(() => {
        if (!show) {
            setProductName('');
            setProductDescription('');
            setCategoryId('');
            setPrice(0);
        }
    }, [show]);
    return <>
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin sản phẩm</Modal.Title>
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
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Hủy
                </Button>
                {isUpdate &&
                    <Button variant="danger" onClick={handleDeleteProduct}>
                        Xóa sản phẩm
                    </Button>}
                <Button variant="primary" onClick={handleUploadProduct}>
                    {isUpdate ? "Cập nhật" : "Thêm"} sản phẩm
                </Button>
            </Modal.Footer>
        </Modal>
    </>;
};
export default memo(ProductModal);
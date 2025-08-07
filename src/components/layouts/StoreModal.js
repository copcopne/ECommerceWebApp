import { memo, useContext, useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis";
import { StoreContext } from "../../configs/Contexts";

const StoreModal = ({
    show,
    setShow,
    myToastDispatch,
    setStore,
    setLoading,
    isUpdate,
    setIsUpdate,
    currentStoreData,
}) => {
    const [storeName, setStoreName] = useState('');
    const [storeDescription, setStoreDescription] = useState('');
    const [, storeDispatch] = useContext(StoreContext);
    const avatar = useRef(null);

    useEffect(() => {
        if (isUpdate) {
            setStoreName(currentStoreData.storeName);
            setStoreDescription(currentStoreData.description);
        }
    }, [isUpdate]);

    const validateRegister = () => {
        if (storeName.trim() === '' || storeDescription.trim() === '') {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Tên cửa hàng và mô tả là bắt buộc!"
                }
            });
            return false;
        }

        if (!isUpdate && !avatar.current.files[0]) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": "Vui lòng chọn ảnh đại diện cho cửa hàng!"
                }
            });
            return false;
        }
        return true;
    }
    const handleRegister = async (event) => {
        event.preventDefault();
        if (!validateRegister())
            return;
        try {
            setLoading(true);
            let form = new FormData();
            form.append('storeName', storeName);
            form.append('description', storeDescription);
            if (!isUpdate && avatar.current.files.length > 0) {
                form.append("avatar", avatar.current.files[0]);
            }
            let res;
            if (isUpdate)
                res = await authApis().patch(endpoints['secureStore'], form);
            else
                res = await authApis().post(endpoints['secureStore'], form);
            storeDispatch({
                "type": "login",
                "payload": res.data
            })
            setStore(res.data);
            setShow(false);
            setStoreName('');
            setStoreDescription('');
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "success",
                    "message": `${!isUpdate ? "Tạo" : "Cập nhật"} cửa hàng thành công!`
                }
            });
            if (isUpdate)
                setIsUpdate(false);
        } catch (error) {
            myToastDispatch({
                "type": "set",
                "payload": {
                    "variant": "danger",
                    "message": `LỖI xảy ra khi ${!isUpdate ? "tạo" : "cập nhật"} cửa hàng!`
                }
            });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    return <>
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Thông tin cửa hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {!isUpdate && <Form.Group className="mb-3">
                        <Form.Label>Ảnh đại diện</Form.Label>
                        <Form.Control
                            size="sm"
                            type="file"
                            ref={avatar}
                            accept="image/png, image/jpeg"
                        />
                    </Form.Group>}
                    <Form.Group className="mb-3">
                        <Form.Label>Tên cửa hàng</Form.Label>
                        <Form.Control
                            type="text"
                            value={storeName}
                            onChange={e => setStoreName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group
                        className="mb-3"
                    >
                        <Form.Label>Mô tả cửa hàng</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={storeDescription}
                            onChange={e => setStoreDescription(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleRegister}>
                    {isUpdate ? "Cập nhật" : "Đăng ký"} cửa hàng
                </Button>
            </Modal.Footer>
        </Modal>
    </>;
};
export default memo(StoreModal);
import { useContext, useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import { MyToastContext } from "../../configs/Contexts";

const MyToast = () => {
    const [myToast, myToastDispatch] = useContext(MyToastContext);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (myToast?.message) {
            setShow(true);

            const timeout = setTimeout(() => {
                setShow(false);
                myToastDispatch({ type: "clear" });
            }, 3500);

            return () => clearTimeout(timeout);
        }
    }, [myToast]);

    return (
        <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={3000}
            animation={true}
            autohide
            bg={myToast?.variant?.toLowerCase() || "info"}
            style={{
                position: "fixed",
                top: 20,
                right: 20,
                zIndex: 9999,
                minWidth: "250px",
                fontSize: "1rem",
            }}
        >
            <Toast.Header closeButton>
                <strong className="me-auto">{myToast?.title || "Thông báo"}</strong>
            </Toast.Header>
            <Toast.Body className={myToast?.variant?.toLowerCase() === 'dark' ? 'text-white' : ''}>
                {myToast?.message}
            </Toast.Body>
        </Toast>
    );
};

export default MyToast;

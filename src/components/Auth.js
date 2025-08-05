import { useContext, useEffect, useState } from "react";
import MySpinner from "./layouts/MySpinner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../configs/Contexts";

const Auth = () => {
    const user = useContext(UserContext);
    const [q,] = useSearchParams();
    const nav = useNavigate();

    useEffect(() => {
        let next = user ? q.get("next") : `/login?next=${q.get("next")}`;
        let timer = setTimeout(() => {
            nav(next);
        }, 1000);
        return () => clearTimeout(timer);
    }, [user]);
    return <>
        <div style={{ height: "80vh" }}>
            <MySpinner />
        </div>
    </>;
};
export default Auth;
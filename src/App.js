import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container } from "react-bootstrap";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { useEffect, useReducer, useState } from "react";
import UserReducer from "./reducers/UserReducer";
import { DispatchContext, MyToastContext, StoreContext, UserContext } from "./configs/Contexts";
import Profile from "./components/profile/Profile";
import EditStore from "./components/store/EditStore";
import Stats from "./components/store/Stats";
import AddProduct from "./components/store/AddProduct";
import Search from "./components/Search";
import ProductDetail from "./components/productDetail";
import Cart from "./components/Cart";
import MyToast from "./components/layouts/MyToast";
import MyToastReducer from "./reducers/MyToastReducer";
import MySpinner from "./components/layouts/MySpinner";
import cookie from "react-cookies";
import { authApis, endpoints } from "./configs/Apis";
import Store from "./components/store/Store";
import EditPassword from "./components/profile/EditPassword";
import Empty from "./components/Emtpy";
import Auth from "./components/Auth";
import StoreReducer from "./reducers/StoreReducer";

function App() {
  const [loading, setLoading] = useState(false);
  const [user, dispatch] = useReducer(UserReducer, null);
  const [myToast, myToastDispatch] = useReducer(MyToastReducer, null);
  const [store, storeDispatch] = useReducer(StoreReducer, null);

  const loadDatas = async () => {
    try {
      setLoading(true);
      let token = cookie.load("token") || null;
      if (token) {
        let u = await authApis().get(endpoints['profile']);
        dispatch({
          "type": "login",
          "payload": u.data
        });
        if (u.data.role === "ROLE_SELLER") {
          let store = await authApis().get(endpoints['secureStore']);
          console.info(store.data);
          storeDispatch({
            "type": "login",
            "payload": store.data
          })
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    };
  };
  useEffect(() => {
    loadDatas();
  }, []);

  if (loading)
    return <MySpinner />

  return (
    <UserContext.Provider value={user}>
      <DispatchContext.Provider value={dispatch}>
        <StoreContext.Provider value={[store, storeDispatch]}>
          <MyToastContext.Provider value={[myToast, myToastDispatch]}>

            <BrowserRouter>
              <Header />
              <MyToast />

              <Container>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/details" element={<ProductDetail />} />
                  <Route path="/my-cart" element={<Cart />} />

                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/edit-password" element={<EditPassword />} />

                  <Route path="/stores" element={<Store />} />
                  <Route path="/stores/edit" element={<EditStore />} />
                  <Route path="/stores/add-product" element={<AddProduct />} />
                  <Route path="/stores/stats" element={<Stats />} />

                  <Route path="*" element={<Empty />} />
                </Routes>
              </Container>

              <Footer />

            </BrowserRouter>

          </MyToastContext.Provider>
        </StoreContext.Provider>
      </DispatchContext.Provider>
    </UserContext.Provider>
  );
}

export default App;

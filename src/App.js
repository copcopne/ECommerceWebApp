import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { useReducer } from "react";
import UserReducer from "./reducers/UserReducer";
import { DispatchContext, UserContext } from "./configs/Contexts";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/profile/EditProfile";
import EditStore from "./components/store/EditStore";
import Stats from "./components/store/Stats";
import AddProduct from "./components/store/AddProduct";
import Search from "./components/Search";
import ProductDetail from "./components/productDetail";

function App() {
  const [user, dispatch] = useReducer(UserReducer, null);
  
  return (
    <UserContext.Provider value={user}>
      <DispatchContext.Provider value={dispatch}>

        <BrowserRouter>
          <Header />

          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/details" element={<ProductDetail />} />

              <Route path="/profile" element={<Profile />}>
                <Route path="edit" element={<EditProfile />} />
              </Route>

              <Route path="/my-store" element={<Profile />}>
                <Route path="edit" element={<EditStore />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="stats" element={<Stats />} />
              </Route>
            </Routes>
          </Container>

          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </UserContext.Provider>
  );
}

export default App;

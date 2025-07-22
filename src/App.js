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
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Container>

          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </UserContext.Provider>
  );
}

export default App;

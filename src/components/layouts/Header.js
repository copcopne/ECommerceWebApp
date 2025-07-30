import { useContext, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';
import { DispatchContext, UserContext } from '../../configs/Contexts';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Header = () => {
  const user = useContext(UserContext);
  const dispatch = useContext(DispatchContext);
  const nav = useNavigate();
  const [keyword, setKeyword] = useState();
  const logout = () => {
    let result = window.confirm("Bạn có chắc muốn đăng xuất không?");
    if (result) {
      dispatch({
        "type": "logout"
      });
      nav("/");
    }
  }
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary mb-3">
        <Container>
          <Link to="/" className='navbar-brand'>eCommerce Website</Link>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll" className="justify-content-begin">
            <Nav className="my-2 my-lg-0" navbarScroll>
            </Nav>
            <Navbar.Collapse className='justify-content-end'>
              <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="me-2"
                  aria-label="Search"
                  value={keyword}
                  onChange={event => setKeyword(event.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      nav(`/search?keyword=${keyword}`);
                    }
                  }}
                />
                <Button onClick={() => nav(`/search?keyword=${keyword}`)} variant="outline-dark">Tìm</Button>
              </Form>
              <Link to="/my-cart" className='nav-link mx-3'>
                <i className="bi bi-cart3 fs-5"></i>
              </Link>

              {!user ? <>
                <Link to="/login" className='nav-link mx-1'>Đăng nhập</Link>
                <Link to="/register" className='nav-link mx-1'>Đăng ký</Link></> : <>
                <NavDropdown
                  title={user.name}
                  id="navbarScrollingDropdown"
                  className='m-2'
                >
                  <Link to="/profile" className='dropdown-item'>Hồ sơ</Link>
                  <Link to="/my-store" className='dropdown-item'>Cửa hàng của tôi</Link>
                  <NavDropdown.Divider />
                  <Button onClick={logout} className='dropdown-item text-danger'>Đăng xuất</Button>
                </NavDropdown>
              </>}

            </Navbar.Collapse>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;

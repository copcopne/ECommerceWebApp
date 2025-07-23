import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const nav = useNavigate();
  const [keyword, setKeyword] = useState();
  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-3">
      <Container>
        <Link to="/" className='navbar-brand'>eCommerce Website</Link>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll" className="justify-content-begin">
          <Nav className="my-2 my-lg-0" navbarScroll>
            {/* <Nav.Link href="#link">Link</Nav.Link> */}
            {/* <NavDropdown title="Dropdown" id="navbarScrollingDropdown">
              <NavDropdown.Item href="#action1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action2">Another action</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action3">Something else here</NavDropdown.Item>
            </NavDropdown> */}
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
              <Button onClick={() => nav(`/search?keyword=${keyword}`)} variant="outline-success">Tìm</Button>
            </Form>
            {/* <Link to="/login" className='nav-link'>Đăng nhập</Link>
            <Link to="/register" className='nav-link'>Đăng ký</Link> */}
            <NavDropdown
              title="username"
              id="navbarScrollingDropdown"
            >
              <Link to="/profile" className='dropdown-item'>Hồ sơ của bạn</Link>
              <Link to="/my-store" className='dropdown-item'>Cửa hàng của bạn</Link>
              <NavDropdown.Divider />
              <Button className='dropdown-item text-danger'>Đăng xuất</Button>
            </NavDropdown>
          </Navbar.Collapse>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;

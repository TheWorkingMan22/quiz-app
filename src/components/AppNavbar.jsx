import { Navbar, Nav, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { FaQuestionCircle, FaChartBar, FaPlay } from 'react-icons/fa'

export default function AppNavbar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="sm">
      <Container>
        <Navbar.Brand>
          <FaQuestionCircle className="me-2" />
          Quiz Master
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              <FaPlay className="me-1" /> Setup
            </Nav.Link>
            <Nav.Link as={NavLink} to="/stats">
              <FaChartBar className="me-1" /> Stats
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

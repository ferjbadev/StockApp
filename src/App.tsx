import "./App.css";
// import Show from './components/Show'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary text-center">
        <div className="container-fluid px-5">
          <a className="navbar-brand fs-1 fw-bold" href="#">
            Digital Zone
          </a>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active fw-bold" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-bold" href="#">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link fw-bold" href="#">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <footer className="footer mt-auto py-3 bg-light">
        <div className="container text-center h-100">
          2024 Digital Zone. All Rights Reserved
        </div>
      </footer>
    </div>
  );
}

export default App;

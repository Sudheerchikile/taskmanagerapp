import React from 'react';
import { Link } from 'react-router-dom'; 
import { FaHome } from "react-icons/fa";
import "./index.css"

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-nav">
      <li className="nav-item">
          <Link to="/" className="nav-link">
            <FaHome className='home'/>
          </Link>
        </li>




        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/metrics" className="nav-link">
            Metrics
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

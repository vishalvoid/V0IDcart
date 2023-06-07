import React, { useState } from "react";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { faX, faBars, faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavBar = () => {
  const [menu, setMenu] = useState(false);

  return (
    <div className="navigation">
      <header>
        <a href="#" className="logo">
          <div className="logo__name">
            <h1 className="logo__name-primary">
              V <span className="dot">&#11044; </span> ID
              <span className="logo__name-secondary"> CART</span>
            </h1>
          </div>
        </a>

        <ul className={menu ? "navbar open" : "navbar"}>
          <li>
            <a href="#home" className="active">
              Home.
            </a>
          </li>
          <li>
            <a href="#about"> Product</a>
          </li>
          <li>
            <a href="#projects">Contact</a>
          </li>
          <li>
            <a href="#blog">About</a>
          </li>
          <li>
            <a href="#contact">Cart</a>
          </li>
        </ul>

        <div className="main">
          <Link to="/cart" className="main__cart">
            <FontAwesomeIcon
              className="main__cart-icon"
              icon={faCartShopping}
            ></FontAwesomeIcon>
          </Link>
          <div className="menu__icon-div">
            <FontAwesomeIcon
              icon={!menu ? faBars : faX}
              id="menu-icon"
              onClick={() => {
                setMenu(!menu);
              }}
            ></FontAwesomeIcon>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavBar;

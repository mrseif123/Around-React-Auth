import React from "react";
import logo from '../images/header-vector.svg';

function Header() {
  return (
    <header className="header">
        <img className="header__vector" src={logo} alt="around the US icon"/>
    </header>
 )
}

export default Header;
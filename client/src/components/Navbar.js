import './Navbar.css';
import {Link} from 'react-router-dom';
import { navItems } from '../data/navItems';
import Dropdown from './Dropdown';
import {useState} from 'react'


const Navbar = ({onLogOut, history} ) => {
    const [dropdown, setDropdown] = useState(false)

   

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="navbarLogo">
                    {/* <p className="home">Home</p> */}
                  {/* <i className="fas fa-golf-ball golf"></i> */}
                  <i className="fas fa-home homeFa"></i>
                </Link>  
                <ul className="navbarItems">
          {navItems.map((item) => {
            if (item.title === "Settings & Privacy") {
              return (
                <li
                  key={item.id}
                  className={item.navClass}
                  onMouseEnter={() => setDropdown(true)}
                  onMouseLeave={() => setDropdown(false)}
                >
                  <Link className="navHover" to={item.path}>{item.title}</Link>
                  {dropdown && <Dropdown onLogOut={onLogOut} />}
                </li>
              );
            }
            return (
              <li key={item.id} className={item.navClass}>
                <Link className="navHover" to={item.path}>{item.title}</Link>
              </li>
            );
          })}
        </ul>  
                     
        </nav >
        </>
    )
}

export default Navbar

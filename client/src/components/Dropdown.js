import {useState} from 'react'
import './Dropdown.css'
import { serviceDropdown } from '../data/navItems'
import { Link } from 'react-router-dom'
const Dropdown = ({history,onLogOut }) => {
    const [dropdown, setDropdown] = useState(false)

    // const logOut = () =>{
    //     localStorage.removeItem("authToken")
    //     history.push("/login")
    // }
    return (
        <ul className={dropdown ? "clicked" : "service-submenu"} onClick={() => setDropdown(!dropdown)}>
            {serviceDropdown.map(item =>(
                <li key={item.id}>
                    <Link to={item.path} className={item.cName}
                        onClick={() => setDropdown(!dropdown)}
                        > 
                        {item.title}
                    </Link>
                </li>
                
            ))}
            <li className="submenu-item" onClick={onLogOut}>SignOut</li>
        </ul>
    )
}

export default Dropdown

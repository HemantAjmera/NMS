import links from "../utils/links";
import { NavLink } from 'react-router-dom'

const NavLinks = ({ toggleSideBar }) => {
    return (
        <div>
            {links.map((link) => {
                const { text, path, id, icon } = link;
                return (
                    <div key={id} className="flex justify-content-center">

                        <NavLink replace={true} style={{textDecoration: "none", color:"blue"}}  to={path} key={id} onClick={toggleSideBar}>
                            <h2 className="p-0 my-3 " style={{ color: "var(--bluegray-500)", fontFamily:"Hindi-Regular"  }}><span className="pr-2 " style={{ color: "var(--bluegray-900)" }}>{icon}</span>
                            {text}</h2>
                        </NavLink>
                    </div>
                )
            })}
        </div>
    );
}
export default NavLinks;
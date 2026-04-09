import { useState } from "react";

const navItems = [
  {
    id: 1,
    name: "Home",
    path: "/"
  },
  {
    id: 2,
    name: "About",
    path: "/about"
  },
  {
    id: 3,
    name: "Portfolio",
    path: "/portfolio"
  },
  {
    id: 4,
    name: "Services",
    path: "/services"
  },
  {
    id: 5,
    name: "Contact",
    path: "/contact"
  }
];
const Navbar = () =>  
{
    const[open,setOpen] = useState(false);
    return (
        <nav className="flex justify-between items-center mx-10">
        <span onClick={()=>setOpen(!open)}>
            {open? 'close' : 'open'}
            {/* <Menu /> */}
            <h1>Menu</h1>

        </span>
        
        <ul className="flex justify-between items-center">
           {
            navItems.map(route => <li className="m-10"><a href={route.path}>{route.name}</a></li>)
           }

         </ul>
         <button>Sign in</button>

        </nav>
        
    )

}
export default Navbar;
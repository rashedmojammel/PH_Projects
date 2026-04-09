import { Menu, X } from 'lucide-react';
import React, { useState } from 'react';

const NavBar = () => {
    const[open,setOpen] = useState (false);
    return (

        

        <div className='flex justify-between mx-10'>
            <span className='flex gap-5 ' onClick={()=>setOpen(!open)}>
                {open ?
                 <X></X> : 
                 <Menu></Menu> }
            <ul className = {`flex flex-col gap-4 absolute duration-200 md:hidden
                ${open ? 'top-5': '-top-40'}
                bg-amber-500`}>
               <li><a href="#">Home</a></li>
  <li><a href="#">About</a></li>
  <li><a href="#">Service</a></li>
  <li><a href="#">Contact</a></li>
  <li><a href="#">Blog</a></li>
</ul>
            
           
            <h1>My Navbar</h1>
            </span>
             
            <div className='md:flex gap-5 hidden'>
                <a>Home</a>                
                <a>about</a>                
                <a>Service</a>                
                <a>Contact</a>                
                <a>BLog</a>                
             </div>
             <button>Sign in</button>
            
        </div>
    );
};

export default NavBar;
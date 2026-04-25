import Navbar from '@/components/shared/Navbar';
import Header from '@/components/shared/Header'
import React from 'react';

const LoginLayout = ({children}) => {
    return (
        
            <div>
                <Navbar></Navbar>
            
                  {children}
            </div>
    );
};

export default LoginLayout;
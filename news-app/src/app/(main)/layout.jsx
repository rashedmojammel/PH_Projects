import Navbar from '@/components/shared/Navbar';
import Header from '@/components/shared/Header'
import React from 'react';

const MainLayout = ({children}) => {
    return (
        
            <div>
                <Header></Header>
                <Navbar></Navbar>
                {children}
            </div>
    );
};

export default MainLayout;
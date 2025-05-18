import React, { useState } from 'react'
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import CustomSidebar from './Sidebar';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './Header';
import AppRoutes from '../../routes/AppRoutes';
import MobileSidebar from './MobileSidebar';

export default function DemoSidebar() {
    const { collapseSidebar } = useProSidebar();

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    const [selectedOption,setSelectedOption] = useState("Dashboard")


    const handleMenuSelect = (event) => {
        
      setSelectedOption(event);
    };

    return (
        <Router>
        <div style={{ display: 'flex', height: '100%' }}>
            {window.innerWidth <= 768 ? (
              <MobileSidebar
            open={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            handleMenuSelect={handleMenuSelect}
          />
            ) : (
                <CustomSidebar handleMenuSelect={handleMenuSelect} />
            )}

            <main style={{ 
                flex: 1, 
                background: '#f5f5f5', 
                paddingTop: window.innerWidth <= 768 ? '60px' : '0px'
            }}>
            <Header isMobileSidebarOpen={isMobileSidebarOpen} setIsMobileSidebarOpen={setIsMobileSidebarOpen} selectedOption={selectedOption} collapseSidebar={collapseSidebar}   />
               <AppRoutes />
            </main>
        </div>
        </Router>
    )
}


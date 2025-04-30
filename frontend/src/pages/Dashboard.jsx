import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashProfile';
import DashUsers from '../components/DashUsers';
import DashboardComp from '../components/DashboardComp';
import ProductPage from '../pages/Product';
import SupplyPage from '../pages/Supply';

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('dash');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      <div className="flex-grow p-4">
        {/* Profile */}
        {tab === 'profile' && <DashProfile />}
        {/* Users */}
        {tab === 'users' && <DashUsers />}
        {/* Dashboard */}
        {tab === 'dash' && <DashboardComp />}
        {/* Products */}
        {tab === 'products' && <ProductPage />} 
        {/* Supplys */}
        {tab === 'supplys' && <SupplyPage />}
      </div>
    </div>
  )
}

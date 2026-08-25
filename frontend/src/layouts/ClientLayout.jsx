import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import LoginModal from '../components/common/LoginModal';

const ClientLayout = () => {
  return (
    <div className="bg-background font-body-md text-on-background min-h-screen flex flex-col">
      <Header />
      <main className="w-full pt-20 flex-1">
        <div className="flex flex-col w-full relative overflow-x-hidden bg-background min-h-screen pt-0 mt-[-80px]">
          <Outlet />
        </div>
      </main>
      <Footer />
      <LoginModal />
    </div>
  );
};

export default ClientLayout;

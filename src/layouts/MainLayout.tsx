import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const Footer: React.FC = () => (
    <footer className="border-t border-white/10 py-10 mt-20">
        <div className="container mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} OPhim17. All rights reserved.
                <span className="block mt-2">Sử dụng API từ ophim17.cc</span>
            </p>
        </div>
    </footer>
);

const MainLayout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;

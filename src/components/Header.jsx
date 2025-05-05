// Import React Hook
import React, {useEffect, useState} from "react";
// Import các icon từ thư viện vào reactjs
import {FaUser, FaTasks, FaCog, FaArrowAltCircleLeft, FaArrowAltCircleRight} from "react-icons/fa";
// Sử dụng các router để diều hướng tới từng pages
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
// Các component trang
import PageUser from "../pages/pageUser";
import PageProject from "../pages/pageProject";

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // Hàm chuyển trạng thái ẩn/hiện sidebar
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    // Nhận thông tin người dùng từ state
    const { state } = useLocation();
    const [account, setAccount] = useState(null);
    useEffect(() => {
        if (state && state.user) {
            setAccount(state.user);  // Lưu thông tin người dùng vào state local
        } else {
            // Lấy token từ localStorage
            const token = localStorage.getItem("authToken");

            if (token) {
                // Gọi API để lấy thông tin người dùng
                fetchUserData(token);
            }
        }
    }, [state]);
    const fetchUserData = async (token) => {
        try {
            // Gửi yêu cầu API để lấy thông tin người dùng
            const response = await axios.get('https://api.qlcv.uonghoailuong.vn/api/user', {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Sử dụng Bearer token trong header
                },
            });
            // Cập nhật thông tin người dùng vào state
            // setAccount(response.data);
            const { user, employee } = response.data;
            setAccount({
            ...user,
            employeeID: employee?.EmployeeID || null
            });
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu người dùng:", error);
        }
    };

    
    return(
        <>
            {account ? (
            <header className="flex">
                <div className={`bg-gradient-to-b from-blue-100 to-white text-slate-800 h-screen p-4 transition-all relative shadow-md ${isSidebarOpen ? "w-64" : "w-20"}`}>
                    <div className="flex items-center space-x-4 p-1 gray-100 shadow-md transition-all hover:scale-105 duration-300 ease-in-out">
                        <img className="w-12 h-12 rounded-full object-cover border-2 border-gray-300" 
                            src={account.avatar} 
                            alt="Avatar" 
                        />
                        {isSidebarOpen && 
                            <span className="font-bold text-gray-800 px-4 text-xl">{account.fullname}</span>
                        }
                    </div>
                    <div className="space-y-4 font-bold py-10">
                        <NavLink to="/pageuser" className="flex items-center space-x-4 shadow-md hover:scale-105 duration-300 ease-in-out p-4">
                            <FaUser size={24}/>
                            <span className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "block" : "hidden"}`}>
                                Thành viên
                            </span>
                        </NavLink>
                        <NavLink to="/pageprojects" className="flex items-center space-x-4 shadow-md hover:scale-105 duration-300 ease-in-out p-4">
                            <FaTasks size={24} />
                            <span className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "block" : "hidden"}`}>
                                Dự án
                            </span>
                        </NavLink>
                        <div className="flex items-center space-x-4 shadow-md hover:scale-105 duration-300 ease-in-out p-4">
                            <FaCog size={24} />
                            <span className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? "block" : "hidden"}`}>
                                Cài đặt
                            </span>
                        </div>
                    </div>
                    <button onClick={toggleSidebar} className="absolute -right-3 text-3xl py-10 hover:scale-105 duration-300 ease-in-out z-30">
                        {isSidebarOpen ? <FaArrowAltCircleLeft /> : <FaArrowAltCircleRight />}
                    </button>
                </div>
            </header>
            ) : (
                <h1></h1>
            )}
        </>
    )
}
export default Header;
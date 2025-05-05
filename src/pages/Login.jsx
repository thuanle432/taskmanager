import React, { useEffect } from 'react';
import { FaGoogle, FaProjectDiagram } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
const Login = () =>  {
    const navigate = useNavigate();
    const handleClick = () => {
        // Chuyển hướng người dùng tới API để thực hiện đăng nhập
        window.location.href = "https://api.qlcv.uonghoailuong.vn/redirect";
    }
     // Theo dõi thay đổi URL và kiểm tra nếu có token trong query string
     useEffect(() => {
        const checkLogin = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("token");
    
            if (token) {
                localStorage.setItem("authToken", token);
                window.history.replaceState({}, document.title, window.location.pathname);
            }
    
            const storedToken = token || localStorage.getItem("authToken");
    
            if (storedToken) {
                try {
                    // Gọi API xác thực token
                    const res = await fetch("https://api.qlcv.uonghoailuong.vn/api/user", {
                        headers: {
                            Authorization: `Bearer ${storedToken}`
                        }
                    });
    
                    if (!res.ok) throw new Error("Token không hợp lệ");
    
                    navigate("/pageHome");
                } catch (err) {
                    console.error("Token không hợp lệ:", err);
                    localStorage.removeItem("authToken");
                }
            }
        };
    
        checkLogin();
    }, [navigate]);
    
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden flex w-3/4 max-w-4xl">
                {/* Cột trái */}
                <div className="w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center text-white p-10">
                <FaProjectDiagram className="text-6xl mb-4" />
                <h2 className="text-3xl font-bold">Quản lý dự án</h2>
                <p className="mt-2 text-center">
                    Nền tảng tối ưu để quản lý và theo dõi dự án
                </p>
                </div>
                {/* Cột phải */}
                <div className="w-1/2 p-10 flex flex-col justify-center">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        Đăng nhập
                    </h1>
                    <p className="text-gray-600 text-center mb-6 font-bold">
                        Sử dụng tài khoản Google của bạn để tiếp tục
                    </p>
                    <button
                        onClick={handleClick}
                        className="flex items-center justify-center w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition duration-300 ease-in-out"
                    >
                        <FaGoogle className="w-6 h-6 mr-3 text-red-500" />
                        Đăng nhập bằng google
                    </button>
                    <p className="mt-6 text-sm text-center text-gray-400">
                        Bằng cách đăng nhập bạn đồng ý với{" "}
                        <a
                        href="/#"
                        className="text-sm font-bold text-center text-gray-400 mt-6 hover:underline"
                        >
                        Điều khoản dịch vụ
                        </a>{" "}
                        và{" "}
                        <a href="/#" className="text-blue-500 hover:underline">
                        Chính sách bảo mật
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;

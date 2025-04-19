import React, {useState, useEffect} from "react";
import axios from "axios";
import Header from "../components/Header";



const PageUser = () => {
    
    const [users, setUsers] = useState([]);

    const [isLoading, setIsLoading] = useState(true); 

    const [token, setToken] = useState(localStorage.getItem("authToken") || "");

    const fetchUser = async () => {
        try{
            if(!token){
                console.error("token không tồn tại");
                return;
            }

            const response = await axios.get("https://api.qlcv.uonghoailuong.vn/api/user",{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin dự án", error);
        } finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [token]);
    return(
        <>
            <div className="flex">
                <Header />
                <h1>Đây là trang User</h1>
            </div>
        </>
    )
}
export default PageUser;
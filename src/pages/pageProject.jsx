import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {FaUser, FaSearch, FaTimes, FaTrash, FaEdit, FaPlus} from "react-icons/fa";
import axios from "axios";
import bgproject from "../assets/images/truc.jpg";
import Header from "../components/Header.jsx";
import Toast from "../components/Toast.jsx"
const PageProject = () => {
    // State để lưu danh sách các dự án và trạng thái tải
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 

    // Lưu token và trạng thái hiển thị form
    const [token, setToken] = useState(localStorage.getItem("authToken") || "");
    const [isFormVisible, setFormVisible] = useState(false);

    //State cho form tạo dự án
    const [projectName, setProjectName] = useState("");
    const [projectImage, setProjectImage] = useState("");
    
    // Ẩn và hiển thị form tạo dự án
    const handleButtonClick = () => {
        setFormVisible(!isFormVisible);
    }
    const handleCloseClick = () => {
        setFormVisible(false);
    };
    
    // Hiện thị thông báo
    const [toast, setToast] = useState(null);

    // Hiển thị xác nhận khi muốn xóa dự án
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Khai báo hook useNavigate
    const navigate = useNavigate();

    // Gọi API để lấy danh sách các dự án
    const fetchProjects = useCallback(async () => {
        try {
          if (!token) {
            console.error("Token không tồn tại!");
            return;
          }
      
          const employeeId = await getEmployeeId(); // ✅ lấy EmployeeID hiện tại
      
          const response = await axios.get("https://api.qlcv.uonghoailuong.vn/api/project/index", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          });
      
          const allProjects = response.data?.data || [];
          const filteredProjects = allProjects.filter(
            (project) => project.EmployeeID === employeeId
          );
      
          setProjects({ data: filteredProjects });
        } catch (error) {
          console.error("Lỗi khi lấy danh sách dự án:", error);
        } finally {
          setIsLoading(false);
        }
    }, [token, setProjects, setIsLoading]);

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        if (storedToken && storedToken !== token) {
            setToken(storedToken);
        }
    }, [token]);

    // Gọi API khi component mount hoặc khi token thay đổi
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]); // Chạy lại nếu token thay đổi

    //Hàm tạo dự án
    const getEmployeeId = async () => {
        try {
          if (!token) {
            console.error("Token không tồn tại!");
            return null;
          }
      
          const response = await axios.get("https://api.qlcv.uonghoailuong.vn/api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          });
      
          return response.data?.employee?.EmployeeID || null;
        } catch (error) {
          console.error("Lỗi khi lấy EmployeeID:", error);
          return null;
        }
    };
    
    const createProject = async () => {
        try {
            const userId = await getEmployeeId(); // Lấy ID người dùng

            const projectData = { 
                ProjectName: projectName,
                Background: projectImage,
                Status: 0,
                Role: "manager",
                EmployeeID: userId
            };
            await axios.post("https://api.qlcv.uonghoailuong.vn/api/project/create",
                projectData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );
            setToast({message:"Tạo dự án thành công!", type: "success"});
            setFormVisible(false);
            fetchProjects(); 
        } catch (error) {
            console.error("Lỗi khi tạo dự án:", error);
            setToast({ message: 'Tạo dự án thất bại! Vui lòng thử lại.', type: 'error' });
        }
    };
    
    // Xử lý submit form
    const handleSubmit = (event) => {
        event.preventDefault();
        createProject();
    };

    // Xử lý xóa dự án
    const deleteProject = async (ProjectID) => {
        try{
            await axios.delete(
                `https://api.qlcv.uonghoailuong.vn/api/project/delete/${ProjectID}`,
                {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                    }
                }
            );
            setToast({ message: "Xóa dự án thành công!", type: "success" });
            fetchProjects(); // Làm mới lại danh sách dự án sau khi xóa thành công
        } catch (error) {
            console.error("Lỗi khi xóa dự án:", error);
            setToast({ message: 'Xóa dự án thất bại! Vui lòng thử lại.', type: 'error' });
        }
    }
    
    // Hàm xử lý hiển thị box xác nhận
    const handleDeleteClick = (projectId) => {
        setSelectedProject(projectId);
        setShowConfirm(true);
    };
      
    const handleConfirmDelete = () => {
        deleteProject(selectedProject);
        setShowConfirm(false);
        setSelectedProject(null);
    };
    
    const handleCancelDelete = () => {
        setShowConfirm(false);
        setSelectedProject(null);
    };

    // Hàm sửa dự án
    const updateProject = async (ProjectID, updatedData) => {
        try {
            await axios.patch(
                `https://api.qlcv.uonghoailuong.vn/api/project/edit/${ProjectID}`,
                updatedData,
                {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
                }
            );
            setToast({ message: "Cập nhật dự án thành công!", type: "success" });
            fetchProjects(); // cập nhật lại danh sách sau khi sửa
        } catch (error) {
            console.error("Lỗi khi cập nhật dự án:", error);
            setToast({ message: 'Cập nhật dự án thất bại! Vui lòng thử lại.', type: 'error' });
        }
    };

    const [isEditFormVisible, setEditFormVisible] = useState(false);
        const [editProjectData, setEditProjectData] = useState({
        ProjectID: null,
        ProjectName: "",
        Background: "",
        EmployeeID: "",
        Status: "",
        Role: ""
    });

    const openEditForm = (project) => {
        setEditProjectData({
            ProjectID: project.ProjectID,
            ProjectName: project.ProjectName,
            Background: project.Background ?? "",
            EmployeeID: project.EmployeeID,
            Status: project.Status,
            Role: project.Role
        });
        setEditFormVisible(true);
    };
      
    const closeEditForm = () => {
        setEditFormVisible(false);
        setEditProjectData({ ProjectID: null, ProjectName: "", Background: "", EmployeeID: "", Status: "", Role: "" });
    };

    // Hàm xử lý khi click vào dự án
    const handleProjectClick = (ProjectID) => {
        navigate(`/project/${ProjectID}`);
    }

    return(
        <>
            <div className="flex">
                <Header />
                <section className="container mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Danh sách dự án</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex space-x-2">
                                <select className="border rounded-md p-2">
                                    <option >Hoạt động gần nhất</option>
                                    <option >Theo bảng chữ cái A-Z</option>
                                    <option >Theo bảng chữ cái Z-A</option>
                                </select>
                                <select className="border rounded-md p-2">
                                    <option >Hoạt động gần nhất</option>
                                    <option >Theo bảng chữ cái A-Z</option>
                                    <option >Theo bảng chữ cái Z-A</option>
                                </select>
                            </div>
                            {/*----Tìm kiếm dự án */}
                            <div className="flex items-center border rounded-md px-4">
                                <FaSearch className="text-gray-500 mr-2" />
                                <input type="text" className="w-full p-2 border-none focus:outline-none" placeholder="Tìm kiếm dự án"/>
                            </div>
                        </div>
                    </div>
                    {/*----Danh sách các dự án */}
                    <div className="grid grid-cols-4 gap-4 py-6">
                        <div className="p-6 bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition-all flex items-center justify-center">
                            <button className="w-full p-4 rounded-md font-bold text-xl flex items-center justify-center gap-4"
                                onClick={handleButtonClick}
                            >
                                <FaPlus size={24} />
                                Tạo dự án
                            </button>
                        </div>
                        {isFormVisible && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="relative w-2/4 p-6 bg-white rounded-md shadow-md">
                                    <button
                                        className="absolute top-2 left-2 text-gray-700 hover:text-gray-900"
                                        onClick={handleCloseClick}
                                    >
                                        <FaTimes size={24} />
                                    </button>
                                    {/*Form thêm dự án*/}
                                    <form className="p-6" onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectName">
                                                Tên dự án
                                            </label>
                                            <input
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="projectName"
                                                type="text"
                                                placeholder="Nhập tên dự án"
                                                value={projectName}
                                                onChange={(e) => setProjectName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectBackground">
                                                Ảnh nền (URL)
                                            </label>
                                            <input 
                                                className="shadow appearance-none border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                id="projectBackground"
                                                type="text" 
                                                placeholder="Nhập đường dẫn hình ảnh"
                                                value={projectImage}
                                                onChange={(e) => setProjectImage(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <button
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="submit"
                                            >
                                                Thêm dự án
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {/* Hiển thị tất cả các dự án */}
                        {isLoading ? (
                            <p>Đang tải dữ liệu...</p>
                        ) : (
                            projects.data.map((project) => (
                                <div 
                                    key={project.ProjectID} 
                                    className="bg-gray-100 rounded-md shadow-md hover:bg-gray-200 transition-all"
                                    onClick={() => handleProjectClick(project.ProjectID)}
                                >
                                    <div className="relative">
                                        <img
                                            className="w-full h-48 object-cover rounded-md"
                                            src={project.Background ?? bgproject} 
                                            alt="Project"
                                        />
                                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex p-4">
                                            <span className="text-white font-bold text-xl">{project.ProjectName}</span>
                                        </div>
                                        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
                                            <FaUser className="text-white text-xl" />
                                        </div>
                                        <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                                            <FaTrash 
                                                className="text-white text-xl" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(project.ProjectID)
                                                }}
                                            />
                                        </div>
                                        <div className="absolute bottom-4 right-12 flex items-center space-x-2">
                                            <FaEdit 
                                                className="text-white text-xl cursor-pointer hover:text-blue-400 transition-colors" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openEditForm(project)
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
            {toast && (
                <Toast
                message={toast.message}
                type={toast.type}
                duration={5000}
                onClose={() => setToast(null)}
                />
            )}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded shadow-md p-6">
                        <p className="mb-4">Bạn có chắc chắn muốn xóa dự án này không?</p>
                        <div className="flex justify-end space-x-2">
                            <button
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded"
                            onClick={handleCancelDelete}
                            >
                            Hủy bỏ
                            </button>
                            <button
                            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded"
                            onClick={handleConfirmDelete}
                            >
                            Xác nhận xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isEditFormVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="relative w-2/4 p-6 bg-white rounded-md shadow-md">
                <button
                    className="absolute top-2 left-2 text-gray-700 hover:text-gray-900"
                    onClick={closeEditForm}
                >
                    <FaTimes size={24} />
                </button>

                <form className="p-6" onSubmit={(e) => {
                    e.preventDefault();
                    updateProject(editProjectData.ProjectID, {
                    ProjectName: editProjectData.ProjectName,
                    Background: editProjectData.Background,
                    EmployeeID: editProjectData.EmployeeID,
                    Status: editProjectData.Status,
                    Role: editProjectData.Role
                    });
                    closeEditForm();
                }}>
                    <h2 className="text-xl font-bold mb-4">Chỉnh sửa dự án</h2>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tên dự án</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            type="text"
                            value={editProjectData.ProjectName}
                            onChange={(e) => setEditProjectData({ ...editProjectData, ProjectName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Ảnh nền (URL)</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            type="text"
                            value={editProjectData.Background}
                            onChange={(e) => setEditProjectData({ ...editProjectData, Background: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        type="submit"
                    >
                        Lưu thay đổi
                    </button>
                    </div>
                </form>
                </div>
            </div>
            )}
        </>
    )
}
export default PageProject;
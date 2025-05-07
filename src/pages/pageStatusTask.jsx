import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {FaPlus, FaTimes, FaTrash, FaEdit} from "react-icons/fa"
import axios from 'axios';
import Header from "../components/Header";
import Toast from "../components/Toast.jsx"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useLocation } from "react-router-dom";
const PageStatusTask = () => {

    const location = useLocation();
    const backgroundImage = location.state?.background || null;
    // const [projectName, setProjectName] = useState("");
    const {ProjectID} = useParams();
    const [statuses, setStatuses] = useState([]);
    const token = localStorage.getItem("authToken");

    const [isFormColumn, setIsFormColumn] = useState(false);

    const [statusName, setStatusName] = useState("");

    // Hiện thị thông báo
    const [toast, setToast] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedStatusID, setSelectedStatusID] = useState(null);

    // Ẩn Form tạo column status dự án
    const handleButtonColumnStatusClick = () => {
        setIsFormColumn(!isFormColumn);
    }
    const handleButtonColumnCloseColumStatusClick = () => {
        setIsFormColumn(false);
    }

    // Đầu vào khi thêm TaskCard
    const [activeTaskForm, setActiveTaskForm] = useState(null);
    const [newTaskContent, setNewTaskContent] = useState("");

    const [isFormTaskCardVisible, setIsFormTaskCardVisible] = useState(false);
    const [selectedStatusForTask, setSelectedStatusForTask] = useState(null);

    // const [taskCards, setTaskCards] = useState({});

    const [taskCardToDelete, setTaskCardToDelete] = useState(null); // lưu ID task đang muốn xóa
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [selectedTaskCard, setSelectedTaskCard] = useState(null);
    const [taskDetail, setTaskDetail] = useState(null);
    const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
    const [detailDescription, setDetailDescription] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    
    
    // Lấy tất cả các status của project này
    const fetchStatuses = async () => {
        try {
            const res = await axios.get(`https://api.qlcv.uonghoailuong.vn/api/statusTask/project/${ProjectID}`, {
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
        
            if (Array.isArray(res.data)) {
                setStatuses(res.data);
            } else if (res.data && Array.isArray(res.data.data)) {
                setStatuses(res.data.data);
            } else {
                setStatuses([]);
                console.error("API trả về dữ liệu không đúng định dạng:", res.data);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách status:", error);
            setStatuses([]);
        }
    };
      
    useEffect(() => {
    fetchStatuses();
    }, [ProjectID, token]);
    
    const createColumnStatus = async () => {
        try {
            const statusData = { 
                StatusName: statusName,
                ProjectID: ProjectID
            };
            await axios.post("https://api.qlcv.uonghoailuong.vn/api/statusTask/create",
                statusData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );
            setToast({message:"Tạo status task thành công!", type: "success"});
            setIsFormColumn(false);
            setStatusName("");
            const res = await axios.get(`https://api.qlcv.uonghoailuong.vn/api/statusTask/project/${ProjectID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            setStatuses(Array.isArray(res.data) ? res.data : res.data.data); 
        } catch (error) {
            console.error("Lỗi khi tạo status task:", error);
            setToast({ message: 'Tạo status task thất bại! Vui lòng thử lại.', type: 'error' });
        }
    };

    const handleColumnStatusSubmit = (event) => {
        event.preventDefault();
        createColumnStatus();
    }

    const deleteStatusTask = async (StatustTaskID) => {
        try{
            await axios.delete(
                `https://api.qlcv.uonghoailuong.vn/api/statusTask/delete/${StatustTaskID}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );
            setToast({ message: "Xóa Status thành công!", type: "success" });
            const res = await axios.get(`https://api.qlcv.uonghoailuong.vn/api/statusTask/project/${ProjectID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
            setStatuses(Array.isArray(res.data) ? res.data : res.data.data);  // Làm mới lại danh sách dự án sau khi xóa thành công
        } catch (error) {
            console.error("Lỗi khi xóa Status:", error);
            setToast({ message: 'Xóa Status thất bại! Vui lòng thử lại.', type: 'error' });
        }
    }

    const handleDeleteClick = (StatustTaskID) => {
        setSelectedStatusID(StatustTaskID);
        setShowConfirm(true);
    };
    
    const handleConfirmDelete = async () => {
        await deleteStatusTask(selectedStatusID);
        setShowConfirm(false);
        setSelectedStatusID(null);
    };
    
    const handleCancelDelete = () => {
        setShowConfirm(false);
        setSelectedStatusID(null);
    };

    const [isEditFormVisible, setEditFormVisible] = useState(false);
    const [editStatusData, setEditStatusData] = useState({
        StatustTaskID: null,
        StatusName: ""
    });

    const openEditForm = (status) => {
        setEditStatusData({
            StatustTaskID: status.StatustTaskID,
            StatusName: status.StatusName
        });
        setEditFormVisible(true);
    };
    
    const closeEditForm = () => {
        setEditFormVisible(false);
        setEditStatusData({ StatustTaskID: null, StatusName: "" });
    };

    const updateStatusTask = async () => {
        try {
            const updatedData = {
                StatusName: editStatusData.StatusName,
                ProjectID: ProjectID // nếu API yêu cầu khóa ngoại
            };
    
            await axios.patch(
                `https://api.qlcv.uonghoailuong.vn/api/statusTask/edit/${editStatusData.StatustTaskID}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }
            );
    
            setToast({ message: "Cập nhật status thành công!", type: "success" });
            closeEditForm();
    
            // Làm mới danh sách status
            const res = await axios.get(`https://api.qlcv.uonghoailuong.vn/api/statusTask/project/${ProjectID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatuses(Array.isArray(res.data) ? res.data : res.data.data);
    
        } catch (error) {
            console.error("Lỗi khi cập nhật status:", error);
            setToast({ message: 'Cập nhật thất bại! Vui lòng thử lại.', type: 'error' });
        }
    };

    // Hàm tạo TaskCard
    const createTaskCard = async (statusId) => {
        try {
            const employeeRes = await axios.get("https://api.qlcv.uonghoailuong.vn/api/user", {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            const employeeId = employeeRes.data?.employee?.EmployeeID;
        
            const taskData = {
                TaskCardName: newTaskContent,
                StatustTaskID: statusId,
                EmployeeID: employeeId,
            };
        
            await axios.post("https://api.qlcv.uonghoailuong.vn/api/taskCard/create", taskData, {
                headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                },
            });
        
            setToast({ message: "Tạo TaskCard thành công!", type: "success" });
            setActiveTaskForm(null);
            setNewTaskContent("");
            await fetchStatuses();
      
        } catch (error) {
            console.error("Lỗi khi tạo TaskCard:", error);
            setToast({ message: "Tạo TaskCard thất bại!", type: "error" });
        }
    };
 
      // Hàm xử lý kéo thả task
      const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || source.droppableId === destination.droppableId) return;
      
        const draggedTask = statuses
          .flatMap(status => status.task_cards || [])
          .find(task => String(task.TaskCardID) === draggableId);
      
        if (!draggedTask) return;
      
        const newStatuses = statuses.map((status) => {
          // Cột hiện tại
            if (String(status.StatustTaskID) === source.droppableId) {
                return {
                ...status,
                task_cards: (status.task_cards || []).filter(
                    (task) => String(task.TaskCardID) !== draggableId
                ),
                };
            }
        
            // Cột đích
            if (String(status.StatustTaskID) === destination.droppableId) {
                const newTask = { ...draggedTask, StatustTaskID: Number(destination.droppableId) };
                const updatedTasks = [...(status.task_cards || [])];
                updatedTasks.splice(destination.index, 0, newTask);
        
                return {
                ...status,
                task_cards: updatedTasks,
                };
            }
        
            return status;
        });
      
        setStatuses(newStatuses); // cập nhật UI ngay
      
        try {
            await axios.patch(`https://api.qlcv.uonghoailuong.vn/api/taskCard/edit/${draggedTask.TaskCardID}`, {
                TaskCardName: draggedTask.TaskCardName,
                StatustTaskID: destination.droppableId,
                EmployeeID: draggedTask.EmployeeID,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error("Lỗi cập nhật task:", err);
            setToast({ message: "Lỗi cập nhật vị trí!", type: "error" });
        }
    };

    const deleteTaskCard = async (taskCardId) => {
        try {
            await axios.delete(`https://api.qlcv.uonghoailuong.vn/api/taskCard/delete/${taskCardId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
          });
      
            setToast({ message: "Xóa TaskCard thành công!", type: "success" });
            await fetchStatuses(); // cập nhật lại giao diện
        } catch (error) {
            console.error("Lỗi khi xóa TaskCard:", error);
            setToast({ message: "Xóa TaskCard thất bại!", type: "error" });
        }
    };
    
    return(
        <>
            <div className="flex">
                <Header/>
                <div className="w-full relative min-h-screen bg-cover bg-center"
                    style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none" }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
                    <div className="relative z-10">
                        <DragDropContext onDragEnd={onDragEnd}>
                            <div className="flex space-x-4 p-4 overflow-x-auto">
                                {statuses.map((statusItem) => (
                                <Droppable droppableId={String(statusItem.StatustTaskID)} key={statusItem.StatustTaskID}>
                                    {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="flex flex-col min-w-[250px] bg-gray-100 rounded-lg shadow-md p-4 flex-shrink-0 relative"
                                    >
                                        {/* Icon chỉnh sửa & xóa ở góc trên */}
                                        <div className="absolute top-2 left-2">
                                        <FaEdit
                                            className="text-black text-xl cursor-pointer hover:text-blue-500"
                                            onClick={() => openEditForm(statusItem)}
                                        />
                                        </div>
                                        <div className="absolute top-2 right-2">
                                        <FaTrash
                                            className="text-black text-xl cursor-pointer hover:text-red-600"
                                            onClick={() => handleDeleteClick(statusItem.StatustTaskID)}
                                        />
                                        </div>

                                        {/* Tiêu đề */}
                                        <h3 className="font-bold text-center mb-4 mt-2">{statusItem.StatusName}</h3>

                                        {/* Nút thêm TaskCard ngay sau tiêu đề */}
                                        <div className="flex justify-center mb-4">
                                        <button
                                            className="min-w-[150px] bg-white border border-gray-300 hover:border-blue-500 text-blue-600 hover:text-blue-700 rounded-lg shadow-sm px-4 py-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                                            onClick={() => {
                                            setIsFormTaskCardVisible(true);
                                            setSelectedStatusForTask(statusItem.StatustTaskID);
                                            }}
                                        >
                                            <FaPlus size={18} />
                                            Thêm TaskCard
                                        </button>
                                        </div>

                                        {/* TaskCards */}
                                        <div className="space-y-2 min-h-[150px]">
                                        {(statusItem.task_cards || []).map((task, index) => (
                                            <Draggable key={task.TaskCardID} draggableId={String(task.TaskCardID)} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="p-2 bg-white rounded shadow mb-2 flex justify-between items-center cursor-pointer"
                                                    onClick={() => {
                                                        const detail = task.task_card_detail || null;
                                                        setSelectedTaskCard(task);
                                                        setTaskDetail(detail);
                                                        setDetailDescription(detail?.Description || "");
                                                        setShowTaskDetailModal(true);
                                                    }}
                                                >
                                                    {task.TaskCardName}
                                                    <FaTimes
                                                    className="text-red-500 cursor-pointer hover:text-red-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setTaskCardToDelete(task.TaskCardID);
                                                        setShowConfirmDelete(true);
                                                    }}
                                                    />
                                                </div>
                                            )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                        </div>
                                    </div>
                                    )}
                                </Droppable>
                                ))}

                                {/* Nút thêm cột */}
                                <button
                                className="flex flex-col justify-center items-center min-w-[250px] min-h-[120px] bg-gray-100 rounded-lg shadow-md p-4 flex-shrink-0 text-center font-bold gap-2"
                                onClick={handleButtonColumnStatusClick}
                                >
                                <FaPlus size={24} />
                                Thêm cột
                                </button>
                            </div>
                        </DragDropContext>
                    </div>
                    {isFormTaskCardVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="relative w-2/4 p-6 bg-white rounded-md shadow-md">
                        {/* Nút đóng form */}
                        <button
                            className="absolute top-2 left-2 text-gray-700 hover:text-gray-900"
                            onClick={() => {
                            setIsFormTaskCardVisible(false); // ẩn form
                            setNewTaskContent(""); // reset nội dung
                            }}
                        >
                            <FaTimes size={24} />
                        </button>

                        {/* Form nhập nội dung task */}
                        <form className="p-6" onSubmit={(e) => {
                            e.preventDefault(); // ngăn reload trang
                            createTaskCard(selectedStatusForTask); // gọi API tạo task
                            setIsFormTaskCardVisible(false); // ẩn form sau khi tạo
                        }}>
                            <h2 className="text-xl font-bold mb-4">Thêm TaskCard</h2>

                            <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Nội dung Task
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                                type="text"
                                value={newTaskContent}
                                onChange={(e) => setNewTaskContent(e.target.value)}
                                placeholder="Nhập nội dung task..."
                                required
                            />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    type="submit"
                                >
                                    Thêm TaskCard
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                    )}
                    {isFormColumn && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="relative w-2/4 p-6 bg-white rounded-md shadow-md">
                                <button
                                    className="absolute top-2 left-2 text-gray-700 hover:text-gray-900"
                                    onClick={handleButtonColumnCloseColumStatusClick}
                                >
                                    <FaTimes size={24} />
                                </button>
                                {/*Form thêm cột status*/}
                                <form className="p-6" onSubmit={handleColumnStatusSubmit}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="projectName">
                                            Tên cột
                                        </label>
                                        <input
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                            id="statusName"
                                            type="text"
                                            placeholder="Nhập tên cột"
                                            value={statusName}
                                            onChange={(e) => setStatusName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                            type="submit"
                                        >
                                            Thêm cột
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                
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
                        <p className="mb-4">Bạn có chắc chắn muốn xóa cột này không?</p>
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
                            updateStatusTask();
                        }}>
                            <h2 className="text-xl font-bold mb-4">Chỉnh sửa tên cột</h2>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Tên cột</label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                                    type="text"
                                    value={editStatusData.StatusName}
                                    onChange={(e) => setEditStatusData({ ...editStatusData, StatusName: e.target.value })}
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
            {showConfirmDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-md p-6 w-[90%] max-w-md text-center">
                <h2 className="text-xl font-semibold mb-4">Xác nhận xóa</h2>
                <p className="mb-6">Bạn có chắc chắn muốn xóa TaskCard này không?</p>
                <div className="flex justify-center gap-4">
                    <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    onClick={() => {
                        setTaskCardToDelete(null);
                        setShowConfirmDelete(false);
                    }}
                    >
                        Hủy
                    </button>
                    <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={async () => {
                        await deleteTaskCard(taskCardToDelete);
                        setTaskCardToDelete(null);
                        setShowConfirmDelete(false);
                    }}
                    >
                    Xóa
                    </button>
                </div>
                </div>
            </div>
            )}
            {showTaskDetailModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-md p-6 w-[90%] max-w-lg relative">
                <button
                    className="absolute top-2 right-2 text-gray-700 hover:text-black"
                    onClick={() => {
                    setShowTaskDetailModal(false);
                    setTaskDetail(null);
                    setDetailDescription("");
                    setSelectedFile(null);
                    }}
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4">
                    {taskDetail ? "Chỉnh sửa mô tả TaskCard" : "Thêm mô tả cho TaskCard"}
                </h2>

                <form
                    onSubmit={async (e) => {
                    e.preventDefault();
                        try {
                            const employeeRes = await axios.get("https://api.qlcv.uonghoailuong.vn/api/user", {
                                headers: { Authorization: `Bearer ${token}` },
                            });
                            const employeeID = employeeRes.data.employee?.EmployeeID;
                        
                            const formData = new FormData();
                            formData.append("TaskCardID", selectedTaskCard.TaskCardID);
                            formData.append("EmployeeID", employeeID);
                            formData.append("Description", detailDescription);
                            if (selectedFile) formData.append("File", selectedFile);
                        
                            if (taskDetail) {
                                await axios.patch(`https://api.qlcv.uonghoailuong.vn/api/taskCardDetail/edit/${taskDetail.TaskCardDetailID}`, formData, {
                                headers: { 
                                    Authorization: `Bearer ${token}`,
                                    "Content-Type": "multipart/form-data" 
                                },
                                });
                                setToast({ message: "Cập nhật thành công!", type: "success" });
                            } else {
                                await axios.post("https://api.qlcv.uonghoailuong.vn/api/taskCardDetail/create", formData, {
                                headers: { 
                                    Authorization: `Bearer ${token}`, 
                                    "Content-Type": "multipart/form-data" 
                                },
                                });
                                setToast({ message: "Tạo chi tiết taskcard thành công!", type: "success" });
                        
                                // Gán lại để lần click tiếp theo sẽ có dữ liệu hiển thị
                                setTaskDetail({
                                TaskCardDetailID: Date.now(), // tạm tạo ID giả
                                Description: detailDescription,
                                File: selectedFile?.name || ""
                                });
                            }
                        
                            await fetchStatuses(); // cập nhật lại UI
                            setShowTaskDetailModal(false);
                            setDetailDescription("");
                            setSelectedFile(null);
                        } catch (err) {
                            console.error("Lỗi khi xử lý chi tiết TaskCard:", err);
                            setToast({ message: "Lỗi khi xử lý mô tả!", type: "error" });
                        }
                    }}
                >
                    <label className="block text-sm font-medium mb-2">Mô tả</label>
                    <textarea
                        rows={4}
                        className="w-full border rounded p-2 mb-4"
                        value={detailDescription}
                        onChange={(e) => setDetailDescription(e.target.value)}
                    />

                    <label className="block text-sm font-medium mb-2">Tệp đính kèm (nếu có)</label>
                    <input
                        type="file"
                        className="w-full border rounded p-2 mb-4"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                    />

                    {taskDetail?.Description && (
                        <p className="mb-4">
                            <strong>Mô tả công việc:</strong> {taskDetail.Description}
                        </p>
                    )}
                    {taskDetail?.File && (
                        
                        <a
                            href={taskDetail.File}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline mb-4 block"
                        >
                            Xem tệp đính kèm
                        </a>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={() => setShowTaskDetailModal(false)}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            {taskDetail ? "Cập nhật" : "Thêm"}
                        </button>
                    </div>
                </form>
                </div>
            </div>
            )}
        </>
    )
}
export default PageStatusTask;
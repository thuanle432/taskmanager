import React, { useEffect, useState } from "react";

const Toast = ({ message, type, duration = 2000, onClose }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true);

        const timer = setTimeout(() => {
        setShow(false);
    }, duration);

        const closeTimer = setTimeout(() => {
        onClose();
        }, duration + 300); // Chờ thêm 300ms cho hiệu ứng hoàn thành

        return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
        };
    }, [duration, onClose]);

    const typeStyle = {
        success: "bg-green-500",
        error: "bg-red-500",
    };

    return (
        <div
        className={`fixed top-5 right-5 px-4 py-2 rounded shadow text-white transition-all duration-300
            ${typeStyle[type]}
            ${show ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
        {message}
        </div>
    );
};

export default Toast;
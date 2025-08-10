import React from "react";
import Toast from "./Toast";
import { useToast } from "../../contexts/ToastContext";

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex flex-col">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            duration={toast.duration || 3000}
            type={toast.type}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;

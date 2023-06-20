import React, { useState } from "react";
import "../styles/Modal.css";

const Modal = ({ isOpen, onClose, onConfirm, title, message, children }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = () => {
    onConfirm(inputValue);
    setInputValue("");
  };

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>
        {isOpen && (
          <>
            {onConfirm && (
              <div className="input-container">
                {children}
              </div>
            )}
            <div className="button-container">
              {onConfirm && (
                <button className="confirm-button" onClick={handleConfirm}>
                  Confirm
                </button>
              )}
              <button className="cancel-button" onClick={onClose}>
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;

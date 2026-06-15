"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const ModalContext = createContext(null);

export default function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [modalClass, setModalClass] = useState("max-w-md w-[92%] p-4");

  const openModal = useCallback((node, customClass = "max-w-md w-[92%] p-4") => {
    setContent(node);
    setModalClass(customClass);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // keep content for a tiny moment for animation (if needed)
    setTimeout(() => {
      setContent(null);
      setModalClass("max-w-md w-[92%] p-4");
    }, 200);
  }, []);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") closeModal();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeModal]);

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, setContent }}
    >
      {children}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 pointer-events-none"
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            className={`relative border bg-white rounded-3xl shadow-2xl z-10 overflow-hidden transition-all duration-300 ${modalClass}`}
          >
            {/* Context Close Button - hidden if custom layout handles closing */}
            {!modalClass.includes("p-0") && (
              <button
                aria-label="Close modal"
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 z-50"
                onClick={closeModal}
              >
                ✕
              </button>
            )}

            <div>{content}</div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);

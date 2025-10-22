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

  const openModal = useCallback((node) => {
    setContent(node);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // keep content for a tiny moment for animation (if needed)
    setTimeout(() => setContent(null), 200);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={closeModal}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative bg-white rounded-lg shadow-lg max-w-lg w-[92%] p-6 z-10"
          >
            <button
              aria-label="Close modal"
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={closeModal}
            >
              ✕
            </button>

            <div>{content}</div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);

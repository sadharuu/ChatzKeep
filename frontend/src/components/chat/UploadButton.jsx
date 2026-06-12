"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";

export default function UploadButton({
  onFileSelect,
}) {
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    onFileSelect(file);

    e.target.value = "";
  };

  return (
    <>
      <button
        onClick={() => fileRef.current.click()}
        className="border border-gray-300 p-3 rounded-lg hover:bg-gray-100 transition"
      >
        <Paperclip size={18} />
      </button>

      <input
        type="file"
        hidden
        ref={fileRef}
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />
    </>
  );
}
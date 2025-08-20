import React, { useRef } from "react";

interface OtpInputProps {
  length?: number;
  onChangeOtp?: (otp: string) => void;
}

export default function InputOtp({ length = 6, onChangeOtp }: OtpInputProps) {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    if (el) inputsRef.current[index] = el;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    let value = e.target.value;

    // Ambil karakter terakhir saja supaya overwrite
    if (value.length > 1) {
      value = value.slice(-1);
    }
    e.target.value = value;

    // Jika input sudah ada isi, langsung fokus ke input berikutnya (index + 1)
    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
      // Optional: juga select isi input berikutnya supaya langsung tertimpa saat ketik
      inputsRef.current[index + 1]?.select();
    }

    // Kirim gabungan OTP ke parent jika ada
    const otp = inputsRef.current.map((input) => input?.value || "").join("");
    onChangeOtp?.(otp);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-x-4">
      {[...Array(length)].map((_, i) => (
        <input
          key={i}
          type="number"
          maxLength={1}
          ref={setInputRef(i)}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="input-no-spinner block h-10 w-9 text-center border border-gray-300 rounded-md sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
          placeholder="⚬"
        />
      ))}
    </div>
  );
}

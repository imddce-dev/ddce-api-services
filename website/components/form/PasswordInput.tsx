import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, Path } from 'react-hook-form';
interface FormFields {
  [key: string]: any;
}
type PasswordInputProps<T extends FormFields> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  name?: Path<T>;
  placeholder?: string;
};
export const PasswordInput = <T extends FormFields>({
  register,
  errors,
  name = 'password' as Path<T>,
  placeholder = 'Password',
}: PasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const error = errors[name];
  return (
    <div className="relative w-full">
      <input
        id={name}
        type={showPassword ? 'text' : 'password'}
        className={`w-full rounded-lg border bg-slate-900/80 
                   px-4 py-2 pr-12 
                   text-slate-100 outline-none transition duration-700 ease-in-out focus:ring-2 ${
          error 
            ? 'border-red-400 focus:ring-red-400/40'
            : 'border-white/10 focus:border-cyan-400 [&:not(:placeholder-shown)]:border-cyan-400 focus:ring-cyan-400/40'
        }`}
        placeholder={placeholder}
        {...register(name, { required: `กรุณาป้อน${placeholder}ให้ถูกต้อง` })}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 hover:text-cyan-400"
        title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
      >
        {showPassword ? (
          <small className="text-xs font-semibold">ซ่อน</small>
        ) : (
          <small className="text-xs font-semibold">แสดง</small>
        )}
      </button>
    </div>
  );
};
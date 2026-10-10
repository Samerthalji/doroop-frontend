import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Register } from "../Api/authService";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    location: "",
  });
  const { setUserEmail } = useAuth();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fName) e.fName = "Required";
    if (!form.lName) e.lName = "Required";
    if (!form.email) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }
  setErrors({});
  setLoading(true);

  try {
    const { confirmPassword, ...registerData } = form;
    const response = await Register(registerData);

    if (response.status === 200 || response.status === 201) {
      setUserEmail(form.email);
      navigate("/email-verification");
    }
  } catch (error) {
    // Axios بيحط الرد الجاي من السيرفر جوا error.response
    const response = error.response;

    if (response) {
      // الاسم الصحيح هو .status مش .statusCode
      const status = response.status;
      const data = response.data;

      // الفحص بناءً على الـ Status أو محتوى الـ JSON اللي بعته
      if (status === 409 || data.requiresVerification === true) {

        setUserEmail(form.email);
        navigate("/email-verification");
        return; // عشان يوقف وما يكمل لباقي الأخطاء
      }
    }

    // إذا وصل هون، معناها الخطأ مش 409
    const serverMessage = response?.data?.message || "حدث خطأ غير متوقع";
    setErrors({ server: serverMessage });

  } finally {
    setLoading(false);
  }
};

  const field = (label, name, type = "text", placeholder = "") => (
    <div>
      <label className="block text-sm text-start font-semibold text-gray-700 mb-1 px-3">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder || label}
        value={form[name]}
        onChange={(e) => setForm({ ...form, [name]: e.target.value })}
        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1 px-3">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px]">
        <div
          className="w-full md:w-7/12 p-3 md:p-10 bg-white text-right"
          dir="ltr"
        >
          <div className="flex flex-col items-center mb-6 gap-1">
            <img src="/5.png" alt="Doroop Logo" className="w-1/3" />
            <h2 className="text-3xl font-extrabold text-blue-800 mt-4 mb-3">
              Sign Up
            </h2>
            <p className="text-gray-500 text-sm">
              Create your account to get started
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("First Name", "fName", "text", "First Name")}
              {field("Last Name", "lName", "text", "Last Name")}
            </div>
            {field("Email Address", "email", "email", "name@example.com")}
            {field("Password", "password", "password", "********")}
            {field(
              "Confirm Password",
              "confirmPassword",
              "password",
              "********",
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("Phone number", "phoneNumber", "tel", "077*******")}
              {field("Location", "location", "text", "Jordan-Amman")}
            </div>
            {errors.server && (
              <p className="text-red-500 text-sm text-center" role="alert">
                {errors.server}
              </p>
            )}
            <button
              type="submit"
              className={`w-full bg-white ${loading ? "bg-gray-400" : "bg-blue-800 hover:bg-indigo-700"} border-2 border-blue-800 font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transform transition active:scale-95 mt-10`}
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>

        <div className="hidden md:flex relative w-full md:w-5/12 bg-indigo-900 text-white p-8 flex-col justify-end overflow-hidden">
          <img
            src="/signup-bg.webp"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent"></div>
          <div className="relative z-10 text-left">
            <h1 className="text-4xl font-bold leading-tight">
              Your skills deserve <br />
              <span className="text-blue-400">the best opportunities</span>
            </h1>
            <p className="mt-4 text-gray-200 text-sm leading-relaxed">
              Your next career milestone is waiting for you. Log in to see who's
              looking for your skills today.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

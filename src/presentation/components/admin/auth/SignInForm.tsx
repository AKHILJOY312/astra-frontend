// src/pages/admin/Login.tsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/presentation/redux/thunk/authThunks";
import type { AppDispatch, RootState } from "@/presentation/redux/store/store";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "@/presentation/yup/AuthSchema";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (
    values: { email: string; password: string },
    { setFieldError }: any
  ) => {
    try {
      await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
          isAdminLogin: true,
        })
      ).unwrap();

      navigate("/admin/dashboard");
    } catch (err: any) {
      setFieldError("server", err || "Invalid admin credentials");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-purple-600 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Portal
          </h2>
          <p className="text-gray-600">Sign in to manage your platform</p>
        </div>

        {/* Admin Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm bg-opacity-95 border border-gray-100">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Admin Access Only
            </div>
          </div>

          <Formik
            initialValues={{ email: "", password: "", server: undefined }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-5">
                {/* Server Error */}
                {errors.server && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errors.server}</span>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Field
                      name="email"
                      type="email"
                      placeholder="admin@yourapp.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none ${
                        errors.email && touched.email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white"
                      }`}
                      disabled={loading || isSubmitting}
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none ${
                        errors.password && touched.password
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 bg-white"
                      }`}
                      disabled={loading || isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <a
                    href="/forget-password"
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading || isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign In as Admin"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Protected admin area • Only authorized personnel allowed
            </p>
          </div>
        </div>

        {/* Back to User Login */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Not an admin?{" "}
          <a
            href="/"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Go to user login
          </a>
        </p>
      </div>
    </div>
  );
}

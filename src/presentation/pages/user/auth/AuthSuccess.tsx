// src/pages/AuthSuccess.tsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/presentation/redux/thunk/authThunks";
import { useAppDispatch } from "@/presentation/redux/hooks";

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      dispatch(loginSuccess({ token }));
      navigate("/project", { replace: true });
    } else {
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Logging you in...</h1>
        <p className="mt-2">Please wait</p>
      </div>
    </div>
  );
}

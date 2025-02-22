import React, { useContext, useState } from "react";
import { UserLogin, GetLearner } from "../../api/userApi";
import { BiShow, BiHide } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { LearnerContext } from "../../components/Context/LearnerContext";

const Login = () => {
  const { setLearner } = useContext(LearnerContext);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleShowPassword = () => {
    return setShowPassword(!showPassword);
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Email không hợp lệ');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      valid = false;
    } else {
      setPasswordError('');
    }

    if (!valid) return;

    try {
      const response = await UserLogin(email, password);
      if (response.status === 200) {
        const userResponse = await GetLearner(response.data.Learner_ID);
        localStorage.setItem('learner', JSON.stringify(userResponse.data));
        setLearner(userResponse.data);
        navigate('/user');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setEmailError(error.response.data);
        } else if (error.response.status === 401) {
          setPasswordError('');
          setLoginError('Email hoặc mật khẩu không đúng');
        } else if (error.response.status === 404) {
          setLoginError('Tài khoản không tồn tại');
        }
      } else {
        setLoginError('Email hoặc mật khẩu không đúng');
      }
    }
  };

  return (
    <div className="flex mt-10 items-center justify-center">
      <div className="bg-white px-10 py-20 rounded-3xl border-2">
        <h1 className="text-5xl font-semibold">Welcome Back</h1>
        <p className="font-medium text-lg text-gray-500 mt-4">
          Welcome back! Enter your details.
        </p>
        <div className="mt-8 ">
          <div>
            <label className="text-lg font-medium">Email</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-red-500 mt-2">{emailError}</p>}
          </div>

          <div>
            <label className="text-lg font-medium">Password</label>
            <div className="relative w-full">
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                onClick={handleShowPassword}
              >
                {showPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 mt-2">{passwordError}</p>}
          </div>

          {loginError && <p className="text-red-500 mt-4">{loginError}</p>}

          <div className="mt-8 flex flex-col gap-y-4 items-center">
            <button
              className="active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:bg-violet-900 ease-in-out transition-all px-10 py-2 rounded-xl bg-violet-500 text-white text-lg font-bold"
              onClick={handleLogin}
            >
              Login
            </button>
            <p>
              Don't have an account?
              <a
                href="/register"
                className="px-1 text-violet-500 font-medium hover:text-violet-900"
              >
                Register here
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

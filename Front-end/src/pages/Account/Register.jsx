import React, { useState } from "react";
import { UserRegister } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    phone_number: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    let value = event.target.value;
    setFormValues({
      ...formValues,
      [event.target.name]: value,
    });
  };

  const validate = () => {
    let errors = {};
    if (!formValues.name) {
      errors.name = "Name is required";
    } else if (/\d/.test(formValues.name)) {
      errors.name = "Name cannot contain numbers";
    }
    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Email address is invalid";
    }
    if (!formValues.password) {
      errors.password = "Password is required";
    } else if (formValues.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!formValues.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (formValues.password !== formValues.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formValues.age) {
      errors.age = "Age is required";
    } else if (!/^\d+$/.test(formValues.age)) {
      errors.age = "Age must be a number";
    }
    if (!formValues.phone_number) {
      errors.phone_number = "Phone number is required";
    } else if (!/^\d{10}$/.test(formValues.phone_number)) {
      errors.phone_number = "Phone number must be exactly 10 digits";
    }
    if (!formValues.address) {
      errors.address = "Address is required";
    }

    return errors;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const { confirmPassword, ...data } = formValues;
    try {
      const response = await UserRegister(data);
      console.log("User registered successfully!", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  return (
    <div className="flex mt-10 items-center justify-center">
      <div className="bg-white px-10 py-10 rounded-3xl border-2">
        <h1 className="text-5xl font-semibold">Hi Friend!</h1>
        <p className="font-medium text-lg text-gray-500 mt-4">
          Fill up personal information and start your journey with us.
        </p>
        <div className="mt-8">
          <div>
            <label className="text-lg font-medium">Full name</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              type="text"
              placeholder="Enter your name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="text-lg font-medium">Email</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="text-lg font-medium">Password</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              type="password"
              placeholder="Enter your password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label className="text-lg font-medium">Confirm Password</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              type="password"
              placeholder="Confirm your password"
              name="confirmPassword"
              value={formValues.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
          </div>
          <div>
            <label className="text-lg font-medium">Age</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              type="text"
              placeholder="Enter your age"
              name="age"
              value={formValues.age}
              onChange={handleChange}
            />
            {errors.age && <p className="text-red-500">{errors.age}</p>}
          </div>
          <div>
            <label className="text-lg font-medium">Phone number</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              type="text"
              placeholder="Enter your phone number"
              value={formValues.phone_number}
              name="phone_number"
              onChange={handleChange}
            />
            {errors.phone_number && <p className="text-red-500">{errors.phone_number}</p>}
          </div>
          <div>
            <label className="text-lg font-medium">Address</label>
            <input
              className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
              type="text"
              placeholder="Enter your address"
              name="address"
              value={formValues.address}
              onChange={handleChange}
            />
            {errors.address && <p className="text-red-500">{errors.address}</p>}
          </div>
          <div className="mt-8 flex flex-col gap-y-4 items-center">
            <button
              className="active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:bg-violet-900 ease-in-out transition-all px-10 py-2 rounded-xl bg-violet-500 text-white text-lg font-bold"
              onClick={handleRegister}
            >
              Register
            </button>
            <p>
              Have an account?
              <a
                href="/"
                className="px-1 text-violet-500 font-medium hover:text-violet-900"
              >
                Login here
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

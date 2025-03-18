import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { no_avatar } from "../../../assets/index";
import Loading from "../../../components/Loading";

const UserName_REGEX =
  /^[a-zA-Z0-9](_(?!(.|_))|.(?!(_|.))|[a-zA-Z0-9]){6,20}[a-zA-Z0-9]$/;
const Email_REGEX =
  /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
const Password_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;

const Create = () => {
  const { pathname } = useLocation();
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    file: "",
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    status: "",
  });

  const handleChangeInput = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setValues({ ...values, [name]: files[0] });
      setImage(files[0]);
    } else {
      setValues({ ...values, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      file,
      firstName,
      lastName,
      userName,
      email,
      password,
      confirmPassword,
      role,
      status,
    } = values;

    let newErrors = {};

    if (!userName) newErrors.userName = "User name is required.";
    else if (!UserName_REGEX.test(userName))
      newErrors.userName =
        "Username must be 6-20 characters long, can contain letters, numbers, dots, and underscores, but cannot start or end with a dot or underscore.";

    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!file) newErrors.file = "File is required.";
    if (!status) newErrors.status = "Status is required.";
    if (!role) newErrors.role = "Role is required.";

    if (!email) newErrors.email = "Email is required.";
    else if (!Email_REGEX.test(email))
      newErrors.email = "Invalid email format.";

    if (!password) newErrors.password = "Password is required.";
    else if (!Password_REGEX.test(password))
      newErrors.password =
        "Password must be 8-30 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";

    if (!confirmPassword)
      newErrors.confirmPassword = "Confirm password is required.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 5000);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await UserService.createUser(
        file,
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword,
        role,
        status
      );
      setValues({
        file: "",
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        status: "",
      });
      toast.success("Create user successfully.");
      navigate("/dashboard/users");
    } catch (error) {
      setErrors({
        apiError: error,
      });
      setTimeout(() => setErrors({}), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}

      <div className="flex flex-col gap-5 mt-5">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-xl capitalize">
            {pathname.split("/").pop()}
          </div>
          <Link to="/dashboard/users">
            <button className="px-3 py-2 bg-blue-950 text-white rounded-md">
              Back to List
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 p-2 sm:p-5 bg-gray-100 rounded-md">
          {errors && errors.apiError && (
            <div
              className="p-4 my-2 text-sm text-red-700 rounded-lg bg-red-100"
              role="alert"
            >
              <span className="font-bold">Error: </span>
              {errors.apiError}
            </div>
          )}
          <form
            className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-3"
            onSubmit={handleSubmit}
          >
            <div className="sm:col-span-4 flex flex-col items-center justify-center">
              <label>
                <img
                  className="h-[10rem] w-[10rem] object-cover rounded-full"
                  src={image ? URL.createObjectURL(image) : no_avatar}
                  alt="Current profile photo"
                />
                <input
                  type="file"
                  name="file"
                  className="hidden"
                  onChange={handleChangeInput}
                />
              </label>
              {errors.file && (
                <span className="text-red-700">{errors.file}</span>
              )}
            </div>
            <div className="sm:col-span-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <label className="block">
                  <span className="block font-medium text-primary">
                    First Name:
                  </span>
                  <input
                    type="text"
                    className="px-3 py-2 border shadow-sm border-primary placeholder-slate-400 focus:outline-none block w-full rounded-lg sm:text-sm"
                    placeholder="Enter first name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChangeInput}
                  />
                  {errors.firstName && (
                    <span className="text-red-700">{errors.firstName}</span>
                  )}
                </label>
                <label className="block">
                  <span className="block font-medium text-primary">
                    Last Name:
                  </span>
                  <input
                    type="text"
                    className="px-3 py-2 border shadow-sm border-primary placeholder-slate-400 focus:outline-none block w-full rounded-lg sm:text-sm"
                    placeholder="Enter last name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChangeInput}
                  />
                  {errors.lastName && (
                    <span className="text-red-700">{errors.lastName}</span>
                  )}
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <label className="block">
                  <span className="block font-medium text-primary">
                    Username:
                  </span>
                  <input
                    type="text"
                    className="px-3 py-2 border shadow-sm border-primary placeholder-slate-400 focus:outline-none block w-full rounded-lg sm:text-sm"
                    placeholder="Enter user name"
                    name="userName"
                    value={values.userName}
                    onChange={handleChangeInput}
                  />
                  {errors.userName && (
                    <span className="text-red-700">{errors.userName}</span>
                  )}
                </label>
                <label className="block">
                  <span className="block font-medium text-primary">Email:</span>
                  <input
                    type="text"
                    className="px-3 py-2 border shadow-sm border-primary placeholder-slate-400 focus:outline-none block w-full rounded-lg sm:text-sm"
                    placeholder="Enter email"
                    name="email"
                    value={values.email}
                    onChange={handleChangeInput}
                  />
                  {errors.email && (
                    <span className="text-red-700">{errors.email}</span>
                  )}
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <label className="block">
                  <span className="block font-medium text-primary">
                    Password:
                  </span>
                  <input
                    type="password"
                    className="px-3 py-2 border shadow-sm border-primary placeholder-slate-400 focus:outline-none block w-full rounded-lg sm:text-sm"
                    placeholder="Enter password"
                    name="password"
                    value={values.password}
                    onChange={handleChangeInput}
                  />
                  {errors.password && (
                    <span className="text-red-700">{errors.password}</span>
                  )}
                </label>
                <label className="block">
                  <span className="block font-medium text-primary">
                    Confirm Password:
                  </span>
                  <input
                    type="password"
                    className="px-3 py-2 border shadow-sm border-primary placeholder-slate-400 focus:outline-none block w-full rounded-lg sm:text-sm"
                    placeholder="Enter confirm password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={handleChangeInput}
                  />
                  {errors.confirmPassword && (
                    <span className="text-red-700">
                      {errors.confirmPassword}
                    </span>
                  )}
                </label>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 sm:grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <label className="block">
                  <span className="block font-medium text-primary">Role:</span>
                  <select
                    name="role"
                    value={values.role}
                    onChange={handleChangeInput}
                    className="px-3 py-2 border shadow-sm border-primary placeholder-slate-400 focus:outline-none block w-full rounded-lg sm:text-sm"
                  >
                    <option value="">Select Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                  {errors.role && (
                    <span className="text-red-700">{errors.role}</span>
                  )}
                </label>
                <label className="block">
                  <span className="block font-medium text-primary">
                    Status:
                  </span>
                  <select
                    name="status"
                    value={values.status}
                    onChange={handleChangeInput}
                    className="px-3 py-2 border shadow-sm border-primary placeholder-slate-400 focus:outline-none block w-full rounded-lg sm:text-sm"
                  >
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  {errors.status && (
                    <span className="text-red-700">{errors.status}</span>
                  )}
                </label>
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-blue-950 text-white rounded-md"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Create;

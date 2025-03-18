import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { no_avatar } from "../../../assets/index";
import Loading from "../../../components/Loading";
import Delete from "../../../components/admin/Delete";

const List = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [remove, setRemove] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  useEffect(() => {
    getAllUsers();
  }, []);

  // Get All Users
  const getAllUsers = async () => {
    setLoading(true);

    try {
      const res = await UserService.getAll();
      if (res && res.data) {
        setUsers(res.data);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit User
  const handleEdit = async (id) => {
    try {
      const user = await UserService.getById(id);
    } catch (error) {
      console.error(error);
    }
  };

  // Delete User
  const handleDeleteClick = (id) => {
    setRemove(true);
    setCurrentId(id);
  };

  const handleDelete = async (id) => {
    setLoading(true);

    setTimeout(async () => {
      try {
        await UserService.deleteUser(id);
        toast.success("User deleted successfully.");
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
        setRemove(false);
      }
    }, 1000);
  };

  const columns = [
    { field: "#" },
    { field: "Image" },
    { field: "User Name" },
    { field: "Email" },
    { field: "Role" },
    { field: "Status" },
    { field: "Action" },
  ];

  return (
    <>
      {loading && <Loading />}

      <div className="flex flex-col gap-5 mt-5">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-xl capitalize">Users</div>
          <Link to="/dashboard/users/create">
            <button className="px-3 py-2 bg-blue-950 text-white rounded-md">
              Create New
            </button>
          </Link>
        </div>
        <div className="grid p-5 bg-gray-100 rounded-md">
          <div className="grid gap-5">
            <div className="overflow-x-auto">
              <table className="w-full text-center">
                <thead className="font-bold uppercase">
                  <tr>
                    {columns.map((column, index) => (
                      <th key={index} scope="col" className="px-6 py-3">
                        {column.field}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="capitalize">
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-6 py-3">{index + 1}</td>
                      <td className="px-6 py-3 flex justify-center">
                        <img
                          src={user.image ? user.image : no_avatar}
                          alt=""
                          className="h-10 w-10 object-cover rounded-full"
                        />
                      </td>
                      <td className="px-6 py-3">{user.userName}</td>
                      <td className="px-6 py-3 lowercase">{user.email}</td>
                      <td className="px-6 py-3">{user.role}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`${
                            user.status === "Inactive"
                              ? "bg-red-700"
                              : "bg-green-700"
                          } text-white px-2 py-1 rounded-md`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/dashboard/users/edit/${user.id}`}
                            onClick={() => handleEdit(params.row.id)}
                          >
                            <span className="px-3 py-2 border border-blue-950 text-blue-950 rounded-md">
                              Edit
                            </span>
                          </Link>
                          <div onClick={() => handleDeleteClick(user.id)}>
                            <span className="border px-3 py-2 text-red-700 border-red-700 hover:bg-red-700 hover:text-white rounded-lg cursor-pointer">
                              Delete
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {remove && (
        <Delete
          id={currentId}
          handleDelete={handleDelete}
          setRemove={setRemove}
        />
      )}
    </>
  );
};

export default List;

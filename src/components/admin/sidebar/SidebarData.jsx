import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarData = ({ toggle }) => {
  const data = [
    {
      title: "Pages",
      list: [
        {
          title: "Dashboard",
          path: "/dashboard",
          icon: <i className="bi bi-grid"></i>,
        },
        {
          title: "Users",
          path: "/dashboard/users",
          icon: <i className="bi bi-people"></i>,
        },
        {
          title: "Products",
          path: "/dashboard/products",
          icon: <i className="bi bi-archive"></i>,
        },
        {
          title: "Transactions",
          path: "/dashboard/transactions",
          icon: <i className="bi bi-coin"></i>,
        },
      ],
    },
    {
      title: "Account",
      list: [
        {
          title: "Settings",
          path: "/dashboard/settings",
          icon: <i className="bi bi-gear"></i>,
        },
        {
          title: "Help",
          path: "/dashboard/help",
          icon: <i className="bi bi-patch-question"></i>,
        },
      ],
    },
  ];

  const { pathname } = useLocation();

  return (
    <>
      <ul>
        {data.map((menuItem) => (
          <li key={menuItem.title}>
            <p className="font-medium my-2">{menuItem.title}</p>
            {menuItem.list.map((item) => (
              <Link
                to={item.path}
                key={item.path}
                className={`${
                  pathname === item.path ? "bg-white text-blue-950" : ""
                } flex items-center mx-2 my-2 p-2 gap-5 hover:bg-white hover:text-blue-950 rounded-md`}
              >
                <div className="text-2xl">{item.icon}</div>
                <div className={`${toggle ? "" : "hidden"} text-xl`}>
                  {item.title}
                </div>
              </Link>
            ))}
          </li>
        ))}
      </ul>
      <button className="flex items-center mx-2 p-2 gap-5 hover:bg-white hover:text-blue-950 rounded-md">
        <div className="text-2xl">
          <i className="bi bi-box-arrow-right"></i>
        </div>
        <div className={`${toggle ? "" : "hidden"} text-xl`}>Logout</div>
      </button>
    </>
  );
};

export default SidebarData;

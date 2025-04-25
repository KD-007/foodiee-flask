import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
import { getAllUsers, clearErrors, deleteUser } from "../../redux/actions/UserActions";
import { notify } from "../../utils/Notification";


const UsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
 

  const { error, users } = useSelector((state) => state.getAllUsers);

  const {
    error: deleteError,
    isDeleted,
    message,
  } = useSelector((state) => state.getSpecificUser);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  useEffect(() => {
    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      notify("error", deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      notify("success", message);
      navigate("/admin/users");
      dispatch(clearErrors());
    }

    dispatch(getAllUsers());
  }, [dispatch, error, deleteError, navigate, isDeleted, message]);

  const columns = [
    { field: "id", headerName: "User ID", minWidth: 180, flex: 0.8 },

    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
    },

    {
      field: "role",
      headerName: "Role",
      type: "number",
      minWidth: 150,
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin"
          ? "greenColor"
          : "redColor";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteUserHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  users &&
    users.forEach((item) => {
      rows.push({
        id: item.id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL USERS - Admin | Foodiee`} />

      <div className="row w-100">
        <SideBar />
        <div className="col-md-10 mt-5 pt-3">
          <h1 className="text-center">ALL USERS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;
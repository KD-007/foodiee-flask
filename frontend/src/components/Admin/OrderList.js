import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
import { deleteOrder, getAllOrders, clearErrors } from "../../redux/actions/orderActions";
import { notify } from "../../utils/Notification";

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const { error, orders } = useSelector((state) => state.allOrdersReducer);

  const { error: deleteError, isDeleted } = useSelector((state) => state.editOrderReducer);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
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
      notify("success", "Order deleted successfully");
      navigate("/admin/orders");
      dispatch(clearErrors());
    }

    dispatch(getAllOrders());
    // eslint-disable-next-line
  }, [dispatch, error, deleteError, navigate, isDeleted]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.4,
    },

    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      minWidth: 270,
      flex: 0.5,
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
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteOrderHandler(params.getValue(params.id, "id"))
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

  orders &&
    orders.forEach((item) => {
      rows.push({
        id: item.id,
        itemsQty: item.orderItems.length,
        amount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <Fragment>
      <MetaData
        title={`ALL ORDERS - Admin Panel | Foodiee`}
      />

      <div className="row w-100">
        <SideBar />
        <div className="col-md-10 mt-5 pt-3">
          <h1 className="text-center">ALL ORDERS</h1>

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

export default OrderList;

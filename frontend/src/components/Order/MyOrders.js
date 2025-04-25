import React, { Fragment, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, myOrders } from "../../redux/actions/orderActions";
import Loader from "../layout/Loader/Loader";
import { Link , useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import LaunchIcon from "@mui/icons-material/Launch";
import { notify } from "../../utils/Notification";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, orders } = useSelector((state) => state.myordersReducer);
  const { user , isAuthenticated} = useSelector((state) => state.getUser);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 300, flex: 1 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 150,
      flex: 0.3,
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
          <Link to={`/order/${params.getValue(params.id, "id")}`}>
            <LaunchIcon />
          </Link>
        );
      },
    },
  ];
  const rows = [];

  orders &&
    orders.forEach((item, index) => {
      rows.push({
        itemsQty: item.orderItems.length,
        id: item.id,
        status: item.orderStatus,
        amount: item.totalPrice,
      });
    });

  useEffect(() => {

    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    dispatch(myOrders());
  }, [dispatch, error , navigate, isAuthenticated]);

  return (
    <Fragment>
      <MetaData title={`${user?.name} - Orders | Foodiee`} />

      {loading ? (
        <Loader />
      ) : (
        <div className="row my-5 py-5 w-100">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />

          <h5 className="text-center bg-dark text-light py-1" ><b>{user?.name}'s Orders</b></h5>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;

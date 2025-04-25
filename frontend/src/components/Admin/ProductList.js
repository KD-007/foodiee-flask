import React, { useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import { getProductsAdmin ,clearErrors , deleteProduct } from "../../redux/actions/ProductActions";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SideBar from "./Sidebar";
import { notify } from "../../utils/Notification";


const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const { error, products } = useSelector((state) => state.getProduct);

  const { error: deleteError, success } = useSelector((state) => state.ProductReducer);

  const deleteProductHandler = (id) => {
    dispatch(deleteProduct(id));
  };

  useEffect(()=>{
    dispatch(getProductsAdmin());
  },[])

  useEffect(() => {
    if (error) {

      notify("error" , error);
      dispatch(clearErrors());
    }

    if (deleteError) {

      notify("error" , deleteError);
      dispatch(clearErrors());
    }

    if (success) {

      notify("success" , "Product Deleted Successfully");
      navigate("/admin/products");
      dispatch(clearErrors());
      dispatch(getProductsAdmin());
    }
    

  }, [dispatch, error, deleteError, navigate, success]);

  const columns = [
    { field: "id", headerName: "Product ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      type: "number",
      minWidth: 150,
      flex: 0.3,
    },

    {
      field: "price",
      headerName: "Price",
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
          <>
            <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
              <EditIcon />
            </Link>

            <Button
              onClick={() =>
                deleteProductHandler(params.getValue(params.id, "id"))
              }
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [];

  products &&
    products.forEach((item) => {
      rows.push({
        id: item.id,
        stock: item.Stock,
        price: item.price,
        name: item.name,
      });
    });

  return (
    <>
      <MetaData title={`ALL PRODUCTS - Admin | Foodiee`} />

      <div className="row w-100">
        <SideBar />
        <div className="col-md-10 mt-5 pt-3">
          <h1 className="text-center">ALL PRODUCTS</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick

            autoHeight
          />
        </div>
      </div>
    </>
  );
};

export default ProductList;

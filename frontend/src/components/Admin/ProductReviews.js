import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllReviews,
  deleteReviews,
} from "../../redux/actions/ProductActions";
import { Button } from "@mui/material";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@mui/icons-material/Delete";
import Star from "@mui/icons-material/Star";
import SideBar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/Notification";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.reviewReducer
  );

  const { error, reviews, loading } = useSelector(
    (state) => state.allReviewReducer
  );

  const [productId, setProductId] = useState("");

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReviews(reviewId, productId));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  useEffect(() => {
    if (productId.length >10) {
      dispatch(getAllReviews(productId));
    }
    if (error) {
      notify("error", error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      notify("error", deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      notify("success", "review deleted Successfully");
      dispatch(clearErrors());
      dispatch(getAllReviews(productId));
    }
  }, [dispatch, error, deleteError, navigate, isDeleted, productId]);

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "user",
      headerName: "User",
      minWidth: 200,
      flex: 0.6,
    },

    {
      field: "comment",
      headerName: "Comment",
      minWidth: 350,
      flex: 1,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 180,
      flex: 0.4,

      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
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
            <Button
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
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

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item.id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL REVIEWS - Admin | Foodiee`} />

      <div className="row w-100">
        <SideBar />
        <div className="col-md-10 mt-5 pt-3">
        <div className="row justify-content-center mb-5 ">
          <div className="col-md-6">
          <form
            onSubmit={productReviewsSubmitHandler}
          >
            <h1 className="text-center">ALL REVIEWS</h1>

            <div className="input-group mb-3">
                    <div className="input-group-prepend px-2">
                          <Star />
                    </div>
              
              <input
                className="form-control"
                type="text"
                placeholder="Product Id"
                required
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
              />
            </div>

            <Button
              className="btn bg-warning text-light w-100"
              type="submit"
              disabled={
                loading ? true : false || productId === "" ? true : false
              }
            >
              Search
            </Button>
          </form>
          </div>
          </div>

          {reviews && reviews.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
            />
          ) : (
            <h5 className="text-center py-5">No Reviews Found</h5>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;

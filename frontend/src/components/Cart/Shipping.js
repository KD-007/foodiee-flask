import React, { useState } from "react";
import { Country, State } from "country-state-city";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../utils/Notification";
import { saveShippingInfo } from "../../redux/actions/cartActions";
import { useNavigate } from "react-router-dom";
import MetaData from "../layout/MetaData";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import PublicIcon from "@mui/icons-material/Public";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import CheckoutSteps from "./CheckoutSteps";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cartReducer);

  const [address, setAddress] = useState(shippingInfo?.address);
  const [city, setCity] = useState(shippingInfo?.city);
  const [state, setState] = useState(shippingInfo?.state);
  const [country, setCountry] = useState(shippingInfo?.country);
  const [pinCode, setPinCode] = useState(shippingInfo?.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo);

  const shippingSubmit = (e) => {
    e.preventDefault();

    if (phoneNo.length < 10 || phoneNo.length > 10) {
      notify("error", "Invalid phone number");
      return;
    }
    dispatch(
      saveShippingInfo({ address, city, state, country, pinCode, phoneNo })
    );
    navigate("/order/confirm");
  };

  return (
    <>
      <MetaData title="Shipping Details | Foodie" />

      <CheckoutSteps activeStep={0} />

      <div className="row w-100 ">
        <div className="container">
          {" "}
          <h2 className="text-center w-100 ">
            <ShoppingCartCheckoutIcon />
            Shipping Details
          </h2>
          <form
            
            encType="multipart/form-data"
            onSubmit={shippingSubmit}
          >


          <div className="input-group mb-3">
          <div className="input-group-prepend px-2">
          <HomeIcon />
          </div>
          <input type="text" 
          className="form-control" 
          placeholder="Address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend px-2">
          <LocationCityIcon />
          </div>
          <input type="text" 
          className="form-control" 
          placeholder="City"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend px-2">
          <PinDropIcon />
          </div>
          <input 
          className="form-control" 
          type="number"
          placeholder="Pin Code"
          required
          value={pinCode}
          onChange={(e) => setPinCode(e.target.value)}
          />
        </div>
        <div className="input-group mb-3">
          <div className="input-group-prepend px-2">
          <PhoneAndroidIcon />
          </div>
          <input 
          className="form-control" 
          type="number"
          placeholder="Phone Number"
          required
          value={phoneNo}
          onChange={(e) => setPhoneNo(e.target.value)}
          size="10"
          />
        </div>

        <div className="input-group mb-3">
          <div className="input-group-prepend px-2">
          <PublicIcon />
          </div>
          <select className="form-select"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option key={item.isoCode} value={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
        </div>


            {country && (
                      <div className="input-group mb-3">
                      <div className="input-group-prepend px-2">
                      <TransferWithinAStationIcon />
                      </div>
                

                <select className="form-select"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option key={item.isoCode} value={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <input className="btn btn-warning w-100 text-light"
              type="submit"
              value="Continue"
              disabled={state ? false : true}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Shipping;

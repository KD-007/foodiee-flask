import React from "react";
import { Button , Avatar } from "@material-ui/core";
const About = () => {
  const visitLinkedIn = () => {
    window.location = "https://www.linkedin.com/in/kuldeep-verma-7a640b244/";
  };
  return (
    <div className="row w-100 h-50">

      <div className="container mt-5 pt-5">
        <div className="d-block text-center">
        <h1>About Us</h1>

      <div>
        <div >
        <div className="row justify-content-center ">
          
          <Avatar
            style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
            src="https://media.licdn.com/dms/image/v2/D5603AQEfQvshyDc7aA/profile-displayphoto-shrink_800_800/B56ZSCaMtYGoAc-/0/1737354694937?e=1750896000&v=beta&t=LkNh_LCSRl5QJfxIAPRYUEK5zGjStnwNpddmYjxBKW0"
            alt="Founder"
          />
          </div>
         
          <b>Kuldeep Verma</b>
          <br />
          <Button onClick={visitLinkedIn} className="btn text-primary">
            Visit Linkedin
          </Button>
          <br />
          <span>
           This is a sample wesbite made by @KuldeepVerma.
    </span>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default About;

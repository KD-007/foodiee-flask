import React from "react";


const Footer = () => {
  return (
    <>
    <div className=" position absolute bottom-0 bg-black w-100 z-3" style={{ transform: `translate(0px, 250px)`}}>
    <footer class="py-3 my-4">
    <ul class="nav justify-content-center  pb-3 mb-3 ">
      <li class="nav-item "><a href="#" class="nav-link px-2 text-light ">Home</a></li>
      <li class="nav-item"><a href="https://www.linkedin.com/in/kuldeep-verma-7a640b244/" class="nav-link px-2 text-light">Linkedin</a></li>
      <li class="nav-item"><a href="https://github.com/KD-007" class="nav-link px-2 text-light">Github</a></li>
      <li class="nav-item"><a href="#" class="nav-link px-2 text-light">FAQs</a></li>
      <li class="nav-item"><a href="#" class="nav-link px-2 text-light">About</a></li>
    </ul>
    <div className="container border-bottom"></div>
    <p class="text-center text-light">© 2021 Foodiee, Inc</p>
  </footer>
    </div>
    
    </>
  );
};

export default Footer;

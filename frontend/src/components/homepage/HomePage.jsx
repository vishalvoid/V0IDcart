import React from "react";
import NavBar from "./NavBar";
import Slider from "./Slider";
import HomeSlider from "./Slider";
import "./HomePage.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";

const HomePage = () => {
  const product = {
    name: "Blue Tshirt",
    images: [
      {
        url: "https://images.unsplash.com/photo-1589310243389-96a5483213a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      },
    ],
    price: 1300,
    _id: "vishalkumsrsingh",
    rating: 2.5,
  };
  return (
    <>
      <MetaData title="V0IDcart | Homepage" />
      <NavBar />
      <HomeSlider />

      <h2 className="homeHeading">Featured Products</h2>
      <div className="container" id="container">
        <ProductCard product={product} />
        <ProductCard product={product} />
        <ProductCard product={product} />
        <ProductCard product={product} />
        <ProductCard product={product} />
        <ProductCard product={product} />
        <ProductCard product={product} />
        <ProductCard product={product} />
      </div>
    </>
  );
};

export default HomePage;

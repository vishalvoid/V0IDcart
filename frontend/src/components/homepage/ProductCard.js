import React from "react";
import { Link } from "react-router-dom";
import Rating from "react-rating-stars-component";

const ProductCard = ({ product }) => {
  const options = {
    value: product.rating,
    isHalf: true,
    edit: false,
    color: "rgba(20, 20, 20, 0.1)",
    activeColor: "rgb(255, 165, 0)",
    size: window.innerwidth < 600 ? 15 : 20,
  };
  return (
    <Link className="productCard" to={product._id}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <Rating {...options} />
        <span className="productCardSpan"> (255 Reviews)</span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import React from "react";
import img1 from "../../assets/cart.jpg";
import img2 from "../../assets/fashion.jpg";
import img3 from "../../assets/secure.jpg";
import img4 from "../../assets/trust.jpg";
import img5 from "../../assets/watch.jpg";
import img6 from "../../assets/fashion2.jpg";
import "./slider.css";

const HomeSlider = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
  };
  return (
    <div className="slider">
      <Slider {...settings}>
        <div className="slider-items">
          <div className="title">
            <h1>A Fresh Aproach to Shopping</h1>
            <p>
              Embrace a breath of innovation as shopping evolves, where virtual
              showrooms <br /> and personalized AI assistants redefine the
              retail experience, crafting a <br /> harmonious blend of
              convenience and tailored style.
            </p>
          </div>
          <img src={img1} alt="slideshow" />
        </div>
        <div className="slider-items">
          <div className="title2">
            <h1>ABSOLUTELY, POSITIVELY, PERFECT</h1>
          </div>
          <img src={img2} alt="slideshow" />
        </div>
        <div className="slider-items">
          <div className="title">
            <h1>
              Shop fearlessly with our secure payment, empowering you with a
              shield of trust
            </h1>
            <p className="title__2-paragraph">
              We never store yout card details with us. your payment credentials
              are fully secure.
            </p>
          </div>
          <img src={img3} alt="slideshow" />
        </div>
        <div className="slider-items">
          <div className="title">
            <h1>A Promiss made, Must be a promiss kept</h1>
            <p>
              we make and stand by our promiss to keep your data safe. and we
              mean by it. <br /> no matter anyhing happens we won't let your
              data roam here and there.
            </p>
          </div>
          <img src={img4} alt="slideshow" />
        </div>
        <div className="slider-items">
          <div className="title">
            <h1>Quality is a Pride of workmenship</h1>
            <p>by W. Edwards Demmin</p>
          </div>
          <img src={img5} alt="slideshow" />
        </div>
        <div className="slider-items">
          <div className="title">
            <h1>Title to show here</h1>
            <p>Paragraph to show here</p>
          </div>
          <img src={img6} alt="slideshow" />
        </div>
      </Slider>
    </div>
  );
};

export default HomeSlider;

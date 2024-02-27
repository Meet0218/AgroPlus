import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { FaHeart } from "react-icons/fa";
import API_URL from "../constants";
import categories from "./CategoriesList";
import "./styles/home.css";
import "./styles/header.css";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home() {
  const navigate = useNavigate();
  const [liked1, setLiked] = useState(false);
  const [products, setproducts] = useState([]);
  const [cproducts, setcproducts] = useState([]);
  const [search, setsearch] = useState("");
  const [issearch, setissearch] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
    }
  }, [])

  const getProduct = () => {
    const url = API_URL + "/get-products";
    axios
      .get(url)
      .then((res) => {
        if (res.data.products) {
          setproducts(res.data.products);
        }
      })
      .catch((err) => {
        alert("Server Err.");
      });
  };

  const getItem = async (Item) => {
    const res = await axios.get(`${API_URL}/get-item/${Item}`);
    setproducts(res.data);
  };

  useEffect(() => {
    getProduct();
  }, []);

  const handlesearch = (value) => {
    setsearch(value);
  };

  const handleClick = () => {
    const url =
      API_URL +
      "/search?search=" +
      search;
    // "&loc=" +
    // localStorage.getItem("userLoc");
    axios
      .get(url)
      .then((res) => {
        setcproducts(res.data.products);
        setissearch(true);
      })
      .catch((err) => {
        alert("Server Err.");
      });
  };

  const handleCategory = (value) => {
    let filteredProducts = products.filter((item, index) => {
      if (item.category == value) {
        return item;
      }
    });
    setcproducts(filteredProducts);
  };

  const handleLike = (productId, e) => {
    e.stopPropagation();
    let userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please Login first.");
      return;
    }

    const url = API_URL + "/like-product";
    const data = { userId, productId };
    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message) {
          toast("Product Liked", {
            position: "top-center",
            autoClose: 1500,
          });
          setLiked(false);
        }
      })
      .catch((err) => {
        toast.error("Product Liked", {
          position: "top-center",
        });
        setLiked(true);
      });
  };

  const handleProduct = (id) => {
    navigate("/product/" + id);
  };
  const btnClicked = () => {
    navigate("/add-product")
  }
  return (
    <div>
      <Header
        search={search}
        handlesearch={handlesearch}
        handleClick={handleClick}
      />
      <div className="cat-container">
        <div>
          <span className="pr-3" onClick={getProduct}>
            All Categories
          </span>
          {categories &&
            categories.length > 0 &&
            categories.map((item, index) => {
              return (
                <span
                  onClick={() => getItem(item)}
                  key={index}
                  className="category"
                >
                  {" "}
                  {item}{" "}
                </span>
              );
            })}
        </div>
      </div>
      {issearch && cproducts && (
        <h5>
          {" "}
          SEARCH RESULTS
          <button className="clear-btn" onClick={() => setissearch(false)}>
            {" "}
            CLEAR{" "}
          </button>
        </h5>
      )}

      {issearch && cproducts && cproducts.length == 0 && (
        <h5> No Results Found </h5>
      )}
      {issearch && (
        <div className="d-flex justify-content-center flex-wrap">
          {cproducts &&
            products.length > 0 &&
            cproducts.map((item, index) => {
              return (
                <div key={item._id} className="card m-3 ">
                  <div
                    onClick={() => handleLike(item._id)}
                    className="icon-con"
                  >
                    <FaHeart className="icons" />

                  </div>
                  <img
                    width="300px"
                    height="200px"
                    src={API_URL + "/" + item.images[0]}
                    alt={item.pname}
                  />

                  <p className="m-2">
                    {" "}
                    {item.pname} | {item.category}{" "}
                  </p>
                  <h3 className="m-2 text-danger"> {item.price} </h3>
                  <p className="m-2 text-success"> {item.pdesc} </p>
                </div>
              );
            })}
        </div>
      )}

      {!issearch && (
        <div className="d-flex justify-content-center flex-wrap">
          {products &&
            products.length > 0 &&
            products.map((item, index) => {
              return (
                <div
                  onClick={() => handleProduct(item._id)}
                  key={item._id}
                  className="card m-3 position-relative"
                >
                  <div
                    onClick={(e) => handleLike(item._id, e)}
                    className="icon-con"
                  >
                    <FaHeart className={`icons ${liked1 ? 'liked' : ''}`} />
                  </div>
                  <img
                    width="250px"
                    height="150px"
                    src={API_URL + "/" + item.images[0]}
                    alt={item.pname}
                  />
                  <h3 className="m-2 price-text"> Rs. {item.price}/- </h3>
                  <p className="m-2">
                    {" "}
                    {item.pname} | {item.category}{" "}
                  </p>
                  <p className="m-2 text-success"> {item.pdesc} </p>
                </div>
              );
            })}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Home;

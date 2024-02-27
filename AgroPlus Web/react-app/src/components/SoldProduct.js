import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import "./styles/home.css";
import API_URL from "../constants";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SelledProduct = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categorizedProducts, setCategorizedProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = API_URL + "/get-selled-products";
        const data = { userId: localStorage.getItem("userId") };
        console.log(data);
        const response = await axios.get(`${API_URL}/get-selled-products`, data);
        console.log(response.data)
        if (response.data) {
          setProducts(response.data.products);
        }
      } catch (error) {
        alert("Server Err.");
      }
    };
    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleProduct = (id) => {
    navigate("/product/" + id);
  };

  const handleClick = () => {
    const filteredProducts = products.filter(
      (item) =>
        item.pname.toLowerCase().includes(search.toLowerCase()) ||
        item.pdesc.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );
    setCategorizedProducts(filteredProducts);
  };

  const handleCategory = (value) => {
    const filteredProducts = products.filter((item) => item.category === value);
    setCategorizedProducts(filteredProducts);
  };

  return (
    <div>
      <Header
        search={search}
        handleSearch={handleSearch}
        handleClick={handleClick}
      />
      <Categories handleCategory={handleCategory} />

      <div className="d-flex justify-content-center flex-wrap">
        {categorizedProducts.length > 0 &&
          categorizedProducts.map((item) => (
            <div key={item._id} className="card m-3">
              <img
                width="300px"
                height="200px"
                src={API_URL + "/" + item.pimage1}
                alt={item.pname}
              />
              <p className="m-2">
                {item.pname} | {item.category}
              </p>
              <h3 className="m-2 text-danger">{item.price}</h3>
              <p className="m-2 text-success">{item.pdesc}</p>
            </div>
          ))}
      </div>

      <h5> ALL RESULTS </h5>

      <div className="d-flex justify-content-center flex-wrap">
        {products.length > 0 &&
          products.map((item) => (
            <div>
              <div key={item._id} className="card m-3">
                <img
                  onClick={() => handleProduct(item._id)}
                  width="300px"
                  height="200px"
                  src={API_URL + "/" + item.images[0]}
                  alt={item.pname}
                />
                <p className="m-2">
                  {item.pname} | {item.category}
                </p>
                <h3 className="m-2 text-danger">{item.price}</h3>
                <p className="m-2 text-success">{item.pdesc}</p>
              </div>
            </div>
          ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default SelledProduct;

import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { FaHeart } from "react-icons/fa";
import "./styles/home.css";
import API_URL from "../constants";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MyProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categorizedProducts, setCategorizedProducts] = useState([]);
  const [search, setSearch] = useState("");
  const fetchData = async () => {
    try {
      const url = API_URL + "/my-products";
      const data = { userId: localStorage.getItem("userId") };
      const response = await axios.post(url, data);
      if (response.data.products) {
        setProducts(response.data.products);
      }
    } catch (error) {
      alert("Server Err.");
    }
  };

  useEffect(() => {

    fetchData();
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
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

  const handleLike = async (productId) => {
    const userId = localStorage.getItem("userId");

    try {
      const url = API_URL + "/like-product";
      const data = { userId, productId };
      const response = await axios.post(url, data);
      if (response.data.message) {
        toast.dark("Image  Liked successfully!", {
          position: "top-center",
        });
      }
    } catch (error) {
      alert("Server Err.");
    }
  };

  const handleProduct = (id) => {
    navigate("/product/" + id);
  };

  const modifyProduct = (id) => {
    navigate("/update-products/" + id);
  };

  const removeProduct = async (id) => {
    try {
      const res = await axios.delete(`${API_URL}/delete-product/${id}`);
      console.log(res.data.product)

      const new1 = await axios.post(`${API_URL}/selled-product`, res.data.product)
      console.log(new1);

      toast.success("Product Selled!", {
        position: "top-right",
        autoClose: 1500,
        onClose: () => {
          fetchData();
        }
      },);

    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.dark("Product Not Found!", {
          position: "top-right",
        });
      } else {
        toast.dark("Error in Delete Product !", {
          position: "top-right",
        });
      }
    }
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
              <div onClick={() => handleLike(item._id)} className="icon-con">
                <FaHeart className="icons" />
              </div>
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
              <button onClick={() => removeProduct(item._id)}>Delete</button>
            </div>
          ))}
      </div>

      <h5> ALL RESULTS </h5>

      <div className="d-flex justify-content-center flex-wrap">
        {products.length > 0 &&
          products.map((item) => (
            <div>
              <div key={item._id} className="card m-3">
                <div onClick={() => handleLike(item._id)} className="icon-con">
                  <FaHeart className="icons" />
                </div>
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
                <button onClick={() => removeProduct(item._id)}>Delete</button>
              </div>
              <div>
                <button onClick={() => modifyProduct(item._id)}>Update</button>
              </div>
            </div>
          ))}
      </div>
      <ToastContainer />
    </div>
  );
};

export default MyProducts;

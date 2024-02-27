import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../constants";
import CategoriesList from "./CategoriesList";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProduct = () => {
  const [data, setData] = useState({
    product: {
      pname: "",
      pdesc: "",
      price: "",
      category: "",
      images: [],
    },
  });

  const { id } = useParams();
  const [limit, setLimit] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [length1, setLength1] = useState();
  const [pimages, setpimages] = useState([]);
  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/get-product/${id}`);
      setData(res.data);
      setLength1(res.data.product.images.length);
      
      if (res.data.product.images.length < 6) {
        setLimit(true);
      } else {
        alert("You have already uploaded 5 images");
        setLimit(false);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  useEffect(() => {
   
    
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      product: {
        ...prevData.product,
        [name]: value,
      },
    }));
  };

  const handleClick = async () => {
    const formData = new FormData();
    formData.append("pname", data.product.pname);
    formData.append("pdesc", data.product.pdesc);
    formData.append("price", data.product.price);
    formData.append("category", data.product.category);
    pimages.forEach((image, index) => {
      formData.append(`pimage[${index + 1}]`, image);
    });
    try {
      const res = await axios.patch(`${API_URL}/edit-product/${id}`, formData);
      toast.success("Item Updated successfully!", {
        position: "top-center"
      });
      if(res.data) {
       
        fetchData(); 
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;

    if (files.length <= 5-length1) {
      setSelectedFiles(Array.from(files));
    } else {
      alert(`You can only select up to ${5-length1} files.`);
      event.target.value = null;
    }

    const files1 = Array.from(event.target.files);
    setpimages(files1);
  };

  const handleDelete = async (id, index) => {
    try {
      const res = await axios.patch(`${API_URL}/edit-image/${index}/${id}`);
      toast.success("Image Deleted  successfully!", {
        position: "top-center"
      });
        fetchData(); 
      
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div>
      <h2>UPDATE PRODUCT:</h2>
      {data.product && (
        <>
          <label>Product Name</label>
          <input
            className="form-control"
            type="text"
            name="pname"
            value={data.product.pname}
            onChange={handleChange}
          />
          <label>Product Description</label>
          <input
            className="form-control"
            type="text"
            name="pdesc"
            value={data.product.pdesc}
            onChange={handleChange}
          />
          <label>Product Price</label>
          <input
            className="form-control"
            type="text"
            name="price"
            value={data.product.price}
            onChange={handleChange}
          />
          <label>Product Category</label>
          <select
            className="form-control"
            name="category"
            value={data.product.category}
            onChange={handleChange}
          >
            {CategoriesList.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>

          {limit && (
            <div>
              <label>Product Image   <span>** select only {5-length1}</span></label>
              <input
                className="form-control"
                accept="image/*"
                type="file"
                multiple
                onChange={handleFileChange}
              />
            </div>
          )}

          <label>Existing Images</label>
          <br />
          {data.product.images.map((item, index) => (
            <div key={index}>
              <img
                src={`http://localhost:4000/${item}`}
                alt={`Image ${index}`}
              />
              <button onClick={() => handleDelete(id, index)}>
                Delete Image
              </button>
            </div>
          ))}
          <br />
          <ToastContainer/>
          <button onClick={handleClick} className="btn btn-primary mt-3">
            SUBMIT
          </button>
        </>
      )}
    </div>
  );
};

export default UpdateProduct;

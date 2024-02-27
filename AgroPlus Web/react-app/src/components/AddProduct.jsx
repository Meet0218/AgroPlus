import React, { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import categories from "./CategoriesList";
import API_URL from "../constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddProduct() {
    const navigate = useNavigate();
    const [pname, setPname] = useState('');
    const [pdesc, setPdesc] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [pimages, setPimages] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            toast.error("Please Login", {
                position: "top-center"
            });
        }
    }, [navigate]);

    const handleApi = (e) => {
        e.preventDefault();
        navigator.geolocation.getCurrentPosition((position) => {
            const formData = new FormData();
            formData.append('plat', position.coords.latitude);
            formData.append('plong', position.coords.longitude);
            formData.append('pname', pname);
            formData.append('pdesc', pdesc);
            formData.append('price', price);
            formData.append('category', category);
            pimages.forEach((image, index) => {
                formData.append(`pimage[${index + 1}]`, image);
            });
            formData.append('userId', localStorage.getItem('userId'));

            const url = API_URL + '/add-product';
            axios.post(url, formData)
                .then((res) => {
                    toast.success("Product Added Successfully! ", {
                        position: "top-center",
                        autoClose: 1000,
                        onClose: () => {
                            navigate('/');
                        }
                    });
                })
                .catch((err) => {
                    toast.error('Server Error');
                });
        });
    };

    return (
        <div>
            <Header />
            <div className="p-3">
                <h2> ADD PRODUCT HERE : </h2>
                <form onSubmit={handleApi}>
                    <label> Product Name </label>
                    <input className="form-control" type="text" required title="Enter valid name " value={pname}
                        onChange={(e) => {  setPname(e.target.value) }} />
                    <label> Product Description </label>
                    <input className="form-control" type="text" required  value={pdesc}
                        onChange={(e) => { setPdesc(e.target.value) }} />
                    <label> Product Price</label>
                    <input className="form-control" type="number" title="enter product price " required  value={price}
                        onChange={(e) => { setPrice(e.target.value) }} />
                    <label> Product Category </label>
                    <select className="form-control" value={category} required
                        onChange={(e) => { setCategory(e.target.value) }}>
                        <option> Bikes </option>
                        <option> Mobiles </option>
                        <option> Cloth </option>
                        {categories && categories.length > 0 &&
                            categories.map((item, index) => {
                                return (
                                    <option key={'option' + index}> {item} </option>
                                )
                            })
                        }
                    </select>
                    <label> Product Image(s) </label>
                    <input className="form-control" type="file" multiple required
                        onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setPimages(files);
                        }} />
                    <button className="btn btn-primary mt-3"> SUBMIT </button>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}

export default AddProduct;

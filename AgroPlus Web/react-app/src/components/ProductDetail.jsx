import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import API_URL from "../constants";
import io from "socket.io-client";
let socket;

function ProductDetail() {
  const [product, setProduct] = useState();
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [user, setUser] = useState();
  const { productId } = useParams();

  useEffect(() => {
    socket = io(API_URL);

    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    return () => {
      socket.disconnect();
      console.log("Disconnected from socket");
    };
  }, []);

  useEffect(() => {
    socket.on("getMsg", (data) => {
      const filteredData = data.filter((item) => {
        return item.productId === productId;
      });
      setMsgs(filteredData);
    });
  }, [productId]);

  const handleSend = () => {
    if (!socket) {
      console.error("Socket is not initialized.");
      return;
    }

    const data = {
      username: localStorage.getItem("userName"),
      msg,
      productId: localStorage.getItem("productId"),
    };

    console.log("Sending message:", data);
    socket.emit("sendMsg", data);
    setMsg("");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `${API_URL}/get-product/${productId}`;
        const response = await axios.get(url);
        const { product } = response.data;
        if (product) {
          setProduct(product);
          localStorage.setItem("productId", product._id);
          console.log("Product images:", product.images);
        }
      } catch (error) {
        alert("Server error occurred.");
      }
    };

    fetchData();
  }, [productId]);

  const handleContact = (addedBy) => {
    const url = `${API_URL}/get-user/${addedBy}`;
    axios
      .get(url)
      .then((res) => {
        const userData = res.data.user;
        if (userData) {
          setUser(userData);
        }
      })
      .catch((err) => {
        alert("Server error occurred.");
      });
  };

  return (
    <>
      <Header />
      <h2>PRODUCT DETAILS:</h2>
      <div>
        {product && (
          <div className="d-flex justify-content-between flex-wrap">
            <div>
              {product.images.map((item, index) => (
                <img
                  key={index}
                  width="400px"
                  height="200px"
                  src={`${API_URL}/${item}`}
                  alt={`Product Image ${index}`}
                />
              ))}
              <h3 className="m-2 price-text">Rs. {product.price} /-</h3>
              <p className="m-2">
                {product.pname} | {product.category}
              </p>
              <p className="m-2 text-success">{product.pdesc}</p>
              {product.addedBy && (
                <button onClick={() => handleContact(product.addedBy)}>
                  SHOW CONTACT DETAILS
                </button>
              )}
              {user && user.username && <h4>{user.username}</h4>}
              {user && user.mobile && <h3>{user.mobile}</h3>}
              {user && user.email && <h6>{user.email}</h6>}
            </div>
            <div>
              <h3>CHATS</h3>
              {msgs.map((item, index) => (
                <p
                  key={index}
                  style={{
                    color: item.username === localStorage.getItem("userName") ? "#61dafb" : "#282c34",
                    margin: "5px",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {item.username} : {item.msg}
                </p>
              ))}
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="form-control"
                type="text"
                placeholder="Type your message..."
              />
              <button onClick={handleSend} className="btn btn-primary">
                SEND
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProductDetail;

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './styles/market_price.css';

const MarketPrice = () => {
    const [data, setData] = useState([]);
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');
    const [district, setDistrict] = useState('');

    function handleChange(e) {
        // console.log(`Option selected: ${e.target.value}`);
        setValue(e.target.value);
    }


    // Get Data from user through select and option
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&filters%5Bstate%5D=Gujarat&filters%5Bdistrict%5D=" + value);
            const data1 = response.data.records;
            setData(data1);
            setDate(data1[0].arrival_date);
            setDistrict(data1[0].market)

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <select onChange={handleChange} value={value}>
                    <option value="" disabled>Select a Market</option>
                    <option value="Rajkot">Rajkot</option>
                    <option value="Amreli">Amreli</option>
                    <option value="Dahod">Dahod</option>
                    <option value="Jamnagar">Jamnagar</option>
                </select>

                <button type='submit'>Submit</button>
            </form>

            <h1>{date ? district : ""}</h1>
            <h1>{date}</h1>
            <h1>{date ? "20kg" : ""}</h1>
            {date ? (<table>
                <thead>
                    <tr>
                        <th>Commodity</th>
                        <th>Min Price</th>
                        <th>Max Price</th>
                        <th>Modal Price</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map(item => (
                        <tr key={item.commodity}>
                            <td>{item.commodity}</td>
                            <td>{item.min_price / 5}</td>
                            <td>{item.max_price / 5}</td>
                            <td>{item.modal_price / 5}</td>
                        </tr>
                    ))}
                </tbody>
            </table>) : null}

        </div>
    );
};

export default MarketPrice;

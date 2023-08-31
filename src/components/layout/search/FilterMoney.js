import {useState} from "react";

export default function FilterMoney () {
    const [minAmount, setMinAmount] = useState(0);
    const [maxAmount, setMaxAmount] = useState(100);
    const [data, setData] = useState([
        { id: 1, amount: 50 },
        { id: 2, amount: 80 },
        { id: 3, amount: 120 },
        { id: 4, amount: 30 },
        // ...Thêm dữ liệu khác
    ]);

    const handleMinChange = (event) => {
        const newMin = parseInt(event.target.value);
        setMinAmount(newMin);
        if (newMin > maxAmount) {
            setMaxAmount(newMin);
        }
    };

    const handleMaxChange = (event) => {
        const newMax = parseInt(event.target.value);
        setMaxAmount(newMax);
        if (newMax < minAmount) {
            setMinAmount(newMax);
        }
    };

    const handleSliderChange = (event) => {
        const value = parseInt(event.target.value);
        if (value <= minAmount) {
            setMinAmount(value);
        } else {
            setMaxAmount(value);
        }
    };

    const handleSetMin = () => {
        setMinAmount(0);
    };

    const handleSetMax = () => {
        setMaxAmount(100);
    };

    // Lọc dữ liệu theo khoảng từ minAmount đến maxAmount
    const filteredData = data.filter(item => item.amount >= minAmount && item.amount <= maxAmount);

    return (
        <div className="App">
            <div>
                <label>Min Amount:</label>
                <input type="number" value={minAmount} onChange={handleMinChange} />
                <button onClick={handleSetMin}>Set Min</button>
            </div>
            <div>
                <label>Max Amount:</label>
                <input type="number" value={maxAmount} onChange={handleMaxChange} />
                <button onClick={handleSetMax}>Set Max</button>
            </div>
            <div>
                <input
                    type="range"
                    min={minAmount}
                    max={maxAmount}
                    value={maxAmount}
                    onChange={handleSliderChange}
                />
            </div>
            <div>
                <h2>Filtered Data:</h2>
                <ul>
                    {filteredData.map(item => (
                        <li key={item.id}>ID: {item.id}, Amount: {item.amount}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
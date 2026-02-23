import { useEffect, useState } from "react";
import axios from "axios";
import "./inventory.css";

function Inventory() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/inventory", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    .then(res => setData(res.data))
    .catch(err => console.log(err));
  }, []);

return (
  <div className="inventory-container">
    <h2 className="inventory-title">📦 Inventory Overview</h2>

    <div className="inventory-table-wrapper">
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Base</th>
            <th>Location</th>
            <th>Equipment</th>
            <th>Type</th>
            <th>Quantity</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.base.name}</td>
              <td>{item.base.location}</td>
              <td>{item.equipment.name}</td>
              <td>{item.equipment.type}</td>
              <td>
                <span
                  className={
                    item.quantity < 20
                      ? "low-stock"
                      : "normal-stock"
                  }
                >
                  {item.quantity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default Inventory;
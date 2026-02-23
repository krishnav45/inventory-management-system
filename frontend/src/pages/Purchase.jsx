import { useEffect, useState } from "react";
import axios from "axios";
import "./Purchase.css";

function Purchase() {
  const [bases, setBases] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [purchases, setPurchases] = useState([]);

  const [formData, setFormData] = useState({
    baseId: "",
    equipmentId: "",
    quantity: ""
  });

  const token = localStorage.getItem("token");

  // =========================
  // Fetch Initial Data
  // =========================
  useEffect(() => {
    fetchBases();
    fetchEquipment();
    fetchPurchases();
  }, []);

  const fetchBases = async () => {
    const res = await axios.get("http://localhost:5000/api/bases", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBases(res.data);
  };

  const fetchEquipment = async () => {
    const res = await axios.get("http://localhost:5000/api/equipment", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEquipmentList(res.data);
  };

  const fetchPurchases = async () => {
    const res = await axios.get("http://localhost:5000/api/purchase", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPurchases(res.data);
  };

  // =========================
  // Handle Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/api/purchase",
        {
          baseId: Number(formData.baseId),
          equipmentId: Number(formData.equipmentId),
          quantity: Number(formData.quantity)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Purchase recorded successfully!");

      setFormData({ baseId: "", equipmentId: "", quantity: "" });
      fetchPurchases();

    } catch (error) {
      console.error(error);
      alert("Error recording purchase");
    }
  };

  return (
    <div className="purchase-container">
      <h2>📦 Purchase Management</h2>

      {/* ================= FORM ================= */}
      <form className="purchase-form" onSubmit={handleSubmit}>
        <select
          value={formData.baseId}
          onChange={(e) =>
            setFormData({ ...formData, baseId: e.target.value })
          }
          required
        >
          <option value="">Select Base</option>
          {bases.map((base) => (
            <option key={base.id} value={base.id}>
              {base.name}
            </option>
          ))}
        </select>

        <select
          value={formData.equipmentId}
          onChange={(e) =>
            setFormData({ ...formData, equipmentId: e.target.value })
          }
          required
        >
          <option value="">Select Equipment</option>
          {equipmentList.map((eq) => (
            <option key={eq.id} value={eq.id}>
              {eq.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          required
        />

        <button type="submit">Add Purchase</button>
      </form>

      {/* ================= TABLE ================= */}
      <div className="purchase-table-wrapper">
        <table className="purchase-table">
          <thead>
            <tr>
              <th>Base</th>
              <th>Equipment</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td>{p.base?.name || p.baseId}</td>
                <td>{p.equipment?.name || p.equipmentId}</td>
                <td>{p.quantity}</td>
                <td>{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Purchase;
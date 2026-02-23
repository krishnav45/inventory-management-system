import { useEffect, useState } from "react";
import axios from "axios";
import "./equipment.css";

function Equipment() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: ""
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 Fetch Data Function (Reusable)
  const fetchEquipment = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/equipment",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // 🔥 Summary
  const totalEquipment = data.length;

  const totalUnits = data.reduce(
    (acc, item) =>
      acc +
      (item.inventory?.reduce((a, inv) => a + inv.quantity, 0) || 0),
    0
  );

  // 🔥 Filter
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterType === "" || item.type === filterType)
  );

  const uniqueTypes = [...new Set(data.map((item) => item.type))];

  // 🔥 Open Edit Modal
  const handleEdit = (item) => {
    setEditData(item);
    setNewEquipment({
      name: item.name,
      type: item.type
    });
    setShowModal(true);
  };

  // 🔥 Save (Create + Update)
  const handleSaveEquipment = async () => {
    try {
      if (!newEquipment.name || !newEquipment.type) {
        alert("All fields required");
        return;
      }

      if (editData) {
        // UPDATE
        await axios.put(
          `http://localhost:5000/api/equipment/${editData.id}`,
          newEquipment,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      } else {
        // CREATE
        await axios.post(
          "http://localhost:5000/api/equipment",
          newEquipment,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
      }

      fetchEquipment();
      setShowModal(false);
      setEditData(null);
      setNewEquipment({ name: "", type: "" });

    } catch (error) {
      console.log(error);
    }
  };

  // 🔥 Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/equipment/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      fetchEquipment();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="equipment-container">
      <h2 className="equipment-title">🛠 Equipment Management</h2>

      {/* Summary Cards */}
      <div className="equipment-cards">
        <div className="card">
          <h4>Total Equipment</h4>
          <p>{totalEquipment}</p>
        </div>
        <div className="card">
          <h4>Total Units</h4>
          <p>{totalUnits}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="equipment-controls">
        <input
          type="text"
          placeholder="Search equipment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {uniqueTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        {user?.role === "ADMIN" && (
          <button
            className="add-btn"
            onClick={() => {
              setEditData(null);
              setNewEquipment({ name: "", type: "" });
              setShowModal(true);
            }}
          >
            + Add Equipment
          </button>
        )}
      </div>

      {/* Table */}
      <div className="equipment-table-wrapper">
        <table className="equipment-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Total Units</th>
              {user?.role === "ADMIN" && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>
                  {item.inventory?.reduce(
                    (acc, inv) => acc + inv.quantity,
                    0
                  ) || 0}
                </td>

                {user?.role === "ADMIN" && (
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editData ? "Edit Equipment" : "Add Equipment"}</h3>

            <input
              type="text"
              placeholder="Equipment Name"
              value={newEquipment.name}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Type"
              value={newEquipment.type}
              onChange={(e) =>
                setNewEquipment({ ...newEquipment, type: e.target.value })
              }
            />

            <div className="modal-buttons">
              <button onClick={handleSaveEquipment}>
                {editData ? "Update" : "Save"}
              </button>

              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Equipment;
import { useEffect, useState } from "react";
import api from "../api/axios";
import "./dashboard.css";

function Dashboard() {
  const [data, setData] = useState({
    openingBalance: 0,
    currentBalance: 0,
    netMovement: 0,
    historyCount: 0,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const opening = await api.get("/report/opening-balance");
        const balance = await api.get("/report/balance");
        const net = await api.get("/report/net-movement");
        const history = await api.get("/report/history");

        setData({
          openingBalance: opening.data.openingBalance || 0,
          currentBalance: balance.data.currentBalance || 0,
          netMovement: net.data.netMovement || 0,
          historyCount: history.data.length || 0,
        });
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>

      <div className="card-grid">
        <div className="card">
          <h3>Opening Balance</h3>
          <p>{data.openingBalance}</p>
        </div>

        <div className="card">
          <h3>Current Balance</h3>
          <p>{data.currentBalance}</p>
        </div>

        <div className="card">
          <h3>Net Movement</h3>
          <p>{data.netMovement}</p>
        </div>

        <div className="card">
          <h3>Total Movements</h3>
          <p>{data.historyCount}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
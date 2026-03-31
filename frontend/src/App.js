import axios from "axios";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const runtimeConfig = window.__APP_CONFIG__ || {};
const API_BASE_URL = runtimeConfig.API_BASE_URL || process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const apiUrl = (path) => `${API_BASE_URL}${path}`;

function App() {
  const [deployments, setDeployments] = useState([]);

  const loadDeployments = async () => {
    const res = await axios.get(apiUrl("/deployments"));
    setDeployments(res.data);
  };

  useEffect(() => {
    loadDeployments();
  }, []);

  const triggerDeploy = async () => {
    await axios.post(apiUrl("/deploy"));
    await loadDeployments();
  };

  const [logs, setLogs] = useState([]);
  const fetchLogs = async () => {
    const res = await axios.get(apiUrl("/logs"));
    setLogs(res.data);
  };

  const chartData = {
    labels: ["Manual Deployment", "CI/CD Deployment"],
    datasets: [
      {
        label: "Deployment Time (seconds)",
        data: [120, 30],
        backgroundColor: ["red", "green"]
      }
    ]
  };

  const [health, setHealth] = useState({});
  const checkHealth = async () => {
    const res = await axios.get(apiUrl("/health"));
    setHealth(res.data);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>DevOps Dashboard</h1>

      <button onClick={triggerDeploy}>
        Deploy localhost
      </button>

      <h2>Deployment History</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Time</th>
          </tr>
        </thead>

        <tbody>
          {deployments.map(d => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.status}</td>
              <td>{d.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Deployment Performance</h2>

      <Bar data={chartData} />

      <h2>Pipeline Logs</h2>

      <button onClick={fetchLogs}>Load Logs</button>

      <div style={{ background:"#111", color:"#0f0", padding:"10px", marginTop:"10px"}}>
        {logs.map((log,i) => (
          <p key={i}>{log}</p>
        ))}
      </div>

      <h2>Service Status</h2>

      <button onClick={checkHealth}>Check Status</button>

      <ul>
        <li>Backend: {health.backend}</li>
        <li>Database: {health.database}</li>
        <li>Frontend: {health.frontend}</li>
      </ul>
    </div>
  );
}

export default App;

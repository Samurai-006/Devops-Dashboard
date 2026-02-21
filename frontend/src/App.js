import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/deployments")
      .then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h1>DevOps Dashboard</h1>
      {data.map((d, i) => (
        <p key={i}>
          Status: {d.status} | Time: {d.time}
        </p>
      ))}
    </div>
  );
}

export default App;
import { useEffect, useState } from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "./App.css";

const matriceLength = 50;
function Tooltip({ row, id }) {
  return (
    <ReactTooltip id={id} className="text-lg">
      <div>
        <ul>
          <li>User: {row.user}</li>
          <li>Color: {row.color}</li>
        </ul>
      </div>
    </ReactTooltip>
  );
}

function App() {
  const [grid, setGrid] = useState([]);
  const [rowSelected, setRowSelected] = useState({});
  const [data, setData] = useState({ user: "", color: "" });

  useEffect(() => {
    const fetchGridData = async () => {
      fetch("http://localhost:8000")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setGrid(data);
        })
        .catch((err) => {
          console.log("api failed with error: ", err.message);
        });
    };
    fetchGridData();
  }, []);
  const onAdd = async (x, y) => {
    if (data.user && data.color) {
      const coordinates = `${x}-${y}`;
      fetch("http://localhost:8000", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          coordinates,
          pixel: data,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            setGrid((prev) => ({ ...prev, [coordinates]: data }));
            setData({ user: "", color: "" });
          }
        })
        .catch((err) => {
          console.log("api failed with error: ", err.message);
        });
    }
  };
  return (
    <div className="container">
      <div className="form">
        <div className="input">
          <label>User</label>
          <input
            onChange={(e) =>
              setData((prev) => ({ ...prev, user: e.target.value }))
            }
            value={data.user}
          />
        </div>
        <div className="input">
          <label>Color</label>
          <input
            onChange={(e) =>
              setData((prev) => ({ ...prev, color: e.target.value }))
            }
            value={data.color}
          />
        </div>
      </div>
      {Object.keys(grid).length ? (
        <table className=" shadow-md bg-gray-800">
          <thead></thead>
          <tbody className="">
            {[...Array(matriceLength)].map((r, i) => {
              return (
                <tr key={i} className="">
                  {[...Array(matriceLength)].map((c, j) => {
                    const item = grid[`${i + 1}-${j + 1}`];
                    return (
                      <td
                        data-tooltip-id={`matrice-${i}-${j}`}
                        onClick={() => onAdd(i + 1, j + 1)}
                        onMouseEnter={() => setRowSelected(item ? item : {})}
                        style={{
                          backgroundColor: grid[`${i + 1}-${j + 1}`]?.color,
                        }}
                        key={j}
                      >
                        <Tooltip id={`matrice-${i}-${j}`} row={rowSelected} />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default App;

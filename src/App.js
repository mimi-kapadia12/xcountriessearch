import "./App.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountires, setFilteredCountires] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Failed to fetch data: ${res.status} ${res.statusText}`
          );
        }
        return res.json();
      })
      .then((data) => {
        setCountries(data);
        setFilteredCountires(data);
        setError();
      })
      .catch((err) => {
        console.error("Error while fetching the data: ", err);
        setError(err); // Set error state for better tracking
      });
  }, []);

  useEffect(() => {
    if (searchText) {
      setFilteredCountires((prev) => {
        return countries.filter((c) =>
          c.name.common.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    } else {
      setFilteredCountires(countries);
    }
  }, [searchText]);

  return (
    <div className="App">
      <h1>Countries</h1>
      <div className="m-3 p-3">
        <input
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search for a country"
        />
      </div>
      {error && <p>Error: {error.message}</p>}
      {filteredCountires.length === 0 && !error ? (
        <p>Loading...</p>
      ) : (
        <div className="container">
          <div className="row">
            {filteredCountires.map((country) => (
              <div
                className="p-1 col-4 col-md-3 col-lg-2"
                key={country.name.common}
              >
                <div className="card">
                  <img
                    src={country.flags.png}
                    className="card-img-top"
                    alt={country.name.common}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{country.name.common}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

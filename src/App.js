import "./App.css";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => {
        if (!res.ok) {
          console.log(`Failed to fetch data: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        setCountries(data);
        setFilteredCountries(data);
        setError(null); // Clear error state on success
      })
      .catch((err) => {
        console.error("Error while fetching the data: ", err);
        setError(err);
      });
  }, []);

  useEffect(() => {
    if (searchText) {
      setFilteredCountries((prev) => {
        return countries.filter((c) =>
          c.name.common.toLowerCase().includes(searchText.toLowerCase())
        );
      });
    } else {
      setFilteredCountries(countries);
    }
  }, [searchText, countries]);

  return (
    <div className="App">
      <h1>Countries</h1>
      <div className="m-3 p-3">
        <input
          type="text"
          id="searchInput"
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search for a country"
        />
      </div>
      {error && <p>Error: {error.message}</p>}
      {filteredCountries.length === 0 && !error ? (
        <p>Loading...</p>
      ) : (
        <div className="container country-grid">
          <div className="row">
            {filteredCountries.map((country) => (
              <div
                className="p-1 col-6 col-md-4 col-lg-3"
                key={country.name.common}
              >
                <div className="countryCard">
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

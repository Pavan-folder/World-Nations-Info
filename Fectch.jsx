import React, { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoon,
  faSun,
  faMagnifyingGlass,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";

const Fetch = () => {
  const [data, setData] = useState([]);
  const [themeDark, setThemeDark] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [selectedCountryIndex, setSelectedCountryIndex] = useState(null);

  useEffect(() => {
    fetch("data.json")
      .then((res) => res.json())
      .then((countries) => {
        const shuffled = countries.sort(() => Math.random() - 0.5);
        setData(shuffled.slice(0, 300));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const toggleTheme = () => {
    setThemeDark((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const toggleRegionDropdown = () => {
    setShowRegionDropdown((prev) => !prev);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setShowRegionDropdown(false);
  };

  const filteredCountries = data
    .filter((country) =>
      selectedRegion ? country.region === selectedRegion : true
    )
    .filter((country) =>
      country.name.toLowerCase().includes(searchText.toLowerCase())
    );

  const regions = [...new Set(data.map((country) => country.region))];

  const fullCountry = (index) => {
    setSelectedCountryIndex(index);
  };

  const goBack = () => {
    setSelectedCountryIndex(null);
  };

  const displayedCountries =
    searchText.trim() !== "" || selectedRegion ? filteredCountries : data;

  return (
    <div>
      <header>
        <h4>Where in the world</h4>

        <button
          onClick={toggleTheme}
          style={{
            width: "60px",
            height: "40px",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: themeDark ? "white" : "black",
          }}
          aria-label="Toggle Theme"
        >
          <FontAwesomeIcon icon={themeDark ? faSun : faMoon} />
        </button>

        <div className="search-container">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="search"
            placeholder="Search for a country"
            className="search-input"
            value={searchText}
            onChange={handleSearch}
          />
        </div>

        <div style={{ position: "relative" }}>
          <button
            style={{
              width: "150px",
              height: "40px",
              cursor: "pointer",
              fontSize: "15px",
            }}
            onClick={toggleRegionDropdown}
          >
            Filter by Region{" "}
            <FontAwesomeIcon
              icon={showRegionDropdown ? faArrowUp : faArrowDown}
            />
          </button>

          {showRegionDropdown && (
            <div className="region-dropdown">
              {regions.map((region) => (
                <button key={region} onClick={() => handleRegionSelect(region)}>
                  {region}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedRegion && (
          <button
            onClick={() => setSelectedRegion("")}
            className="clear-region-btn"
          >
            Clear Region Filter
          </button>
        )}
      </header>

      <div className="grid-container">
        {selectedCountryIndex !== null ? (
          <div className="country-card full-screen" key={selectedCountryIndex}>
            <button className="back-button" onClick={goBack}>
              Back
            </button>
            {(() => {
              const country = displayedCountries[selectedCountryIndex];
              if (!country) return null;
              return (
                <>
                  <img
                    className="flag-img"
                    src={country.flags?.png || country.flags?.svg}
                    alt={country.name}
                  />
                  <div className="country-info">
                    <h3>{country.name}</h3>
                    <p>
                      <strong>Subregion:</strong> {country.subregion}
                    </p>
                    <p>
                      <strong>Area:</strong> {country.area?.toLocaleString()}{" "}
                      km²
                    </p>
                    <p>
                      <strong>Timezones:</strong>{" "}
                      {country.timezones?.join(", ") ?? "N/A"}
                    </p>
                    <p>
                      <strong>Borders:</strong>{" "}
                      {country.borders?.join(", ") || "None"}
                    </p>
                    <p>
                      <strong>Native Name:</strong> {country.nativeName}
                    </p>
                    <p>
                      <strong>Calling Codes:</strong> +
                      {country.callingCodes?.join(", +")}
                    </p>
                    <p>
                      <strong>Border Countries:</strong>
                      <ul>
                        {country.borders?.length > 0 ? (
                          country.borders.map((code, idx) => (
                            <li key={idx}>{code}</li>
                          ))
                        ) : (
                          <li>None</li>
                        )}
                      </ul>
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        ) : displayedCountries.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No countries found.
          </p>
        ) : (
          displayedCountries.map((country, index) => (
            <div
              className={`country-card item-${index + 1}`}
              key={index}
              onClick={() => fullCountry(index)}
            >
              <img
                className="flag-img"
                src={country.flags?.png || country.flags?.svg}
                alt={country.name}
              />
              <div className="country-info">
                <h3>{country.name}</h3>
                <p>
                  <strong>Subregion:</strong> {country.subregion}
                </p>
                <p>
                  <strong>Area:</strong>{" "}
                  {country.area?.toLocaleString() ?? "N/A"} km²
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Fetch;

import { useState } from "react";

interface Props {
  city: string;
  country: string;
  onCityChange: (city: string, country: string) => void;
}

const POPULAR_CITIES = [
  { city: "Karachi", country: "Pakistan" },
  { city: "Lahore", country: "Pakistan" },
  { city: "Islamabad", country: "Pakistan" },
  { city: "Makkah", country: "Saudi Arabia" },
  { city: "Madinah", country: "Saudi Arabia" },
  { city: "Dubai", country: "UAE" },
  { city: "London", country: "UK" },
  { city: "New York", country: "USA" },
  { city: "Toronto", country: "Canada" },
  { city: "Istanbul", country: "Turkey" },
];

export default function CitySelector({ city, country, onCityChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [customCity, setCustomCity] = useState("");
  const [customCountry, setCustomCountry] = useState("");

  const handleSelect = (c: string, co: string) => {
    onCityChange(c, co);
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim() && customCountry.trim()) {
      handleSelect(customCity.trim(), customCountry.trim());
      setCustomCity("");
      setCustomCountry("");
    }
  };

  return (
    <div className="city-selector">
      <button className="city-current" onClick={() => setIsOpen(!isOpen)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="city-icon">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" fill="currentColor"/>
        </svg>
        <span>{city}, {country}</span>
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className={`chevron ${isOpen ? "open" : ""}`}>
          <path d="M5 7L10 12L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {isOpen && (
        <div className="city-dropdown">
          <div className="city-list">
            {POPULAR_CITIES.map((c) => (
              <button
                key={`${c.city}-${c.country}`}
                className={`city-option ${c.city === city && c.country === country ? "active" : ""}`}
                onClick={() => handleSelect(c.city, c.country)}
              >
                {c.city}, {c.country}
              </button>
            ))}
          </div>
          <form className="city-custom" onSubmit={handleCustomSubmit}>
            <input
              type="text"
              placeholder="City"
              value={customCity}
              onChange={(e) => setCustomCity(e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              value={customCountry}
              onChange={(e) => setCustomCountry(e.target.value)}
            />
            <button type="submit" disabled={!customCity.trim() || !customCountry.trim()}>
              Set
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

export default function BookingForm({ className, buttonLabel = "Search for Cabs" }) {
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    pickupStreet: "",
    dropStreet: "",
    date: "",
    seats: "", // Change from number to string for dropdown selection
  });

  const [error, setError] = useState(""); // For validation errors
  const navigate = useNavigate(); // Initialize useNavigate

  const locations = ["Siliguri ", "Kolkata", "Gangtok", "Darjeeling"];
  const streets = ["Indiranagar", "Ullal", "Tin Factory"]; // Example streets for each location
  const seatOptions = ["Sedan", "Suv", "Mini-Vans"]; // New seat options

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for empty fields
    if (
      !formData.from ||
      !formData.to ||
      !formData.pickupStreet ||
      !formData.dropStreet ||
      !formData.date ||
      !formData.seats // Check if seats are selected
    ) {
      setError("All fields are required.");
      return;
    }

    // Check if 'From' and 'To' locations are the same
    if (formData.from === formData.to) {
      setError("From and To locations cannot be the same.");
      return;
    }

    // Check if date is valid
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of today
    if (selectedDate < today) {
      setError("Date cannot be in the past.");
      return;
    }

    setError(""); // Clear any previous errors
    if (buttonLabel === "Modify") {
      navigate("/"); // Navigate to the Index route
      return;
    }

    // Navigate to '/cabdetails' route on successful form submission
    navigate("/sharedcabs");

    console.log("Form submitted:", formData);
  };

  const today = new Date();
  const currentDate = today.toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto px-4" >
      <div className={`bg-white rounded-3xl shadow-lg p-8 md:p-10 -mt-24 relative z-10 ${className}`}>
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Bookings made easy
        </h2>
        {error && (
          <p className="text-red-600 text-center mb-4 font-semibold">{error}</p>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <select
            className="bg-gray-100 rounded-lg px-4 py-3 w-full"
            value={formData.from}
            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          >
            <option value="">Select From Location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            className="bg-gray-100 rounded-lg px-4 py-3 w-full"
            value={formData.pickupStreet}
            onChange={(e) =>
              setFormData({ ...formData, pickupStreet: e.target.value })
            }
          >
            <option value="">Select Pickup Point</option>
            {streets.map((street) => (
              <option key={street} value={street}>
                {street}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="bg-gray-100 rounded-lg px-4 py-3 w-full"
            value={formData.date} placeholder="Select Date"
            min={currentDate}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />

          <select
            className="bg-gray-100 rounded-lg px-4 py-3 w-full"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          >
            <option value="">Select To Location</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>

          <select
            className="bg-gray-100 rounded-lg px-4 py-3 w-full"
            value={formData.dropStreet}
            onChange={(e) =>
              setFormData({ ...formData, dropStreet: e.target.value })
            }
          >
            <option value="">Select Drop Point</option>
            {streets.map((street) => (
              <option key={street} value={street}>
                {street}
              </option>
            ))}
          </select>

          {/* Dropdown for selecting the number of seats */}
          <select
            className="bg-gray-100 rounded-lg px-4 py-3 w-full"
            value={formData.seats}
            onChange={(e) => setFormData({ ...formData, seats: e.target.value })}
          >
            <option value="">Preferred Vehicle Type</option>
            {seatOptions.map((seat) => (
              <option key={seat} value={seat}>
                {seat}
              </option>
            ))}
          </select>

          {/* Button Below in Center */}
          <div className="col-span-full text-center mt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-300 to-blue-400 text-white rounded-lg px-6 py-3 hover:bg-[#2a1b67] transition-colors"
            >
              {buttonLabel}
            </button>
          </div>
        </form>

        <p className="text-xl md:text-xl font-semibold text-center mt-8">
          Looking For Booking a Full Cab ? <Link to="/fullcars"><span className="text-blue-600">Click Here</span></Link>
        </p>
        {/* http://localhost:3000/fullcars */}
      </div>
    </div>
  );
}

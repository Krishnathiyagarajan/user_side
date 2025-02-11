import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import BookingForm from '../Home/bookingForm';
import SelectedCarDetails from './SelectedCarDetails';
import TripDetailsCard from '../Listpage/TripDetailsCard';
// import CabDetails from '../Home/CabDetails';
import axios from 'axios'

const SeatList = () => {
  const [seats, setSeats] = useState([
    { id: 'L1', isSelected: false, isDisabled: false, isBooked: false, price: 1200 },
    { id: 'R1', isSelected: false, isDisabled: true, isBooked: false, price: 1200 },
    { id: 'L2', isSelected: false, isDisabled: false, isBooked: false, price: 1200 },
    { id: 'R2', isSelected: false, isDisabled: false, isBooked: false, price: 1200 },
    { id: 'L3', isSelected: false, isDisabled: false, isBooked: true, price: 1200 },
    { id: 'R3', isSelected: false, isDisabled: false, isBooked: false, price: 1200 },
  ]);

  const [passengers, setPassengers] = useState({});
  const [mainPassenger, setMainPassenger] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null); // State for error message
  const navigate = useNavigate();



  const handlePayment = async () => {
    try {
      // Create an order on the backend
      const { data } = await axios.post("http://localhost:5000/api/payment/create-order", {
        amount: totalAmount * 100, // Amount in paise
      });

      // Initialize Razorpay
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "The Great Himalayas",
        description: "Test Transaction",
        order_id: data.id, // Razorpay Order ID
        handler: async function (response) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

          // Optionally, verify the payment on the backend

          // Navigate to the confirmed page after successful payment
          navigate('/confirmed', { state: { paymentId: response.razorpay_payment_id } });
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error in Razorpay payment:", error);
    }
  };

  const handleSeatClick = (id) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === id ? { ...seat, isSelected: !seat.isSelected } : seat
      )
    );

    setPassengers((prevPassengers) => {
      const updatedPassengers = { ...prevPassengers };
      if (updatedPassengers[id]) {
        delete updatedPassengers[id];
      } else {
        updatedPassengers[id] = { name: '', email: '', phone: '', isMain: false };
      }
      return updatedPassengers;
    });
  };

  const handleMainPassengerChange = (seatId) => {
    setMainPassenger((prevMain) => (prevMain === seatId ? null : seatId));
    setPassengers((prevPassengers) => {
      const updatedPassengers = { ...prevPassengers };
      Object.keys(updatedPassengers).forEach((id) => {
        updatedPassengers[id].isMain = id === seatId && seatId !== mainPassenger;
      });
      return updatedPassengers;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that a main passenger is selected
    if (!mainPassenger) {
      setError("There Should be an One Main Passenger ! Please Fill.");
      return;
    }

    setError(null); // Clear any previous error

    setShowModal(true); // Show the modal on form submission
  };

  const closeModal = () => {
    setShowModal(false);
    navigate('/Seats'); // Navigate to the Seats page
  };

  const selectedSeats = seats.filter((seat) => seat.isSelected);
  const totalAmount = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <>
      <div className="mx-auto flex flex-col lg:flex-row gap-8 p-4 w-full max-w-7xl">
      {/* First div */}
      <div className="w-full lg:w-2/3 bg-white shadow-md rounded-lg overflow-hidden">
        <SelectedCarDetails />
        <div className="p-4">
          <div className="w-full max-w-3xl mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-gray-50 p-4 md:p-8 shadow-lg rounded-lg">
              <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-900 mb-6">Passenger Details</h2>

              {/* Passenger Details Grid */}
              <div
                className={`grid gap-6 ${selectedSeats.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}
              >
                {Object.entries(passengers).map(([seatId, passenger], index) => (
                  <div key={seatId} className="bg-white p-4 md:p-6 rounded-md shadow-sm border space-y-4 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-800">Passenger for Seat {seatId}</h3>

                    {/* Passenger Name */}
                    <div>
                      <label htmlFor={`name-${seatId}`} className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        id={`name-${seatId}`}
                        value={passenger.name}
                        onChange={(e) =>
                          setPassengers((prev) => ({
                            ...prev,
                            [seatId]: { ...prev[seatId], name: e.target.value },
                          }))
                        }
                        required
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                      />
                    </div>

                    {/* Main Passenger Checkbox */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={mainPassenger === seatId}
                          onChange={() => handleMainPassengerChange(seatId)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">Set as Main Passenger</span>
                      </label>
                    </div>

                    {mainPassenger === seatId && (
                      <div className="space-y-4">
                        {/* Email and Phone in Flex */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          {/* Email */}
                          <div className="flex-1">
                            <label htmlFor={`email-${seatId}`} className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <input
                              type="email"
                              id={`email-${seatId}`}
                              value={passenger.email}
                              onChange={(e) =>
                                setPassengers((prev) => ({
                                  ...prev,
                                  [seatId]: { ...prev[seatId], email: e.target.value },
                                }))
                              }
                              required
                              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                            />
                          </div>

                          {/* Phone */}
                          <div className="flex-1">
                            <label htmlFor={`phone-${seatId}`} className="block text-sm font-medium text-gray-700">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id={`phone-${seatId}`}
                              value={passenger.phone}
                              onChange={(e) =>
                                setPassengers((prev) => ({
                                  ...prev,
                                  [seatId]: { ...prev[seatId], phone: e.target.value },
                                }))
                              }
                              required
                              className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gender Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        {["Male", "Female", "Other", "Prefer not to say"].map((gender) => (
                          <label key={gender} className="flex items-center">
                            <input
                              type="radio"
                              name={`gender-${seatId}`}
                              value={gender}
                              checked={passenger.gender === gender}
                              onChange={(e) =>
                                setPassengers((prev) => ({
                                  ...prev,
                                  [seatId]: { ...prev[seatId], gender: e.target.value },
                                }))
                              }
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">{gender}</span>
                          </label>
                        ))}
                      </div>
                      {passenger.gender === "Other" && (
                        <input
                          type="text"
                          placeholder="Enter your gender"
                          value={passenger.customGender || ""}
                          onChange={(e) =>
                            setPassengers((prev) => ({
                              ...prev,
                              [seatId]: { ...prev[seatId], customGender: e.target.value },
                            }))
                          }
                          className="mt-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                        />
                      )}
                    </div>

                    
                  </div>
                ))}
              </div>

              {/* Error Message */}
              {error && <div className="text-red-500 text-center mt-4">{error}</div>}

              {/* No Seats Selected Message */}
              {selectedSeats.length === 0 && (
                <div className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded-lg shadow-md mt-4">
                  <p className="font-semibold text-center text-lg mb-2">No seats selected!</p>
                  <p className="text-center text-sm mb-3">Please select seats for the trip before proceeding.</p>
                  <div  className="bg-white p-4 md:p-6 rounded-md shadow-sm border space-y-4 flex flex-col">
                    <h3 className="text-lg font-medium text-gray-800">Passenger for Seat </h3>

                    {/* Passenger Name */}
                    <div>
                      <label  className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        
                        disabled
                        className="mt-1 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
                      />
                    </div>
                    {/* Main Passenger Checkbox */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600" disabled
                        />
                        <span className="ml-2 text-sm text-gray-700">Set as Main Passenger</span>
                      </label>
                    </div>

                    {/* Gender Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gender</label>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        {["Male", "Female", "Other", "Prefer not to say"].map((gender) => (
                          <label  className="flex items-center">
                            <input
                              type="radio"
                              disabled
                              value={gender}
                              
                              className="form-radio h-4 w-4 text-blue-600"
                            />
                            <span className="ml-2 text-sm text-gray-700">{gender}</span>
                          </label>
                        ))}
                      </div>
                        
                    </div>

                    

                    
                      
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center mt-8">
                <button
                  type="submit"
                  disabled={selectedSeats.length === 0}
                  className={`px-6 py-3 text-sm font-medium rounded-md shadow ${
                    selectedSeats.length === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  }`}
                >
                  Book Seats
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Second div */}
      <div className="w-full lg:w-1/3 mt-8 lg:mt-0">
        <div className="w-full max-w-md mx-auto">
          <TripDetailsCard />
        </div>
        <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-8">
          <div className="bg-sky-100 px-4 py-2">
            <h2 className="text-lg font-semibold">Select Seats</h2>
          </div>
          <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
  {seats.map((seat) => (
    <div key={seat.id} className="flex flex-col items-center">
      <button
        onClick={() => !seat.isDisabled && !seat.isBooked && handleSeatClick(seat.id)}
        className={`h-12 w-12 rounded-md flex items-center justify-center text-lg font-semibold ${
          seat.isSelected
            ? "bg-blue-600 text-white"
            : seat.isBooked
              ? "bg-red-600 text-white"
              : "bg-white text-blue-600 border-2 border-blue-600"
        } ${
          seat.isDisabled || seat.isBooked
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-blue-100"
        }`}
        disabled={seat.isDisabled || seat.isBooked}
      >
        {seat.id}
      </button>
      {!seat.isBooked && !seat.isDisabled && (
        <span className="mt-2 text-sm text-gray-600">Rs. {seat.price}</span>
      )}
    </div>
  ))}
</div>

          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl p-4 sm:p-8 relative animate-fade-in overflow-y-auto max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 bg-gray-200 rounded-full p-2 shadow transition hover:scale-110"
            >
              &times;
            </button>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Booking Details</h3>

            {/* Main Passenger Details */}
            {mainPassenger && passengers[mainPassenger] && (
              <div className="bg-gray-100 p-4 rounded-md mb-6">
                <h4 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">Main Passenger Details</h4>
                <p className="text-gray-600">
                  <span className="font-semibold">Name:</span> {passengers[mainPassenger].name}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Gender:</span>{" "}
                  {passengers[mainPassenger].gender === "Other"
                    ? passengers[mainPassenger].customGender
                    : passengers[mainPassenger].gender}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Email:</span> {passengers[mainPassenger].email}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Phone:</span> {passengers[mainPassenger].phone}
                </p>
              </div>
            )}

            {/* Other Passengers Details */}
            {Object.entries(passengers)
              .filter(([seatId]) => seatId !== mainPassenger)
              .map(([seatId, passenger]) => (
                <div key={seatId} className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="text-md sm:text-lg font-semibold text-gray-700 mb-2">Passenger for Seat {seatId}</h4>
                  <p className="text-gray-600">
                    <span className="font-semibold">Name:</span> {passenger.name || "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Gender:</span>{" "}
                    {passenger.gender === "Other" ? passenger.customGender : passenger.gender}
                  </p>
                </div>
              ))}

            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-semibold">From Location:</span> Delhi
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">To Location:</span> Mumbai
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Pickup Location:</span> Rajiv Chowk
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Drop Location:</span> Andheri West
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Date of Trip:</span> {new Date().toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Seats Booked:</span> {selectedSeats.map((seat) => seat.id).join(", ")}
              </p>
              <p className="text-gray-600 text-lg font-medium">
                <span className="font-semibold">Total Amount :</span> Rs. {totalAmount}
              </p>
            </div>

            {/* Pay Now Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handlePayment}
                className="py-2 px-4 bg-blue-600 text-white text-base font-medium rounded-md shadow hover:bg-blue-700 transition duration-300"
              >
                <Link to="/sharedcabbookingconfirmed">Pay Now</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default SeatList;

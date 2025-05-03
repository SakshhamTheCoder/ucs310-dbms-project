import React, { useEffect, useState } from 'react';
import api from '../utils/apiClient';

const classColors = {
  Economy: 'bg-green-200',
  Business: 'bg-blue-200',
  First: 'bg-yellow-200',
};

const SeatMap = ({ flightId, selectedSeats, onSelectSeat, maxSelectable = 1 }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeats = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/seats/${flightId}`);
        setSeats(data);
      } catch (err) {
        setSeats([]);
      } finally {
        setLoading(false);
      }
    };
    if (flightId) fetchSeats();
  }, [flightId]);

  const handleSeatClick = (seat) => {
    if (seat.is_booked) return;
    if (selectedSeats.includes(seat.seat_id)) {
      onSelectSeat(selectedSeats.filter((id) => id !== seat.seat_id));
    } else {
      if (selectedSeats.length < maxSelectable) {
        onSelectSeat([...selectedSeats, seat.seat_id]);
      }
    }
  };

  if (loading) return <div>Loading seat map...</div>;
  if (!seats.length) return <div>No seats found for this flight.</div>;

  return (
    <div>
      <div className="mb-2 flex gap-4">
        <span className="inline-block w-4 h-4 bg-green-200 border mr-1"></span> Economy
        <span className="inline-block w-4 h-4 bg-blue-200 border mr-1"></span> Business
        <span className="inline-block w-4 h-4 bg-yellow-200 border mr-1"></span> First
        <span className="inline-block w-4 h-4 bg-gray-400 border mr-1"></span> Booked
        <span className="inline-block w-4 h-4 bg-indigo-400 border mr-1"></span> Selected
      </div>
      <div className="grid grid-cols-6 gap-2">
        {seats.map((seat) => {
          let color = classColors[seat.seat_class] || 'bg-gray-200';
          if (seat.is_booked) color = 'bg-gray-400';
          if (selectedSeats.includes(seat.seat_id)) color = 'bg-indigo-400';
          return (
            <button
              key={seat.seat_id}
              className={`p-2 rounded text-xs border ${color} ${seat.is_booked ? 'cursor-not-allowed opacity-60' : 'hover:ring-2'} ${selectedSeats.includes(seat.seat_id) ? 'ring-2 ring-indigo-600' : ''}`}
              disabled={seat.is_booked}
              onClick={() => handleSeatClick(seat)}
              type="button"
            >
              {seat.seat_number}
              <div className="text-[10px]">{seat.seat_class[0]}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SeatMap; 
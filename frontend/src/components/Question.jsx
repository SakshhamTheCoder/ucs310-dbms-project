import React, { useState } from "react";

const Question = () => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="w-9/10 text-2xl mx-auto p-4 shadow-lg border-2 border-blue-950">
      <div>What is the capital of India?</div> {/* Yahan question rakh lena */}
      <form className="grid grid-cols-2 gap-4 mt-4">
        {/* mapping se options le aana */}
        {["Kolkata", "New Delhi", "Mumbai", "Chennai"].map((option) => (
          <button
            key={option}
            type="button"
            value={option}
            onClick={() => handleOptionClick(option)}
            className={`p-2 border rounded hover:cursor-pointer hover:bg-red-400 ${
              selectedOption === option ? "bg-red-400 text-white" : "text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </form>
      {selectedOption && <p className="mt-4">Selected: {selectedOption}</p>}
      <div className="flex items-center justify-between mt-4">
    <button
      className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 active:bg-blue-700 shadow-md transition-colors">
      Submit
    </button>
    </div>
    </div>    
  );
};

export default Question;

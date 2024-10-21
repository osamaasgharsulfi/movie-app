
import axios from "@/app/utils/axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from 'react-toastify';
const RatingStars = ({ movieId, ratingOfMovie }) => {
  const router = useRouter();
  const [hover, setHover] = useState(null);
  const [ratingValue, setRatingValue] = useState(ratingOfMovie);

  const giveRating = async (value) => {
    try {


      let data = {
        movieId: parseInt(movieId),
        value: value,
      };
      const response = await axios.post("/rating/rateMovie", data);

      toast.success(response?.data?.message)
      if (response.data.statusCode == 0) {
        return
      }
      setRatingValue(value);

      // alert(response?.data?.message);


    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("An error occurred while submitting the rating");
    }
  };

  const handleBackClick = () => {
    router.push("/dashboard/home");
  };

  return (
    <div>
      {/* Render 5 stars for the rating system */}
      {[...Array(5)].map((_, index) => {
        const currentRating = index + 1;

        return (
          <label key={index}>
            {/* Radio input for each star */}
            <input
              type="radio"
              name="rating"
              value={currentRating}
              onClick={() => giveRating(currentRating)}
              style={{ display: "none" }}
            />

            {/* Star icon */}
            <FaStar
              size={30}
              color={
                currentRating <= (hover || ratingValue) ? "#ffc107" : "#e4e5e9"
              }
              onMouseEnter={() => setHover(currentRating)}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}
            />
          </label>
        );
      })}
      <button
        onClick={handleBackClick}
        style={backButtonStyle}
      >
        Back to Home
      </button>
    </div>
  );
};

export default RatingStars;


const backButtonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
  fontSize: "16px",
  display: "inline-block",
};
"use client";
import React, { useEffect, useState } from "react";
import axios from "@/app/utils/axios";
import StarRating from "@/app/components/ratingStar";
import { useRouter } from "next/navigation";
import styles from "@/app/Styles/dashboard.module.css";

const MovieDetails = ({ params }) => {
  const [movie, setMovie] = useState(null);
  const [avgRating, setAvgRating] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`movies/getMovie/${params.id}`);
        setMovie(response?.data?.data);

        const getRating = await axios.get(`rating/averageRating/${params.id}`);
        if(getRating?.data?.statusCode == 1){
          setAvgRating(getRating?.data?.data?.rating);
        }
        else{
          setAvgRating(null);
        }


      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };
    fetchMovieDetails();
  }, [params.id]);




  if (!movie) {
    return <p>Loading...</p>;
  }

  return (
    <div className={styles.movieDetails}>
      <h2>{movie.title}</h2>

      <img src={movie?.image} alt="Movies Images" style={{ width: "200px", height: "200px" }} />
      {avgRating !== null &&
        <p>Average Rating: {" "}
          {avgRating} out of 5</p>
      }
      <p>{movie.description}</p>
      <StarRating movieId={params.id} ratingOfMovie={movie.ratings[0]?.rating} />
    </div>
  );
};

export default MovieDetails;

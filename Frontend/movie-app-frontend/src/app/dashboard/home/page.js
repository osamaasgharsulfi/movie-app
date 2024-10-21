"use client";

import React, { useEffect, useState } from "react";
import axios from "@/app/utils/axios";
import styles from "@/app/Styles/dashboard.module.css";
import { AiOutlineUser } from "react-icons/ai";
import { useRouter } from "next/navigation";
import withAuth from "@/app/utils/withAuth";
import Modal from "react-modal";
import { toast } from 'react-toastify';
export default withAuth(function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [username, setUsername] = useState("");
  const router = useRouter(); // Initialize router
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    // Fetch movies list from your API
    const fetchMovies = async () => {
      try {
        const response = await axios.get("movies/getAllMoviesWithCategories");
        setMovies(response?.data?.data);
      } catch (error) {
        console.error("Error fetching movies", error);
      }
    };

    // Fetch recommended movies from another API
    const fetchRecommendedMovies = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append(
          "Authorization",
          `Bearer ${localStorage.getItem("token")}`
        );

        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const apiCall = await fetch(
          "http://127.0.0.1:4000/recommendation/giveRating",
          requestOptions
        );
        const response = await apiCall.json();

        console.log("rate data", response?.data);

        setRecommendedMovies(
          Array.isArray(response?.data) ? response?.data : []
        );
      } catch (error) {
        console.error("Error fetching recommended movies", error);
      }
    };

    fetchMovies();
    fetchRecommendedMovies();
  }, []);
  useEffect(() => {
    axios
      .get('https://random.imagecdn.app/500/150')
      .then(response => {
        setImageUrl(response.config.url); // URL of the random image
        console.log("images", response.config.url);

      })

      .catch(error => {
        console.error('Error fetching random image:', error);
      });
  }, []);
  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    toast.success("User logout successfully")

    router.push("/auth/login"); // Redirect to login page after logout
  };

  const handleMovieClick = (movieId) => {
    console.log("home movie id", movieId);
    router.push(`/dashboard/movie/${movieId}`); // Navigate to movie details page
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const date = new Date(localStorage.getItem("dob"));
  const formattedDate = date.toISOString().split("T")[0];

  // State for form inputs
  const [formData, setFormData] = useState({
    name: localStorage.getItem("username"),
    image: localStorage.getItem("image"),
    dob: formattedDate,
  });



  // Open and close modal handlers
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
  };

  // Validate that the user is at least 18 years old
  const is18OrOlder = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1;
    }
    return age;
  };

  // Handle form submission and make PUT request with Axios
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (is18OrOlder(formData.dob) < 18) {
      setErrorMessage("You must be at least 18 years old.");
      return;
    }

    try {
      const formattedDateString = formData.dob;
      const date = new Date(formattedDateString);
      const isoDateString = date.toISOString();

      const response = await axios.put("users/updateProfile", {
        name: formData.name,
        image: formData.image,
        dob: isoDateString,
        categoryIds: [1, 2, 4],
      });

      if (response?.data?.statusCode == 1) {
        localStorage.setItem("username", response?.data?.data?.name);
        localStorage.setItem("dob", response?.data?.data?.dob);
        localStorage.setItem("image", response?.data?.data?.image);
        // alert(response?.data?.message);
        toast.success(response?.data?.message)

      } else {
        // alert(response?.data?.message);
        toast.success(response?.data?.message)

      }

      // Close the modal after successful update
      setErrorMessage("");
      closeModal();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("username");
    if (user) {
      setUsername(user);
    }
  }, [handleSubmit]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Dashboard</h1>
        <div className={styles.userContainer}>
          <AiOutlineUser className={styles.userIcon} />
          <span className={styles.username}>{username}</span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
          <button onClick={openModal} style={openButtonStyle}>
            Update Profile
          </button>
        </div>
      </header>
      {/* ------------------------Update Profile Modal--------------------------- */}

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Update Profile"
        className={styles.modalContent}
        overlayClassName={styles.modalOverlay}
      >
        <h2 className={styles.modalTitle}>Update Your Profile</h2>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          {/* Name Field */}
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>

          {/* Image URL Field */}
          <div className={styles.formGroup}>
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              className={styles.inputField}
            />
          </div>

          {/* Date of Birth Field */}
          <div className={styles.formGroup}>
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              max={getTodayDate()} // Restrict future dates
              required
              className={styles.inputField}
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
        <button onClick={closeModal} className={styles.closeButton}>
          Close
        </button>
      </Modal>

      <section className={styles.moviesSection}>

        <h2 className={styles.sectionTitle}>Movies List</h2>

        <ul className={styles.movieList}>

          {movies.map((movie, index) => (
            <li
              key={movie.id}
              className={styles.movieItem}
              onClick={() => handleMovieClick(movie.id)}
            >
              <h3>{movie.title}</h3>
              <img src={movie?.image} alt="Random Kitten"  style={{width:"200px",height:"200px"}} />

              <p>{movie.description}</p>
              <span className={styles.category}>
                Category: {movie.category}
              </span>
              {movie.Movierating != null &&
                <p>Rating: {" "}
                  {movie.Movierating} out of 5</p>
              }
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.recommendedSection}>
        <h2 className={styles.sectionTitle}>Recommended Movies</h2>
        <ul className={styles.recommendedList}>
          {recommendedMovies && recommendedMovies.length > 0 ? (
            recommendedMovies.map((movie) => (
              <li key={movie.id} className={styles.recommendedItem}>
                <h3>{movie.title}</h3>
              <img src={movie?.image} alt="Random Kitten" style={{width:"200px",height:"200px"}} />

                <p>{movie.description}</p>
                <span className={styles.category}>
                  Category: {movie.category}
                </span>
                {movie.rating != 0 &&
                  <p>Rating: {" "}
                    {movie.rating} out of 5</p>
                }
              </li>
            ))
          ) : (
            <p>No recommended movies available.</p>
          )}
        </ul>
      </section>
    </div>
  );
});

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    width: "400px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
};

// Styling for buttons and form fields
const openButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

const closeButtonStyle = {
  padding: "5px 10px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

const submitButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  borderRadius: "5px",
};

const fieldStyle = {
  marginBottom: "15px",
};

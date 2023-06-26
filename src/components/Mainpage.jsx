import "../styles/Mainpage.css";
import Navbar from "./Navbar";
import Pizza from "../images/pizza.png";
import Biryani from "../images/biryani.png";
import Pasta from "../images/pasta.png";
import Cake from "../images/cake.png";
import { motion } from "framer-motion";
import { Autocomplete, Button, TextField, LinearProgress, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import CustomDropDown from "./CustomDropdown";
import Pagination from "@mui/material/Pagination";
import RecipeCard from "./RecipeCard";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";

const CustomLinearProgress = styled(LinearProgress)({
    backgroundColor: "orange",
    borderRadius: "10px",
    "& .MuiLinearProgress-bar1Indeterminate, .MuiLinearProgress-bar2Indeterminate": {
        backgroundColor: "red",
    },
});

const CustomPagination = styled(Pagination)`
    &.MuiPagination-root {
        & .MuiPagination-ul {
            & li {
                & .Mui-selected {
                    background-color: rgba(255, 68, 0, 0.8);
                }
            }
            & button {
                color: white;
                background-color: rgba(255, 68, 0, 0.4);
                &:hover {
                    background-color: rgba(255, 68, 0, 0.8);
                }
            }
            & .MuiPaginationItem-previousNext {
                color: white;
                &:hover {
                    background-color: rgba(255, 68, 0, 0.8);
                }
            }
        }
    }
`;

const CustomAutocomplete = styled(Autocomplete)`
    &.MuiAutocomplete-root {
        & input {
            color: white !important;
        }
        & label {
            color: white;
        }
        & fieldset {
            border-color: white;
            border-radius: 1rem;
        }
        &.Mui-focused fieldset {
            border-color: white;
        }
        &:hover fieldset {
            border-color: white;
        }
        & .MuiIconButton-root {
            color: white;
        }
    }
`;

function Mainpage() {
    const [isLoading, setLoading] = useState(true);
    const [username, setUsername] = useState("XX");
    const [isImageLoading, setImageLoading] = useState(true);
    const [searchType, setSearchType] = useState("query");
    const [searchQuery, setSearchQuery] = useState("");
    const [cuisine, setCuisine] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [count, setCount] = useState(0);
    const [currPage, setCurrpage] = useState(1);
    //offset ka kaam baaki he offset ko 40 se incremenet karna he jab sare random recipes dekhke ho jaye ya user 10 pages ke baad next button click kare
    const [offset, setOffset] = useState(0);
    const ITEMS_PER_PAGE = 8;
    const TOTAL_ITEMS = recipes.length;
    const startIdx = (currPage - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const displayRecipes = Array.from(recipes).slice(startIdx, endIdx);
    let timeoutId = null;
    const handleQuery = (event) => {
        clearTimeout(timeoutId);
        // Get the user input from the text field
        const userInput = event.target.value;
        setSearchQuery(userInput);
        // Set a new timeout to send the request after 2 seconds
        timeoutId = setTimeout(() => {
            if (userInput !== "") getSearchResults(userInput);
            console.log(searchResults);
        }, 1000);
    };

    const handlePageChange = (event, page) => {
        setCurrpage(Number(page));
        setImageLoading(true);
    };

    const handleSearch = (event) => {
        if (searchType === "query") {
            getSimilarRecipesFromSelectedRecipe(searchQuery, offset);
            console.log(searchQuery);
        }
        if (searchType === "cuisine") {
            getCuisines();
        }
    };

    const getCuisines = async () => {
        const res = await axios.get(`/api/cuisine/${cuisine}/${offset}`);
        setRecipes(res.data);
        console.log(res.data);
    };

    const getSearchResults = async (query) => {
        const res = await axios.get(`/api/search/${query}`);
        setSearchResults(Object(res.data));
    };

    const getSimilarRecipesFromSelectedRecipe = async (title, offset) => {
        const res = await axios.get(`/api/similar/${title}/${offset}`);
        setRecipes(res.data);
        console.log(res.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            const getRandomRecipes = async () => {
                const res = await axios.get("/api/get-random-recipes");
                setRecipes(res.data);
            };
            const getUseraname = async () => {
                const res = await axios.get(`/api/get-username/${localStorage.getItem("uid")}`);
                console.log(res.data);
                setUsername(res.data.name);
            };
            const getFavouritesCount = async () => {
                try {
                    const res = await axios.get(
                        `/api/get-favourites-count/${localStorage.getItem("uid")}`
                    );
                    setCount(res.data.count);
                } catch (error) {
                    console.log(error);
                }
            };
            await getRandomRecipes();
            await getUseraname();
            await getFavouritesCount();
            setLoading(false);
        };
        setTimeout(() => {
            fetchData();
        }, 2000);
    }, []);
    return (
        <>
            {!isLoading ? <Navbar username={username} count={count} /> : ""}
            <div id="main-page-container">
                <div className="greeting-text-container">
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 50, opacity: 1 }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                    >
                        <span className="greeting-text">Welcome</span> to the flavorsome world of
                        culinary delights! Make any Recipes at{" "}
                        <span className="greeting-text">Home!</span>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ x: -400, y: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.8, rotateZ: -30 }}
                    transition={{ duration: 1, ease: "easeInOut", delay: 1.5 }}
                    className="static-food-images-container"
                >
                    <motion.div
                        initial={{ rotateZ: -30, scale: 0 }}
                        animate={{ rotateZ: 90, scale: 1 }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                            delay: 1.6,
                        }}
                        className="image-container"
                    >
                        <img src={Pizza} alt="pizza" />
                    </motion.div>
                    <motion.div
                        initial={{ rotateZ: -30, scale: 0 }}
                        animate={{ rotateZ: 60, scale: 1 }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                            delay: 1.7,
                        }}
                        className="image-container"
                    >
                        <img src={Biryani} alt="pizza" />
                    </motion.div>
                    <motion.div
                        initial={{ rotateZ: 30, scale: 0 }}
                        animate={{ rotateZ: 10, scale: 1 }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                            delay: 1.8,
                        }}
                        className="image-container"
                    >
                        <img src={Pasta} alt="pizza" />
                    </motion.div>
                    <motion.div
                        initial={{ rotateZ: -45, scale: 0 }}
                        animate={{ rotateZ: 45, scale: 1 }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                            delay: 1.9,
                        }}
                        className="image-container"
                    >
                        <img src={Cake} alt="pizza" />
                    </motion.div>
                </motion.div>
            </div>
            <div className="search-results-section">
                <div className="searching-pagination-section">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            columnGap: "10px",
                        }}
                    >
                        <CustomAutocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={searchResults}
                            sx={{ width: 300 }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Recipes"
                                    onChange={handleQuery}
                                />
                            )}
                            onChange={(e) => {
                                setSearchType("query");
                                setSearchQuery(e.target.textContent);
                            }}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                height: 40,
                                widht: 40,
                                backgroundImage: "linear-gradient(to top, orangered, orange)",
                                color: "white",
                                borderRadius: "5px",
                            }}
                            onClick={handleSearch}
                        >
                            <FaSearch fontSize={30} />
                        </Button>
                    </div>
                    <CustomDropDown
                        cuisine={cuisine}
                        setCuisine={setCuisine}
                        setSearchType={setSearchType}
                    />
                    <CustomPagination
                        id="custom-pagination"
                        count={Math.ceil(TOTAL_ITEMS / 8)}
                        variant="outlined"
                        onChange={handlePageChange}
                    />
                </div>
                <div className="result-section">
                    {isLoading ? (
                        <Box
                            sx={{
                                width: "20%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                "@media screen and (width <= 415px)": {
                                    width: "80%",
                                },
                                "@media screen and (width > 415px)": {
                                    width: "50%",
                                    height: "560px",
                                },
                            }}
                            height={200}
                        >
                            <CustomLinearProgress sx={{ width: "100%" }} />
                            <Typography
                                variant="h5"
                                sx={{
                                    backgroundImage: "linear-gradient(to top right, red, yellow)",
                                    backgroundClip: "text",
                                    color: "transparent",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    margin: "10px 0 0 0",
                                }}
                            >
                                Loading Recipes
                            </Typography>
                        </Box>
                    ) : (
                        displayRecipes.map((recipe, index) => {
                            return (
                                <motion.div
                                    key={recipe.id}
                                    initial={{ opacity: 0, x:100}}
                                    animate={{ opacity: 1, x:0 }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                >
                                    <RecipeCard
                                        key={index}
                                        id={recipe.id}
                                        title={recipe.title}
                                        readyInMinutes={recipe.readyInMinutes}
                                        likes={recipe.likes}
                                        isVeg={recipe.vegetarian}
                                        image={recipe.image}
                                        isImageLoading={isImageLoading}
                                        setImageLoading={setImageLoading}
                                        uid={document.URL.split("?")[1]}
                                    />
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
}

export default Mainpage;

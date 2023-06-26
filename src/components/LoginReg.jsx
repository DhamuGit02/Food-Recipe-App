import "../styles/LoginReg.css";
import { Typography, Grid, Card, Button, IconButton, Box, Backdrop } from "@mui/material";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { TbChefHat } from "react-icons/tb";
import { useState } from "react";
import { styled } from "@mui/system";
import { AnimatePresence, motion } from "framer-motion";
import CircularProgress from "@mui/material/CircularProgress";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import LogMealLogo from "../images/logmeal.png";
import SpoonacularLogo from "../images/spoonacular.svg";
import ResetPassword from "./ResetPassword";

const MotionCard = styled(motion.div)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const date = new Date();

function LoginReg() {
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setOpen(false)
    }
    const handleOpen = () => {
        setOpen(true)
    }
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(false);
    const [signUpFormData, setSignUpFormData] = useState({
        email: "",
        name: "",
        password: "",
        confirm_password: "",
    });
    const [showPage, setShowPage] = useState("signup");
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const validate = (data) => {
        // console.log('yes', data)
        const pattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/;
        // console.log(Object.keys(data).length)
        if (Object.keys(data).length === 4) {
            if (
                data.email === "" ||
                data.name === "" ||
                data.password === "" ||
                data.confirm_password === ""
            ) {
                showMessage("All fields are required", "error");
                // console.log('filds')
                // setValidData(false)
                return false;
            } else {
                if (data.password !== data.confirm_password) {
                    // console.log('password')
                    showMessage("Please enter same password", "error");
                    // setValidData(false)
                    return false;
                } else if (data.password.length < 6) {
                    // console.log('length')
                    showMessage("password length must be more than 6", "error");
                    // setValidData(false)
                    return false;
                } else if (pattern.test(data.password)) {
                    // setValidData(true)
                    // console.log('correct')
                    return true;
                } else {
                    showMessage("Password must contain alteast one uppercase, lowercase and digit");
                    // setValidData(false)
                    return false;
                }
            }
        } else {
            if (data.email === "" || data.password === "" || data.confirm_password === "") {
                showMessage("All fields are required", "error");
            }
        }
    };
    const showMessage = (message, type) => {
        if (type === "success") {
            toast.success(message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide,
            });
        } else {
            toast.error(message, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Slide,
            });
        }
    };
    const handleSignUpFormData = (event) => {
        setSignUpFormData(() => ({
            ...signUpFormData,
            [event.target.name]: event.target.value,
        }));
    };
    const [signInFormData, setSignInFormData] = useState({
        email: "",
        password: "",
    });
    const handleSignInFormData = (event) => {
        setSignInFormData(() => ({
            ...signInFormData,
            [event.target.name]: event.target.value,
        }));
    };
    const signUp = async (event) => {
        console.log("sign up");
        event.preventDefault();
        try {
            // const isValid = validate(signInFormData)
            if (validate(signUpFormData)) {
                setLoading(true);
                const res = await axios.post("/api/signup", {
                    email: signUpFormData.email,
                    name: signUpFormData.name,
                    password: signUpFormData.password,
                });
                console.log(res.data);
                if (res.data.value) showMessage("Email Already Exists", "error");
                else showMessage("Successfully Signed Up", "success");
                setLoading(false);
            }
        } catch (error) {
            showMessage("Network Error", "error");
            setLoading(false);
        }
    };
    const signIn = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            validate(signInFormData);
            const res = await axios.post("/api/signin", {
                email: signInFormData.email,
                password: signInFormData.password,
            });
            console.log(res.data);
            localStorage.setItem("uid", res.data.id);
            if (res.data.value) {
                navigate(`/mainpage/`);
            } else showMessage("Invalid Credentials", "error");
            setLoading(false);
        } catch (error) {
            showMessage("Some Error occured", "error");
            setLoading(false);
        }
    };
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Backdrop
                open={open}
                sx={{
                    zIndex:3,
                    backdropFilter:'blur(10px)',
                    transition:'0.5s easeInOut'
                }}
            >
                <ResetPassword handleClose={handleClose}/>
            </Backdrop>
            <div className="login-reg-container">
                <Grid container maxWidth={"sm"} justifyContent={"center"} zIndex={2}>
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ease: "easeOut", duration: 0.8, delay: 0.5 }}
                    >
                        <Typography
                            variant="h2"
                            color="rgb(200, 200, 200)"
                            textAlign={"center"}
                            sx={{
                                "@media screen and (max-width:380px)": {
                                    marginTop: 1,
                                },
                                "@media screen and (max-width:1025px)": {
                                    marginTop: 10,
                                },
                            }}
                        >
                            <span className="highlighted-text">H</span>ome{" "}
                            <span className="highlighted-text">C</span>hef
                        </Typography>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ease: "easeOut", duration: 0.8, delay: 1.5 }}
                    >
                        <Typography
                            paragraph
                            fontSize={"2rem"}
                            color={"rgba(200, 200, 200)"}
                            textAlign={"center"}
                            m={"0 5% 0 5%"}
                        >
                            Make any recipe at Home and become Home Chef{" "}
                            <motion.span
                                style={{ display: "inline-block" }}
                                initial={{ opacity: 0, scale: 0, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: -5 }}
                                transition={{
                                    type: "spring",
                                    duration: 0.8,
                                    delay: 2.5,
                                    stiffness: 150,
                                    damping: 10,
                                }}
                            >
                                <TbChefHat fontSize={42} />
                            </motion.span>
                        </Typography>
                    </motion.div>
                </Grid>
                <Grid container maxWidth={"sm"} justifyContent={"center"} m={"0 0 5% 0"}>
                    <MotionCard
                        style={{ width: "100%", zIndex: 2 }}
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ease: "easeOut", duration: 0.8, delay: 3.5 }}
                    >
                        {showPage === "signup" ? (
                            <Card
                                sx={{
                                    width: "100%",
                                    height: "fit-content",
                                    backgroundColor: "rgb(40, 40, 40)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    borderRadius: "1rem",
                                    "@media screen and (max-width:600px)": {
                                        width: "90%",
                                    },
                                }}
                            >
                                <AnimatePresence>
                                    <motion.form
                                        method="post"
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "95%",
                                            rowGap: "1rem",
                                            alignItems: "center",
                                        }}
                                        action="/"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, x: -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ ease: "easeInOut", duration: 0.5 }}
                                        >
                                            <Typography
                                                variant="h4"
                                                textAlign={"center"}
                                                mt={2}
                                                mb={1}
                                                fontWeight={700}
                                                sx={{
                                                    backgroundImage:
                                                        "linear-gradient(to top, red, orangered)",
                                                    backgroundClip: "text",
                                                    color: "transparent",
                                                }}
                                            >
                                                Sign Up
                                            </Typography>
                                        </motion.div>
                                        <motion.div
                                            className="input-container"
                                            initial={{ opacity: 0, x: -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ ease: "easeInOut", duration: 0.5 }}
                                        >
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                placeholder="email"
                                                onChange={handleSignUpFormData}
                                                value={signUpFormData.email}
                                            />
                                        </motion.div>
                                        <motion.div
                                            className="input-container"
                                            initial={{ opacity: 0, x: -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ ease: "easeInOut", duration: 0.5 }}
                                        >
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                placeholder="name"
                                                onChange={handleSignUpFormData}
                                                value={signUpFormData.name}
                                            />
                                        </motion.div>
                                        <motion.div
                                            className="input-container"
                                            initial={{ opacity: 0, x: -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ ease: "easeInOut", duration: 0.5 }}
                                        >
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                id="pass"
                                                placeholder="password"
                                                onChange={handleSignUpFormData}
                                                value={signUpFormData.password}
                                            />
                                            <IconButton onClick={handleClickShowPassword}>
                                                {showPassword ? (
                                                    <AiFillEyeInvisible
                                                        fontSize={24}
                                                        color="gray"
                                                    />
                                                ) : (
                                                    <AiFillEye fontSize={24} color="gray" />
                                                )}
                                            </IconButton>
                                        </motion.div>
                                        <motion.div
                                            className="input-container"
                                            initial={{ opacity: 0, x: -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ ease: "easeInOut", duration: 0.5 }}
                                        >
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="confirm_password"
                                                id="cpass"
                                                placeholder="confirm password"
                                                onChange={handleSignUpFormData}
                                                value={signUpFormData.confirm_password}
                                            />
                                            <IconButton onClick={handleClickShowPassword}>
                                                {showPassword ? (
                                                    <AiFillEyeInvisible
                                                        fontSize={24}
                                                        color="gray"
                                                    />
                                                ) : (
                                                    <AiFillEye fontSize={24} color="gray" />
                                                )}
                                            </IconButton>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, x: -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ ease: "easeInOut", duration: 0.5 }}
                                        >
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                sx={{
                                                    backgroundImage:
                                                        "linear-gradient(to top, red, orangered)",
                                                    width: "120px",
                                                    margin: "10px 0 30px 0",
                                                }}
                                                onClick={signUp}
                                                startIcon={
                                                    isLoading ? (
                                                        <CircularProgress
                                                            size={"20px"}
                                                            sx={{ color: "white" }}
                                                        />
                                                    ) : (
                                                        ""
                                                    )
                                                }
                                            >
                                                {isLoading ? "Signing" : "Sign Up"}
                                            </Button>
                                        </motion.div>
                                    </motion.form>
                                </AnimatePresence>
                                <Typography
                                    mb={2}
                                    textAlign={"center"}
                                    variant="h6"
                                    color={"rgb(90, 90, 90)"}
                                >
                                    Already signed up ?{" "}
                                    <span className="highlighted-text">
                                        <Link
                                            className="highlighted-text"
                                            style={{
                                                textDecoration: "none",
                                            }}
                                            onClick={() => setShowPage("signin")}
                                        >
                                            Sign In
                                        </Link>
                                    </span>
                                </Typography>
                            </Card>
                        ) : (
                            <Card
                                sx={{
                                    width: "100%",
                                    height: "fit-content",
                                    backgroundColor: "rgb(40, 40, 40)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    borderRadius: "1rem",
                                    "@media screen and (max-width:600px)": {
                                        width: "90%",
                                    },
                                }}
                            >
                                <motion.form
                                    method="post"
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        width: "95%",
                                        rowGap: "1rem",
                                        alignItems: "center",
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                    >
                                        <Typography
                                            variant="h4"
                                            textAlign={"center"}
                                            mt={1}
                                            mb={5}
                                            fontWeight={700}
                                            sx={{
                                                backgroundImage:
                                                    "linear-gradient(to top, red, orangered)",
                                                backgroundClip: "text",
                                                color: "transparent",
                                            }}
                                        >
                                            Sign In
                                        </Typography>
                                    </motion.div>
                                    <motion.div
                                        className="input-container"
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        transition={{ ease: "easeInOut", duration: 0.5 }}
                                    >
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="email"
                                            onChange={handleSignInFormData}
                                            value={signInFormData.email}
                                        />
                                    </motion.div>
                                    <motion.div
                                        className="input-container"
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        transition={{ ease: "easeInOut", duration: 0.5 }}
                                    >
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            id="pass"
                                            placeholder="password"
                                            onChange={handleSignInFormData}
                                            value={signInFormData.password}
                                        />
                                        <IconButton onClick={handleClickShowPassword}>
                                            {showPassword ? (
                                                <AiFillEyeInvisible fontSize={24} color="gray" />
                                            ) : (
                                                <AiFillEye fontSize={24} color="gray" />
                                            )}
                                        </IconButton>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        transition={{ ease: "easeInOut", duration: 0.5 }}
                                    >
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                backgroundImage:
                                                    "linear-gradient(to top, red, orangered)",
                                                width: "120px",
                                                margin: "10px 0 30px 0",
                                            }}
                                            onClick={signIn}
                                            startIcon={
                                                isLoading ? (
                                                    <CircularProgress
                                                        size={"20px"}
                                                        sx={{ color: "white" }}
                                                    />
                                                ) : (
                                                    ""
                                                )
                                            }
                                        >
                                            {isLoading ? "Signing" : "Sign In"}
                                        </Button>
                                    </motion.div>
                                </motion.form>
                                <Typography
                                    mb={2}
                                    textAlign={"center"}
                                    variant="h6"
                                    color={"rgb(90, 90, 90)"}
                                >
                                    Don't have an account ?{" "}
                                    <span className="highlighted-text">
                                        <Link
                                            className="highlighted-text"
                                            style={{
                                                textDecoration: "none",
                                            }}
                                            onClick={() => setShowPage("signup")}
                                        >
                                            Sign Up
                                        </Link>
                                    </span>
                                </Typography>
                                <Typography textAlign={"center"} mb={2}>
                                    <Link
                                        style={{ textDecoration: "none", color: "rgb(90, 90, 90)" }}
                                        onClick={handleOpen}
                                    >
                                        Forgot password ?
                                    </Link>
                                </Typography>
                            </Card>
                        )}
                    </MotionCard>
                </Grid>
                <footer className="app-footer">
                    <Typography variant="h6" m={"0 0 0 2.5%"} color={"white"}>
                        Copyright © {date.getFullYear()}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "10px",
                            margin: "0 2% 0 0",
                        }}
                    >
                        <Typography variant="h6" color={"white"}>
                            Powered By &nbsp;
                        </Typography>
                        <img src={LogMealLogo} width={100} style={{ filter: "brightness(100%)" }} />
                        <img src={SpoonacularLogo} width={40} />
                    </Box>
                </footer>
            </div>
        </>
    );
}

export default LoginReg;

import { Box, CircularProgress, Button, IconButton } from "@mui/material";
import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { toast, Slide } from "react-toastify";
import "../styles/ResetPassword.css";
import axios from "axios";

const validate = (data) => {
    // console.log('yes', data)
    const pattern = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/;
    // console.log(Object.keys(data).length)
    if (data.email === "" || data.password === "" || data.confirm_password === "") {
        showMessage("All fields are required", "error");
        return false;
    }
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

function ResetPassword({ handleClose }) {
    const handleClickShowPassword = () => setShowPassword((show) => !show)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirm_password: "",
    });
    const handleFormData = (event) => {
        setFormData(() => ({
            ...formData,
            [event.target.name]: event.target.value,
        }));
    };
    const handlePasswordChange = async (event) => {
        event.preventDefault();
        if (validate(formData)) {
            try {
                const res = await axios.put("/api/reset-password", {
                    email: formData.email,
                    password: formData.password,
                });
                if (res.data.value) showMessage(res.data.message, "success");
            } catch (error) {
                showMessage("Some error occured", "error");
            }
        }
    };
    return (
        <Box
            sx={{
                position: "relative",
                width: "30%",
                height: "fit-content",
                padding: "50px 0 50px 0",
                backgroundColor: "rgb(50, 50, 50)",
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                rowGap: 4,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "10px",
                '@media screen and (width <= 415px)' : {
                    width:"90%"
                },
                '@media screen and ((width > 415px) and (width <= 980px))' : {
                    width:"50%"
                }
            }}
        >
            <IconButton
                sx={{ position: "absolute", top: "10px", right: "10px" }}
                onClick={handleClose}
            >
                <IoCloseOutline color="gray" />
            </IconButton>
            <input
                onChange={handleFormData}
                value={formData.email}
                name="email"
                type="email"
                className="text-input"
                placeholder="Enter your email"
            />
            <div style={{width:"90%", display:"flex", justifyContent:"space-between"}}>
                <input
                    onChange={handleFormData}
                    value={formData.password}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="password-field"
                    placeholder="Enter new password"
                />
                <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <AiFillEye color="gray"/> : <AiFillEyeInvisible color="gray" />}
                </IconButton>
            </div>
            <div style={{width:"90%", display:"flex", justifyContent:"space-between"}}>
                <input
                    onChange={handleFormData}
                    value={formData.confirm_password}
                    name="confirm_password"
                    type={showPassword ? "text" : "password"}
                    className="password-field"
                    placeholder="Confirm new password"
                />
                <IconButton onClick={handleClickShowPassword}>
                    {showPassword ? <AiFillEye color="gray"/> : <AiFillEyeInvisible color="gray" />}
                </IconButton>
            </div>
            <Button
                startIcon={isLoading ? <CircularProgress sx={{ color: "white" }} size={20} /> : ""}
                variant="contained"
                sx={{ backgroundImage: "linear-gradient(to top, red, orangered)" }}
                onClick={handlePasswordChange}
            >
                save
            </Button>
        </Box>
    );
}

export default ResetPassword;

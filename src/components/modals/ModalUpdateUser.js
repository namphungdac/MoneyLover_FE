import * as React from 'react';
import Button from '@mui/material/Button';
import {useDispatch, useSelector} from "react-redux";
import {Edit, Visibility, VisibilityOff} from "@mui/icons-material";
import ClearIcon from "@mui/icons-material/Clear";
import {Avatar, IconButton, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {useFormik} from "formik";
import * as Yup from 'yup';
import {UserService} from "../../services/user.service";
import {logout} from "../../redux/authSlice";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const style = {
    position: 'absolute',
    top: '50%',
    borderRadius: "10px",
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function ModalUpdateUser() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    const [messageCheckValidCurrentPass, setMessageCheckValidCurrentPass] = React.useState('')
    const [messageCheckValidNewPassConfirmed, setMessageCheckValidNewPassConfirmed] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showNewConfirmedPassword, setShowNewConfirmedPassword] = React.useState(false);
    const {t}=useTranslation()

    const user = useSelector(state => state.auth.login.currentUser);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const validatePassword = Yup.object().shape({
        currentPassword: Yup.string()
            .required('Required'),
        newPassword: Yup.string()
            .required('Required')
            .min(6, 'Password is too short! Please use at least 6 characters.')
            .max(8, 'Password is too long! Please use at most 8 characters.'),
        newPasswordConfirmed: Yup.string()
            .required('Required'),
    })
    const formUpdate = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            newPasswordConfirmed: ''
        },
        validationSchema: validatePassword,
        onSubmit: values => {
            UserService.updateUser(values)
                .then(res => {
                    let checkValidCurrentPass = res.data.successCurrentPass
                    let checkValidNewPass = res.data.successNewPass
                    let checkValidPasswordUpdate = res.data.successUpdatePassword
                    if (!checkValidCurrentPass) {
                        setMessageCheckValidCurrentPass(res.data.messageErrorCurrentPass)
                    }
                    if (!checkValidNewPass) {
                        setMessageCheckValidNewPassConfirmed(res.data.messageErrorNewPassword)
                    }
                    if (checkValidPasswordUpdate) {
                        localStorage.removeItem('token')
                        dispatch(logout())
                        navigate('/login')
                    }
                })
        }
    });

    return (
        <div>
            <Button variant="outlined" startIcon={<Edit />} onClick={handleClickOpen}>
                {t("Edit password")}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={style}>
                    <div>
                        <Button sx={{color: "black"}} onClick={handleClose}><ClearIcon sx={{float: "left"}}/></Button>
                        <b style={{marginLeft: "60px"}}>{t("My Account")}</b>
                    </div>
                    <br/>
                    <hr/>
                    <br/>
                    <Avatar sx={{margin: "auto", width: 70, height: 70}} size="large">T</Avatar>
                    <div className="text-center text-black ">
                        <p>{user.email} </p>
                    </div>
                    <Box component="form" onSubmit={formUpdate.handleSubmit} noValidate sx={{mt: 1}}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="currentPassword"
                            label={t("Your password")}
                            type={showPassword ? 'text' : 'password'}
                            name="currentPassword"
                            autoComplete="currentPassword"
                            autoFocus
                            value={formUpdate.values.currentPassword}
                            onChange={formUpdate.handleChange}
                            error={(formUpdate.errors.currentPassword && formUpdate.touched.currentPassword) || messageCheckValidCurrentPass}
                            helperText={(formUpdate.errors.currentPassword && formUpdate.touched.currentPassword) || messageCheckValidCurrentPass ? messageCheckValidCurrentPass : null}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => setShowPassword(prevShow => !prevShow)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPassword"
                            label={t("New Password")}
                            type={showNewPassword ? 'text' : 'password'}
                            id="newPassword"
                            value={formUpdate.values.newPassword}
                            onChange={formUpdate.handleChange}
                            error={(formUpdate.errors.newPassword && formUpdate.touched.newPassword)}
                            helperText={(formUpdate.errors.newPassword && formUpdate.touched.newPassword) ? formUpdate.errors.newPassword : null}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => setShowNewPassword(prevShow => !prevShow)}
                                        edge="end"
                                    >
                                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="newPasswordConfirmed"
                            label={t("Confirm New Password")}
                            type={showNewConfirmedPassword ? 'text' : 'password'}
                            id="newPasswordConfirmed"
                            value={formUpdate.values.newPasswordConfirmed}
                            onChange={formUpdate.handleChange}
                            error={(formUpdate.errors.newPasswordConfirmed && formUpdate.touched.newPasswordConfirmed) || messageCheckValidNewPassConfirmed}
                            helperText={(formUpdate.errors.newPasswordConfirmed && formUpdate.touched.newPasswordConfirmed) || messageCheckValidNewPassConfirmed ? messageCheckValidNewPassConfirmed : null}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => setShowNewConfirmedPassword(prevShow => !prevShow)}
                                        edge="end"
                                    >
                                        {showNewConfirmedPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                ),
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{mt: 3, mb: 2}}
                        >
                            {t("Change")}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>);
}
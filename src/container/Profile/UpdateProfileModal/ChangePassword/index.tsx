import * as Yup from "yup";
import React from "react";
import { PRIMARY_COLOR, User, Role, http } from "src/utils";
import { TransitionProps } from "@mui/material/transitions";
import { FormikProps, useFormik } from "formik";

import {
  DialogActions,
  DialogContent,
  TextField,
  DialogTitle,
  Button,
  Dialog,
  Typography,
  IconButton,
  Slide,
} from "@mui/material";
import { ToastSuccess } from "src/utils/toastOptions";

import CloseIcon from "@mui/icons-material/Close";

import "./styles.scss";

const commonValidation = {
  phoneNumber: Yup.string().nullable().required("SĐT là bắt buộc"),
};

interface Props {
  isOpen: boolean;
  onEditSuccess?: () => void;
  handleCloseChange: () => void;
  user: User;
  setUserInfor?: React.Dispatch<React.SetStateAction<User>>;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ChangePassword = (props: Props) => {
  const { isOpen, handleCloseChange, user } = props;
  const [isConfirm, setIsConfirm] = React.useState<boolean>(false);
  const currentUser =
    user ||
    (JSON.parse(localStorage.getItem("currentUser")) as unknown as User);
  const formRef = React.useRef<FormikProps<User>>(null);
  const isHospital = currentUser?.role === Role.Hospital;
  const isVolunteer = currentUser?.role === Role.Volunteer;
  const isBloodBank = currentUser?.role === Role.BloodBank;
  const [isOpenModalCrop, setIsOpenModalCrop] = React.useState(false);
  const [_, setIsLoading] = React.useState(false);
  const validationSchema = Yup.object().shape({
    ...commonValidation,
  });

  const handleUpdatePhone = () => {
    const updateData = {
      ...values,
      phoneNumber: `${values?.phoneNumber}`,
    };

    const endpoint = isBloodBank
      ? "/user/updateProfilebloodbank"
      : isHospital
      ? "/user/updateProfileHospital"
      : "/user/updateProfileVolunteer";

    http
      .put(endpoint, updateData)
      .then((res) => {
        ToastSuccess("Update Phone Successfully");
        handleCloseChange();
        localStorage.setItem("currentUser", JSON.stringify(updateData));
        window.location.reload();
      })
      .catch((err) => {
        console.log(err?.message);
      });
  };

  const formik = useFormik({
    initialValues: {
      userId: currentUser?.userId,
      phoneNumber: currentUser?.phoneNumber,
      role: currentUser?.role,
    },
    validationSchema,
    innerRef: formRef,
    onSubmit: () => setIsConfirm(true),
  });

  const { errors, touched, getFieldProps, setFieldValue, dirty, values } =
    formik;
  console.log("🚀 ~ EditProfile ~ errors:", errors);

  return (
    <React.Fragment>
      <Dialog
        open={isOpen}
        onClose={handleCloseChange}
        className="change-pass-dialog"
      >
        <DialogTitle className="change-pass-dialog__title">
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseChange}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography
            className="change-pass-dialog__title__content"
            variant="h6"
            component="div"
          >
            Thay đổi mật khẩu
          </Typography>
        </DialogTitle>
        <DialogContent className="change-pass-dialog">
          <TextField
            autoFocus
            margin="dense"
            required
            id="phoneNumber"
            label="Mật khẩu mới"
            className="change-pass-dialog__input"
            type="text"
            fullWidth
            variant="outlined"
            // error={touched.phoneNumber && Boolean(errors.phoneNumber)}
            // helperText={
            //   touched.phoneNumber && errors.phoneNumber ? (
            //     <Typography variant="caption" color="error">
            //       {errors.phoneNumber as string}
            //     </Typography>
            //   ) : null
            // }
          />

          {/* <TextField
            autoFocus
            margin="dense"
            required
            id="phoneNumber"
            // {...getFieldProps("phoneNumber")}
            label="Xác nhận mật khẩu"
            className="change-pass-dialog__input"
            type="text"
            fullWidth
            variant="outlined"
            // error={touched.phoneNumber && Boolean(errors.phoneNumber)}
            // helperText={
            //   touched.phoneNumber && errors.phoneNumber ? (
            //     <Typography variant="caption" color="error">
            //       {errors.phoneNumber as string}
            //     </Typography>
            //   ) : null
            // }
          /> */}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button
            variant="outlined"
            sx={{ color: PRIMARY_COLOR, border: "1px solid #811315" }}
            onClick={handleCloseChange}
          >
            Cancel
          </Button>

          <Button
            variant="outlined"
            sx={{ color: PRIMARY_COLOR, border: "1px solid #811315" }}
            // onClick={handleUpdateProfile}
            // disabled={!dirty || !isEmpty(errors)}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default ChangePassword;

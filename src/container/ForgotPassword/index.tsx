import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { schema } from "./helpers";
import { http } from "src/utils";
import { Grid, TextField, Typography } from "@mui/material";
import logo1 from "src/assets/images/undraw_doctors_p6aq.svg";
import logo2 from "src/assets/images/undraw_doctor_kw-5-l.svg";
import Button from "src/components/Button";
import LoadingCommon from "src/components/LoadingCircle";
import { IoMdArrowRoundBack } from "react-icons/io";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (value) => {
    setIsLoading(true);
    http
      .post("user/forgotpass", value)
      .then((res) => {
        setIsLoading(false);
        return res?.data?.data;
      })
      .then((user) => {
        toast.success("Send email successfully");
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("error: ", err?.data?.message);
        toast.error(err?.data?.message || "Email incorrect");
      });
  };

  return isLoading ? (
    <LoadingCommon additionalClass="h-[100vh]" />
  ) : (
    <>
      <div className="minH-[100vh] h-[100vh] w-full flex justify-center items-center bg-grayLight">
        <div className="w-[70%] h-[90%] shadow-2xl flex flex-row bg-white">
          <div className="w-[50%] h-[100%] ">
            <img src={logo2} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-[50%] h-[100%] flex flex-col px-8 justify-center">
            <IoMdArrowRoundBack
              size={30}
              className="cursor-pointer"
              onClick={() => navigate("/login")}
            />
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center items-center cursor-pointer ">
                <img
                  src={logo1}
                  alt="logoT"
                  width={120}
                  height={120}
                  className="bg-white p-2 rounded-full"
                />
              </div>
              <Typography variant="h5" component="h2">
                Quên mật khẩu
              </Typography>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid xs={12} mb={2} gap={1}>
                <TextField
                  fullWidth
                  variant="standard"
                  type="text"
                  label="Email"
                  name="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 color-red">
                    {errors.email.message}
                  </p>
                )}
              </Grid>

              <div className="w-full flex justify-center pb-6">
                <Button type="submit">Gửi</Button>
              </div>
            </form>
            <div className="text-sm flex justify-center text-grayCustom">
              <span className="inline-block mr-1">
                Vui lòng nhập email tài khoản của bạn.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

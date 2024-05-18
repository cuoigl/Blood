import * as yup from "yup";

export const schema = yup
  .object({
    email: yup
      .string()
      .email("Vui lòng nhập địa chỉ email hợp lệ")
      .required("Vui lòng nhập địa chỉ email của bạn"),
  })
  .required();

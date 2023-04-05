import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const registerSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must contain 8 characters")
    .required("Password is required"),
});

export const useRegisterForm = () => {
  return useForm({ resolver: yupResolver(registerSchema), mode: "onChange" });
};

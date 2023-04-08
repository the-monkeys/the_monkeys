import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const loginSchema = yup.object().shape({
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must contain 8 characters")
    .required("Password is required"),
});

export const useLoginForm = () => {
  return useForm({ resolver: yupResolver(loginSchema), mode: "onChange" });
};

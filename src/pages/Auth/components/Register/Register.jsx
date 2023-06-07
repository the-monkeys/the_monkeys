import { Link } from "react-router-dom";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RegisterImg from "../../../../assets/register.svg";
import GoogleIcon from "../../../../assets/google-icon.svg";
import { useRegisterForm } from "./hooks";
import { useCallback } from "react";
import { registerUser } from "../../../../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import SignUpButton from "../../../../components/LoadingButton/LoadingButton";
import { useToast } from "izitoast-react";
import { Alert } from "../../../../common/utils/alertConfig";

export const Register = () => {
  const { handleSubmit, control, formState } = useRegisterForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const successAlert = useToast(Alert("Registered successfully").success);
  const errorAlert = useToast(Alert("Something went wrong").error);

  const { isLoading } = useSelector((state) => state.auth);

  const onSubmit = useCallback(
    (data) => {
      dispatch(registerUser(data)).then((response) => {
        if (response && response.type === "auth/registerUser/fulfilled") {
          successAlert();
          navigate("/profile");
        }

        if (response && response.type === "auth/registerUser/rejected") {
          errorAlert();
        }
      });
    },
    [dispatch, navigate, errorAlert, successAlert]
  );

  return (
    <section
      className="container mx-auto flex items-center justify-center md:justify-end"
      data-testid="register"
    >
      <div className="hidden md:block w-1/2 p-24 pl-0">
        <img className="slide" src={RegisterImg} alt="illustration" />
      </div>
      <form
        className="slideDown py-12 md:py-28 text-2xl md:w-1/2 md:pl-28 bg-white flex flex-col space-y-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <Controller
          name="first_name"
          control={control}
          defaultValue=""
          render={({ field: { value, onChange } }) => (
            <div>
              <label>First Name:</label>
              <input
                className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
                type="text"
                placeholder="Enter first name ..."
                value={value}
                onChange={onChange}
              />
              <span style={{ color: "red" }}>
                {formState?.errors?.first_name?.message}
              </span>
            </div>
          )}
        />
        <Controller
          name="last_name"
          defaultValue=""
          control={control}
          render={({ field: { value, onChange } }) => (
            <div>
              <label>Last Name:</label>
              <input
                className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
                type="text"
                placeholder="Enter last name ..."
                value={value}
                onChange={onChange}
              />
              <span style={{ color: "red" }}>
                {formState?.errors?.last_name?.message}
              </span>
            </div>
          )}
        />
        <Controller
          name="email"
          defaultValue=""
          control={control}
          render={({ field: { value, onChange } }) => (
            <div>
              <label>Email:</label>
              <input
                className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
                type="email"
                placeholder="Enter email ..."
                value={value}
                onChange={onChange}
              />
              <span style={{ color: "red" }}>
                {formState?.errors?.email?.message}
              </span>
            </div>
          )}
        />
        <Controller
          name="password"
          defaultValue=""
          control={control}
          render={({ field: { value, onChange } }) => (
            <div>
              <label>Password:</label>
              <input
                className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
                placeholder="Enter your Password"
                type="password"
                value={value}
                onChange={onChange}
              />
              <span style={{ color: "red" }}>
                {formState?.errors?.password?.message}
              </span>
            </div>
          )}
        />
        <div className="flex space-x-2 items-center">
          <input className="w-6 h-6" type="checkbox" />
          <span className="text-gray-700">Keep me Signed In</span>
        </div>
        <p className="text-md">
          By creating an Account, I agree to{" "}
          <Link className="text-blue-500" to="/tos">
            Terms
          </Link>{" "}
          and{" "}
          <Link className="text-blue-500" to="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
        {/* <button
          className="border-solid border-2 bg-lightBlack p-4 text-white hover:text-lightBlack border-lightBlack hover:bg-transparent"
          onClick={handleSubmit(onSubmit)}
        >
          Sign Up
        </button> */}
        <SignUpButton
          text="Sign Up!"
          onSubmit={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
        />
        <div className="w-full flex space-x-2">
          <p className="text-md">Already a Member?</p>
          <Link className="text-2xl underline" to="/login">
            Login
          </Link>
        </div>
        <div className="w-full flex flex-col justify-between items-center">
          <p>Or</p>
          <Link
            to=""
            className="flex items-center justify-center w-full bg-white p-4 text-bold text-grey shadow-md space-x-4"
          >
            <img src={GoogleIcon} alt="google-icon" className="h-12" />
            <span>Login with Google</span>
          </Link>
        </div>
      </form>
    </section>
  );
};

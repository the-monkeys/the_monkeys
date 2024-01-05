import { Link } from "react-router-dom";
import { Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import RegisterImg from "../../../../assets/Register.jpg";
import { useRegisterForm } from "./hooks";
import { useCallback } from "react";
import { registerUser } from "../../../../redux/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import SignUpButton from "../../../../components/LoadingButton/LoadingButton";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
export const Register = () => {
  const { handleSubmit, control, formState } = useRegisterForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);

  const onSubmit = useCallback(
    (data) => {
      dispatch(registerUser(data)).then((response) => {
        if (response && response.type === "auth/registerUser/fulfilled") {
          toast.success("Registered successfully");
          navigate("/");
          return;
        }

        if (response && response.type === "auth/registerUser/rejected") {
          toast.error("Something went wrong");
        }
      });
    },
    [dispatch, navigate]
  );

  return (
    <section data-testid="register" className="bg-white">
      <div className="container h-full px-6 md:py-24 py-4 w-[80%] m-auto">
        <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
          {/* Left column container with background*/}
          <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
            <img src={RegisterImg} className="w-full" alt="illustration" />
          </div>
          {/* Right column container with form */}
          <div className="md:w-8/12 md:mt-0 -mt-12 lg:ml-6 lg:w-5/12 border p-12 rounded-lg">
            <form onSubmit={(e) => e.preventDefault()}>
              {/* Email input */}
              <Controller
                name="first_name"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="relative mb-6" data-te-input-wrapper-init="">
                    <label
                      htmlFor="exampleFormControlInput3"
                      // className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:peer-focus:text-primary"
                    >
                      * First Name
                    </label>
                    <input
                      type="text"
                      className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-neutral-900 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 bg-zinc-100 shadow-inner"
                      id="exampleFormControlInput3"
                      placeholder="First Name"
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
                  <div className="relative mb-6" data-te-input-wrapper-init="">
                    <label
                      htmlFor="exampleFormControlInput3"
                      // className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:peer-focus:text-primary"
                    >
                      * Last Name
                    </label>
                    <input
                      type="text"
                      className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-neutral-900 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 bg-zinc-100 shadow-inner"
                      id="exampleFormControlInput3"
                      placeholder="Last Name"
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
                  <div className="relative mb-6" data-te-input-wrapper-init="">
                    <label
                      htmlFor="exampleFormControlInput3"
                      // className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:peer-focus:text-primary"
                    >
                      * Email address
                    </label>
                    <input
                      type="text"
                      className="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-neutral-900 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 bg-zinc-100 shadow-inner"
                      id="exampleFormControlInput3"
                      placeholder="Email address"
                      value={value}
                      onChange={onChange}
                    />
                    <span style={{ color: "red" }}>
                      {formState?.errors?.email?.message}
                    </span>
                  </div>
                )}
              />

              {/* Password input */}
              <Controller
                name="password"
                defaultValue=""
                control={control}
                render={({ field: { value, onChange } }) => (
                  <div className="relative mb-6" data-te-input-wrapper-init="">
                    <label
                      htmlFor="exampleFormControlInput33"
                      // className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:peer-focus:text-primary"
                    >
                      * Password
                    </label>
                    <input
                      type="password"
                      className="peer block min-h-[auto] w-full rounded border-0 px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none text-neutral-900 dark:placeholder:text-neutral-200 [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0 bg-neutral-100 shadow-inner"
                      id="exampleFormControlInput33"
                      placeholder="Password"
                      value={value}
                      onChange={onChange}
                    />
                    <span style={{ color: "red" }}>
                      {formState?.errors?.password?.message}
                    </span>
                  </div>
                )}
              />
              {/* Remember me checkbox */}
              <div className="mb-6 flex items-center justify-between">
                <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                  <input
                    className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-[#FF462E] checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_red]"
                    type="checkbox"
                    defaultValue=""
                    id="exampleCheck3"
                    defaultChecked=""
                  />
                  <label
                    className="inline-block pl-[0.15rem] hover:cursor-pointer"
                    htmlFor="exampleCheck3"
                  >
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
                  </label>
                </div>
              </div>
              {/* Submit button */}
              <SignUpButton text="Sign up" onSubmit={handleSubmit(onSubmit)} />
              {/* Divider */}
              <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                <p className="mx-4 mb-0 text-center font-semibold text-[#333030]">
                  OR
                </p>
              </div>
              {/* Social login buttons */}
              <a
                className="mb-3 flex w-full items-center justify-center rounded bg-primary px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-[#] shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                style={{ backgroundColor: "#fff" }}
                href="#!"
                role="button"
                data-te-ripple-init=""
                data-te-ripple-color="light"
              >
                {/* Facebook */}
                <FcGoogle className="text-2xl pr-1" />
                Continue with Google
              </a>
              {/* <a
                className="mb-3 flex w-full items-center justify-center rounded bg-info px-7 pb-2.5 pt-3 text-center text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#54b4d3] transition duration-150 ease-in-out hover:bg-info-600 hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:bg-info-600 focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] focus:outline-none focus:ring-0 active:bg-info-700 active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.3),0_4px_18px_0_rgba(84,180,211,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(84,180,211,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(84,180,211,0.2),0_4px_18px_0_rgba(84,180,211,0.1)]"
                style={{ backgroundColor: "#55acee" }}
                href="#!"
                role="button"
                data-te-ripple-init=""
                data-te-ripple-color="light"
              >
                Twitter
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
                Continue with Twitter
              </a> */}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

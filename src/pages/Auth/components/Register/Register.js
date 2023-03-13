import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterImg from "../../../../assets/register.svg";
import GoogleIcon from "../../../../assets/google-icon.svg";

export const Register = ({ isLoggedIn}) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match')
    } else {
      setPasswordError('')
      navigate('/')
      alert('Success!')
      isLoggedIn(true)
    }
    console.log(formData)
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  return (
    <section className="container mx-auto flex items-center justify-center md:justify-end">
      <div className="hidden md:block w-1/2 p-24 pl-0">
        <img className="slide" src={RegisterImg} alt="illustration" />
      </div>
      <form onSubmit={handleSubmit} 
      className="slideDown py-12 md:py-28 text-2xl md:w-1/2 md:pl-28 bg-white flex flex-col space-y-6">
        <div>
          <label>Name:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
            value={formData.name}
            onChange={handleChange}
            type="name"
            name="name"
            placeholder="Enter your Name"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
            value={formData.email}
            onChange={handleChange}
            name="email"
            type="email"
            placeholder="Enter your Email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
            value={formData.password}
            onChange={handleChange}
            type="password"
            name="password"
            placeholder="Enter your Password"
            required
          />
          {passwordError && <div className="text-red-500 mt-2">{passwordError}</div>}
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            className="border-solid border-2 border-lightBlack rounded-sm mt-2 w-full p-4"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            name="confirmPassword"
            placeholder="Re-enter your Password"
            required
          />
        </div>
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
        <button
          className="border-solid border-2 bg-lightBlack p-4 text-white hover:text-lightBlack border-lightBlack hover:bg-transparent"
          type="submit"
        >
          Sign Up
        </button>
        <div className="w-full flex space-x-2">
          <p className="text-md">Already a Member?</p>
          <Link className="text-2xl underline" to="/login">
            Login
          </Link>
        </div>
        <div className="w-full flex flex-col justify-between items-center">
          <p>Or</p>
          <Link to='' className="flex items-center justify-center w-full bg-white p-4 text-bold text-grey shadow-md space-x-4">
            <img src={GoogleIcon} alt="google-icon" className="h-12" />
            <span>Login with Google</span>
          </Link>
        </div>
      </form>
    </section>
  )
}

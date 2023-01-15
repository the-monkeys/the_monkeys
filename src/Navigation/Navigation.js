import { Link } from "react-router-dom"
export default function Navigation () {
    return (
    <nav className="relative bg-offWhite shadow-md p-3">
        <div className="container mx-auto w-full flex items-center justify-between">

        <div className="text-3xl font-bold font-dance"><Link to="/">The Monkeys'</Link></div>
        <ul className="h-full hidden md:flex items-center justify-between space-x-12">
            <Link className="navlinks" to="/">Home</Link>
            <Link className="navlinks" to="/about">About</Link>
            <Link className="navlinks" to="/#">Blog</Link>
            <Link className="navlinks" to="/contact">Contact</Link>
        </ul>
        <div className="hidden md:flex justify-between items-center space-x-6">
            <button className="p-2 px-6 pt-2 bg-transparent baseline 
             cursor-pointer border-2 border-transparent">Login</button>
            <button className="py-1 px-5 text-white bg-lightBlack baseline
             cursor-pointer rounded-md hover:bg-transparent hover:text-lightBlack border-2 hover: border-lightBlack">Sign Up
            </button>
        </div>
	 </div>
    </nav>
    )
    
}
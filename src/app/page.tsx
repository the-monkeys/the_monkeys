import Navbar from "@/components/Navbar";
import ComingSoon from "../components/ComingSoon";
import Footer from "@/components/Footer";

const Home = () => {
	return (
		<>	
			<Navbar />
		<div className="flex justify-center bg-primary-monkeyWhite dark:bg-primary-monkeyBlack">
			<ComingSoon />
		</div>
		<Footer/>
		</>

	);
};

export default Home;

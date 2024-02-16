import Navbar from "@/components/layout/Navbar";
import ComingSoon from "../components/ComingSoon";
import Footer from "@/components/layout/Footer";

const Home = () => {
	return (
		<>
			<Navbar />
			<div className="flex justify-center bg-primary-monkeyWhite dark:bg-primary-monkeyBlack">
				<ComingSoon />
			</div>
			<Footer />
		</>
	);
};

export default Home;

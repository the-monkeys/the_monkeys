import { Navigation } from './pages/shared/Navigation';
import { Footer } from './pages/shared/Footer';
import { Home } from './pages/Home/Home';
import { Legal } from './pages/Legal/Legal';
import './index.css';
import { Route, Routes } from 'react-router-dom';
import { Login } from './pages/Auth/components/Login';
import { Register } from './pages/Auth/components/Register';
import AdScript from './AdScript';
import 'izitoast-react/dist/iziToast.css';
// import { Provider } from 'react-redux';
// import store from './store';

const App = () => (
	// <Provider store={store}>
	<>
		<Navigation />
		{/* AdScript will add script tag to all the component present here */}
		<AdScript />
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/tos' element={<Legal />} />
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />
		</Routes>
		<Footer />
	</>
	// </Provider>;
);

export default App;

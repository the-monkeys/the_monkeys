import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../../store";

export const renderWithProviders = (component) => {
  return (
    <BrowserRouter>
      <Provider store={store}>{component}</Provider>
    </BrowserRouter>
  );
};

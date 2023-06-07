import { ReactComponent as Loader } from "../../assets/icons/loader.svg";
import "./LoadingButton.css";

const LoadingButton = ({ onSubmit, text, loading = false, disabled }) => {
  return (
    <button
      className="submit-btn"
      onClick={onSubmit}
      disabled={disabled}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!loading ? text : <Loader className="spinner" />}
    </button>
  );
};

export default LoadingButton;

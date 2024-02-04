import "./App.css";

function App() {
  return (
    <>
      <div className={`py-24 md:py-44 h-screen bg-white`} data-testid="home">
        <div className="text-xl container w-[85%] mx-auto flex-col-reverse md:flex-row flex items-center justify-between">
          <div className="slideLeft w-full md:w-1/2 flex-col items-center space-y-4 text-center md:text-left">
            <h2>We are Coming Soon!</h2>
            <p>
              Our Website is under construction, feel free to explore!
              <br />
              Follow us and be the first to know when we go live!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

export const Profile = () => {


  const handleWriteArticle = () => {

  }

  return (
    <div>
      <h1>This is the Profile page</h1>
      <button className="  text-2xl  py-2 px-6 text-white  bg-lightBlack baseline
            cursor-pointer rounded-sm hover:bg-transparent hover:text-lightBlack
            border-2 hover: border-lightBlack flex 	justify-content: flex-end" onClick={handleWriteArticle}>Write Article</button>
    </div>
  );
};

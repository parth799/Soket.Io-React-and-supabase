
import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-[630px] bg-[#FAF3EA] pr-[290px]">
        <h1 className="text-3xl font-bold mb-8 pl-5 ">Welcome to the ChatBot App</h1>
        <h3 className="text-2xl  pl-5">Please Login to intrect with chatbot</h3>
        {/* <Link to="/messageList">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to ChatBot
          </button>
        </Link> */}
      </div>
    </>
  );
}

export default Home;

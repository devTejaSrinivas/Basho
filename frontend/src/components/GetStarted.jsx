import { useNavigate } from "react-router-dom";

const GetStarted = ({ onClick }) => {
  return (
    <button
      className="py-4 px-6 bg-blue-gradient font-poppins font-medium text-[18px] text-primary rounded-[10px] outline-none"
      onClick={onClick}
    >
      Get Started
    </button>
  );
};

export default GetStarted;

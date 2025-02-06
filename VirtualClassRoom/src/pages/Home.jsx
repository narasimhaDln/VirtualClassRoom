import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Virtual Classroom</h1>
      <Link to="/dashboard">
        <button>Enter Classroom</button>
      </Link>
    </div>
  );
};

export default Home;

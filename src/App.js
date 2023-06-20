import "./App.css";
import Router from "./Router";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import useAuth from "./hooks/useAuth";

function App() {
  const { isLoggedIn } = useAuth();
  return (
    <div className="app">
      <ToastContainer />
      {isLoggedIn && <Navbar />}
      <Router />
    </div>
  );
}

export default App;

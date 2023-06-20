import { useEffect, useRef } from "react";
import useAxiosWrapper from "../helpers/axiosWrapper";

const Dashboard = () => {
  const { axiosWrapper } = useAxiosWrapper();
  const isfetched = useRef(true);

  useEffect(() => {
    if (isfetched.current) {
      isfetched.current = false;
      fetchCars();
    }
  }, []);

  const fetchCars = async () => {
    const resp = await axiosWrapper("/cars");

    console.log("resp:", resp);
  };
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;

import { useEffect, useRef, useState } from "react";
import useAxiosWrapper from "../helpers/axiosWrapper";
import Pagination from "../components/Pagination";
import Car from "../components/Car";
import Modal from "../components/Modal";
import CarCreateEdit from "../components/CarCreateEdit";

import "../styles/Cars.css";

const Cars = () => {
  const { axiosWrapper } = useAxiosWrapper();
  const isFetched = useRef(false);
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [carsPerPage] = useState(2);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const ref = useRef();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isFetched.current) {
      isFetched.current = true;
    } else {
      fetchCars();
    }
  }, [currentPage, carsPerPage, refetch]);

  const fetchCars = async () => {
    const resp = await axiosWrapper(
      `/cars?page=${currentPage}&itemsPerPage=${carsPerPage}`
    );

    if (resp?.status === 200) {
      setCars(resp.data?.cars);
      setTotalItems(resp.data?.totalItems);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="cars-container">
      <h2 className="cars-title">Cars</h2>
      <button className="add-button" onClick={openModal}>
        Add New Car
      </button>
      <table className="cars-table">
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Make</th>
            <th>Model</th>
            <th>Color</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cars?.map((car) => (
            <Car
              car={car}
              key={car?._id}
              setRefetch={setRefetch}
              refetch={refetch}
            />
          ))}
        </tbody>
      </table>

      <Pagination
        itemsPerPage={carsPerPage}
        totalItems={totalItems}
        paginate={paginate}
        currentPage={currentPage}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={async () => {
          const resp = await ref.current.carCreateEdit();
          if (resp) {
            setRefetch(!refetch);
            setIsModalOpen(!isModalOpen);
          }
        }} // Optional, if you want a confirmation action
        title="Create Car"
      >
        <CarCreateEdit ref={ref} />
      </Modal>
    </div>
  );
};

export default Cars;

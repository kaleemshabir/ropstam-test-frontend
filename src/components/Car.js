import Modal from "./Modal";
import { useRef, useState } from "react";
import useAxiosWrapper from "../helpers/axiosWrapper";
import { toast } from "react-toastify";
import CarCreateEdit from "./CarCreateEdit";

const Car = ({ car, setRefetch, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { axiosWrapper } = useAxiosWrapper();
  const ref = useRef();

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };
  const closeEditModal = () => {
    setIsEditOpen(false);
  };

  const deleteCar = async () => {
    const resp = await axiosWrapper(`/cars/${car._id}`, "delete");
    if (resp.status === 204) {
      setRefetch(!refetch);
      setIsModalOpen(!isModalOpen);
      setIsEditOpen(!isEditOpen);
      toast("Car delete successfully", {
        position: "top-center",
      });
    } else {
      toast.error(resp.error, {
        position: "top-center",
      });
    }
  };
  const editCar = async () => {
    const resp = await ref.current.carCreateEdit();
    if (resp) {
      setRefetch(!refetch);
      setIsEditOpen(!isEditOpen);
    }
  };
  return (
    <>
      <tr>
        <td>{car?.registration_no}</td>
        <td>{car?.make}</td>
        <td>{car?.model}</td>
        <td>{car?.color}</td>
        <td>{car?.category?.name}</td>
        <td className="action-column">
          <button
            className="action-button edit-button"
            onClick={() => {
              setIsEditOpen(!isEditOpen);
            }}
          >
            Edit
          </button>
          <button
            className="action-button delete-button"
            onClick={() => setIsModalOpen(!isModalOpen)}
          >
            Delete
          </button>
        </td>
      </tr>
      <Modal
        isOpen={isModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteCar} // Optional, if you want a confirmation action
        title="Confirmation Modal"
        message="Do you want to delete? press confirm button"
      />
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        onConfirm={editCar} // Optional, if you want a confirmation action
        title="Edit car"
      >
        <CarCreateEdit ref={ref} carPayload={car} isEdit={true} />
      </Modal>
    </>
  );
};

export default Car;

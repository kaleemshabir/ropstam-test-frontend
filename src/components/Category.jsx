import Modal from "./Modal";
import { useState } from "react";
import useAxiosWrapper from "../helpers/axiosWrapper";
import { toast } from "react-toastify";

const Category = ({ category, setRefetch, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [name, setName] = useState(category?.name);
  const [error, setError] = useState();
  const { axiosWrapper } = useAxiosWrapper();

  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };
  const closeEditModal = () => {
    setIsEditOpen(false);
    setName(category?.name);
  };

  const deleteCategory = async () => {
    const resp = await axiosWrapper(`/categories/${category._id}`, "delete");
    if (resp?.status === 204) {
      setRefetch(!refetch);
      setIsModalOpen(!isModalOpen);
      toast("Category delete successfully", {
        position: "top-center",
      });
    }
  };
  const editCategory = async () => {
    if (name) {
      const resp = await axiosWrapper(`/categories/${category._id}`, "patch", {
        name: name,
      });
      if (resp?.status === 200) {
        setRefetch(!refetch);
        setIsEditOpen(!isEditOpen);
        toast("Category edited successfully", {
          position: "top-center",
        });
      }
    } else {
      setError("Name cannot be empty");
    }
  };
  return (
    <>
      <tr>
        <td>{category.createdAt?.split("T")[0]}</td>
        <td>{category.name}</td>
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
        onConfirm={deleteCategory} // Optional, if you want a confirmation action
        title="Confirmation Modal"
        message="Do you want to delete? press confirm button"
      />
      <Modal
        isOpen={isEditOpen}
        onClose={closeEditModal}
        onConfirm={editCategory} // Optional, if you want a confirmation action
        title="Edit Category"
      >
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p style={{ color: "red" }}>{error}</p>
        </div>
      </Modal>
    </>
  );
};

export default Category;

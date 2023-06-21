import { useEffect, useRef, useState } from "react";
import useAxiosWrapper from "../helpers/axiosWrapper";
import Pagination from "../components/Pagination";
import Category from "../components/Category";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import "../styles/Categories.css";

const Categories = () => {
  const { axiosWrapper } = useAxiosWrapper();
  const isFetched = useRef(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState();

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
      const fetchCategories = async () => {
        const resp = await axiosWrapper(
          `/categories?page=${currentPage}&itemsPerPage=${categoriesPerPage}`
        );

        if (resp?.status === 200) {
          setCategories(resp.data?.categories);
          setTotalItems(resp.data?.totalItems);
        }
      };
      fetchCategories();
    }
  }, [currentPage, categoriesPerPage, refetch]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const changeItemsPerPage = (value) => {
    setCategoriesPerPage(value);
    setCurrentPage(1);
  };
  const createCategory = async () => {
    if (name.trim()) {
      const resp = await axiosWrapper("/categories", "post", {
        name: name.trim(),
      });
      if (resp.status === 201) {
        setRefetch(!refetch);
        setIsModalOpen(!isModalOpen);
        setName();
        toast("Category created successfully", {
          position: "top-center",
        });
      }
    } else {
      setError("Name cannot be empty");
    }
  };

  return (
    <div className="categories-container">
      <h2 className="categories-title">Car Categories</h2>
      <button className="add-button" onClick={openModal}>
        Add New Category
      </button>
      <table className="categories-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category) => (
            <Category
              category={category}
              key={category?._id}
              setRefetch={setRefetch}
              refetch={refetch}
            />
          ))}
        </tbody>
      </table>

      <Pagination
        itemsPerPage={categoriesPerPage}
        totalItems={totalItems}
        paginate={paginate}
        changeItemsPerPage={changeItemsPerPage}
        currentPage={currentPage}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={createCategory} // Optional, if you want a confirmation action
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
    </div>
  );
};

export default Categories;

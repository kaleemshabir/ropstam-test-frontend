import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import useAxiosWrapper from "../helpers/axiosWrapper";
import { toast } from "react-toastify";
import "../styles/CarCreateEdit.css";

const CarCreateEdit = forwardRef(({ carPayload, isEdit = false }, ref) => {
  const [carData, setCarData] = useState({
    color: "",
    make: "",
    model: "",
    registration_no: "",
    category: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const { axiosWrapper } = useAxiosWrapper();
  const [categories, setCategories] = useState([]);
  const isFetched = useRef(false);

  const { color, make, model, registration_no, category } = carData;
  useImperativeHandle(ref, () => ({
    async carCreateEdit() {
      const fields = {
        model: "Model is required",
        make: "Make is required",
        registration_no: "Reg No. is required",
        category: "Category is required",
      };

      const validateField = (field, minLength) => {
        if (!carData[field]) {
          addValidationError(field, fields[field]);
        } else if (carData[field].length < minLength) {
          fields[field] = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } must be at least ${minLength} characters long`;
        } else {
          fields[field] = undefined;
        }
      };

      validateField("model", 3);
      validateField("make", 3);
      validateField("registration_no", 3);
      validateField("category", 1);

      setValidationErrors(fields);

      if (Object.keys(fields).every((field) => !fields[field])) {
        const method = !isEdit ? "post" : "patch";
        const url = !isEdit ? "/cars" : `/cars/${carPayload?._id}`;
        const resp = await axiosWrapper(url, method, {
          model,
          registration_no,
          color: color || undefined,
          make,
          category,
        });
        if (resp?.status === 201 || resp?.status === 200) {
          setCarData({
            model: "",
            registration_no: "",
            color: "",
            make: "",
            category: "",
          });
          toast(`Car ${!isEdit ? "created" : "updated"} successfully`, {
            position: "top-center",
          });
          return true;
        } else {
          toast.error(resp?.error, { position: "top-center" });
          return;
        }
      }
      return;
    },
  }));

  useEffect(() => {
    if (!isFetched.current) {
      isFetched.current = true;
      if (isEdit) {
        setCarData(carPayload);
      }
      fetchCategories();
    }
  }, []);
  const addValidationError = (field, message) => {
    setValidationErrors((prev) => ({ ...prev, [field]: message }));
  };

  const fetchCategories = async () => {
    const resp = await axiosWrapper(`/categories?all=true`);

    if (resp?.status === 200) {
      setCategories(resp.data?.categories);
    }
  };
  const onChange = (e) => {
    const { name, value } = e.target;
    setCarData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  return (
    <div className="car-form">
      <div className="form-group">
        <label>Reg No:</label>
        <input
          type="text"
          name="registration_no"
          value={carData.registration_no}
          onChange={(e) => onChange(e)}
        />
      </div>
      <p className="error">{validationErrors?.registration_no}</p>

      <div className="form-group">
        <label>Model:</label>
        <input
          type="text"
          name="model"
          value={carData.model}
          onChange={(e) => onChange(e)}
        />
      </div>
      <p className="error">{validationErrors?.model}</p>

      <div className="form-group">
        <label>Make:</label>
        <input
          type="text"
          name="make"
          value={carData.make}
          onChange={(e) => onChange(e)}
        />
      </div>
      <p className="error">{validationErrors?.make}</p>

      <div className="form-group">
        <label>Color:</label>
        <input
          type="text"
          name="color"
          value={carData.color}
          onChange={(e) => onChange(e)}
        />
      </div>

      <div className="form-group">
        <label>Category:</label>
        <select
          onChange={(e) => onChange(e)}
          name="category"
          value={carData.category?._id}
        >
          <option value={""}>Select category</option>
          {categories?.map((c) => (
            <option value={c?._id} key={c?._id}>
              {c?.name}
            </option>
          ))}
        </select>
      </div>
      <p className="error">{validationErrors?.category}</p>
    </div>
  );
});

export default CarCreateEdit;

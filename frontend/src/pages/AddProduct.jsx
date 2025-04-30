import {
  Modal,
  Button,
  TextInput,
  FileInput,
  Datepicker,
  Alert,
} from "flowbite-react";
import { useState, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function AddProduct({ openModal, setOpenModal, onProductAdded }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [itemCodeStart, setItemCodeStart] = useState("");
  const [itemCodeEnd, setItemCodeEnd] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const quillRef = useRef();

  const validateForm = () => {
    const requiredFields = [
      "category",
      "supplierName",
      "itemName",
      "price",
      "itemImage",
      "quantity",
      "purchaseDate",
      "expiryDate",
      "description",
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        return `All fields are required.`;
      }
    }

    if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      return "Price must be a valid number greater than 0.";
    }

    if (!Number.isInteger(Number(formData.quantity)) || formData.quantity <= 0) {
      return "Quantity must be a valid integer greater than 0.";
    }

    if (
      !Number.isInteger(Number(itemCodeStart)) ||
      !Number.isInteger(Number(itemCodeEnd)) ||
      itemCodeStart <= 0 ||
      itemCodeEnd <= 0
    ) {
      return "Item code start and end must be valid positive integers.";
    }

    if (parseInt(itemCodeStart) > parseInt(itemCodeEnd)) {
      return "Item code start must be less than or equal to item code end.";
    }

    return null;
  };

  const handleImageUpload = () => {
    if (!file) {
      setUploadError("Please select an image.");
      return;
    }
    setUploadError(null);
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}-${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      () => {
        setUploadError("Upload failed. Please try again.");
        setUploadProgress(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadProgress(null);
          setUploadError(null);
          setFormData((prevData) => ({ ...prevData, itemImage: downloadURL }));
        });
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    const itemCodeArray = Array.from(
      { length: itemCodeEnd - itemCodeStart + 1 },
      (_, i) => (parseInt(itemCodeStart) + i).toString()
    );

    const finalData = { ...formData, itemCode: itemCodeArray };

    try {
      const res = await fetch("/api/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalData),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || "Server error.");
        return;
      }
      setSubmitError(null);
      onProductAdded();
      setOpenModal(false);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Add Product</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <TextInput
            placeholder="Category"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                category: e.target.value,
              }))
            }
          />
          <TextInput
            placeholder="Supplier Name"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                supplierName: e.target.value,
              }))
            }
          />
          <TextInput
            placeholder="Item Name"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                itemName: e.target.value,
              }))
            }
          />
          <TextInput
            placeholder="Price"
            type="number"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                price: e.target.value,
              }))
            }
          />
          <div className="flex gap-2 items-center">
            <FileInput
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button
              type="button"
              size="xs"
              outline
              gradientDuoTone="cyanToBlue"
              onClick={handleImageUpload}
            >
              {uploadProgress ? (
                <div className="w-12 h-12">
                  <CircularProgressbar
                    value={uploadProgress}
                    text={`${uploadProgress}%`}
                  />
                </div>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
          {uploadError && <Alert color="failure">{uploadError}</Alert>}
          {formData.itemImage && (
            <img
              src={formData.itemImage}
              alt="Uploaded"
              className="h-32 object-cover mt-2"
            />
          )}
          <TextInput
            placeholder="Quantity"
            type="number"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                quantity: e.target.value,
              }))
            }
          />
          <div className="flex gap-2">
            <TextInput
              placeholder="Item Code Start"
              type="number"
              onChange={(e) => setItemCodeStart(e.target.value)}
            />
            <TextInput
              placeholder="Item Code End"
              type="number"
              onChange={(e) => setItemCodeEnd(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Datepicker
              placeholder="Purchase Date"
              onSelectedDateChanged={(date) =>
                setFormData((prevData) => ({
                  ...prevData,
                  purchaseDate: date,
                }))
              }
            />
            <Datepicker
              placeholder="Expiry Date"
              onSelectedDateChanged={(date) =>
                setFormData((prevData) => ({
                  ...prevData,
                  expiryDate: date,
                }))
              }
            />
          </div>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            placeholder="Product Description"
            onChange={(value) =>
              setFormData((prevData) => ({
                ...prevData,
                description: value,
              }))
            }
          />
          <Button type="submit" gradientDuoTone="greenToBlue">
            Add Product
          </Button>
          {submitError && <Alert color="failure">{submitError}</Alert>}
        </form>
      </Modal.Body>
    </Modal>
  );
}

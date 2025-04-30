import {
  Modal,
  Button,
  TextInput,
  FileInput,
  Datepicker,
  Alert,
} from "flowbite-react";
import { useState, useRef } from "react";
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

export default function AddSupply({ openModal, setOpenModal, onSupplyAdded }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitError, setSubmitError] = useState(null);

  // Validate the form inputs
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

    return null;
  };

  // Handle image upload to Firebase Storage
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
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    try {
      const res = await fetch("/api/supply/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Send form data to backend
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.message || "Server error.");
        return;
      }
      setSubmitError(null);
      onSupplyAdded(); // Call the callback when supply is added
      setOpenModal(false); // Close modal after submission
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Add Supply</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          {/* Category Input */}
          <TextInput
            placeholder="Category"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                category: e.target.value,
              }))
            }
          />
          {/* Supplier Name Input */}
          <TextInput
            placeholder="Supplier Name"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                supplierName: e.target.value,
              }))
            }
          />
          {/* Item Name Input */}
          <TextInput
            placeholder="Item Name"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                itemName: e.target.value,
              }))
            }
          />
          {/* Price Input */}
          <TextInput
            placeholder="Price"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                price: e.target.value,
              }))
            }
          />
          {/* Image Upload Section */}
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
          {/* Display upload error */}
          {uploadError && <Alert color="failure">{uploadError}</Alert>}
          {/* Display uploaded image */}
          {formData.itemImage && (
            <img
              src={formData.itemImage}
              alt="Uploaded"
              className="h-32 object-cover mt-2"
            />
          )}
          {/* Quantity Input */}
          <TextInput
            placeholder="Quantity"
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                quantity: e.target.value,
              }))
            }
          />
          {/* Datepickers for purchase and expiry dates */}
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
          {/* Submit Button */}
          <Button type="submit" gradientDuoTone="greenToBlue">
            Add Supply
          </Button>
          {/* Display submit error */}
          {submitError && <Alert color="failure">{submitError}</Alert>}
        </form>
      </Modal.Body>
    </Modal>
  );
}

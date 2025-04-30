import { useState, useEffect, useRef } from 'react';
import { Button, TextInput, Modal, Alert, FileInput, Datepicker } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';  

const EditSupply = ({ openModal, setOpenModal, supply, onSupplyUpdated }) => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    category: '',
    itemName: '',
    supplierName: '',
    price: '',
    quantity: '',
    purchaseDate: '',
    expiryDate: '',
    itemImage: '',
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    if (supply) {
      setFormData({
        category: supply.category || '',
        itemName: supply.itemName || '',
        supplierName: supply.supplierName || '',
        price: supply.price || '',
        quantity: supply.quantity || '',
        purchaseDate: supply.purchaseDate ? supply.purchaseDate.split('T')[0] : '',
        expiryDate: supply.expiryDate ? supply.expiryDate.split('T')[0] : '',
        itemImage: supply.itemImage || '',
      });
    }
  }, [supply]);

  const handleEdit = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem('user'))?._id;
  
      const res = await fetch(`/api/supply/update/${supply._id}/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        onSupplyUpdated();  
        setOpenModal(false);  
        navigate('/dashboard?tab=supplys'); 
      } else {
        setSubmitError(data.error || "Failed to update supply.");
      }
    } catch (error) {
      console.error('Error editing supply:', error);
      setSubmitError('Something went wrong while updating the supply.');
    }
  };  
  
  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Edit Supply</Modal.Header>
      <Modal.Body>
        <form className="flex flex-col gap-3  " onSubmit={handleEdit}>
          <label className="text-lg font-bold"  htmlFor="category">Category</label>
          <TextInput id="category" value={formData.category} required onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))} />

          <label className="text-lg font-bold" htmlFor="supplierName">Supplier Name</label>
          <TextInput id="supplierName" value={formData.supplierName} required onChange={(e) => setFormData((prev) => ({ ...prev, supplierName: e.target.value }))} />

          <label className="text-lg font-bold" htmlFor="itemName">Item Name</label>
          <TextInput id="itemName" value={formData.itemName} required onChange={(e) => setFormData((prev) => ({ ...prev, itemName: e.target.value }))} />

          <label className="text-lg font-bold" htmlFor="price">Price</label>
          <TextInput id="price" type="number" value={formData.price} required onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))} />

          <label className="text-lg font-bold" htmlFor="itemImage">Upload Image</label>
          <div className="flex gap-2 items-center">
            <FileInput accept="image/*" onChange={(e) => setFile(e.target.files[0])} id="itemImage" />
          </div>
          {uploadError && <Alert color="failure">{uploadError}</Alert>}
          {formData.itemImage && <img src={formData.itemImage} alt="Uploaded" className="h-32 object-cover rounded" />}

          <label className="text-lg font-bold" htmlFor="quantity">Quantity</label>
          <TextInput id="quantity" type="number" value={formData.quantity} required onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))} />

          <label className="text-lg font-bold" htmlFor="purchaseDate">Purchase Date</label>
          <Datepicker id="purchaseDate" value={formData.purchaseDate} onSelectedDateChanged={(date) => setFormData((prev) => ({ ...prev, purchaseDate: date }))} />

          <label className="text-lg font-bold" htmlFor="expiryDate">Expiry Date</label>
          <Datepicker id="expiryDate" value={formData.expiryDate} onSelectedDateChanged={(date) => setFormData((prev) => ({ ...prev, expiryDate: date }))} />

          <div className="flex gap-2 justify-end">
            <Button type="button" color="gray" onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="submit" gradientDuoTone="greenToBlue">Save Changes</Button>
          </div>
          {submitError && <Alert color="failure">{submitError}</Alert>}
        </form>
      </Modal.Body> 
    </Modal>
  );
};

export default EditSupply;

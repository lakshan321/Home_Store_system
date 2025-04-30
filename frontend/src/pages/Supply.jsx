import { useState, useEffect } from "react";
import { Button, Table, TextInput } from "flowbite-react";
import AddSupply from "../pages/AddSupply"; 
import { useSelector } from 'react-redux';
import EditSupply from "../pages/EditSupply";

export default function Supply() {
  const [supplys, setSupplys] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);  
  const [openEditModal, setOpenEditModal] = useState(false);
  const [supplyToEdit, setSupplyToEdit] = useState(null);

  useEffect(() => {
    fetchSupplys();
  }, []);

  const fetchSupplys = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/supply/all`);
      const data = await res.json();
      setSupplys(data.supplys);
    } catch (error) {
      console.error("Error fetching supplys:", error);
    } 
  };

  const handleDelete = async (supplyId) => {
    try {
      const res = await fetch(`/api/supply/delete/${supplyId}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setSupplys((prev) =>
        prev.filter((supply) => supply._id !== supplyId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (supply) => {
    setSupplyToEdit(supply); 
    setOpenEditModal(true); 
  };

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Supplies</h1>
        <Button onClick={() => setOpenAddModal(true)}>Add Supplies</Button>
      </div>

      <TextInput
        placeholder="Search..."
        className="mb-5"
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="overflow-x-auto">
        <Table hoverable striped>
          <Table.Head>
            <Table.HeadCell className="text-lg font-semibold">Name</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Supplier</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Price</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Quantity</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Exp Date</Table.HeadCell>
            <Table.HeadCell className="text-lg font-semibold">Action</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {supplys && supplys.length > 0 ? (
              supplys
                .filter((supply) => {
                  return (
                    supply.itemName.toLowerCase().includes(search.toLowerCase()) ||
                    supply.supplierName.toLowerCase().includes(search.toLowerCase())
                  );
                })
                .map((supply) => (
                  <Table.Row
                    key={supply._id}
                    className="bg-white border-b hover:bg-gray-100 transition-colors duration-200"
                  >
                    <Table.Cell className="py-3 px-7">{supply.itemName}</Table.Cell>
                    <Table.Cell className="py-3 px-7">{supply.supplierName}</Table.Cell>
                    <Table.Cell className="py-3 px-7">${supply.price}</Table.Cell>
                    <Table.Cell className="py-3 px-7">{supply.quantity}</Table.Cell>
                    <Table.Cell className="py-3 px-7">{new Date(supply.expiryDate).toISOString().split('T')[0]}</Table.Cell>
                    <Table.Cell className="py-3 px-7 flex gap-2">
                      <Button
                        color="failure"
                        size="xs"
                        className="uppercase text-sm" 
                        onClick={() => handleDelete(supply._id)}
                      >
                        Delete
                      </Button>
                      <Button
                        color="blue"
                        size="xs"
                        className="uppercase text-sm text-white"
                        onClick={() => handleEdit(supply)} 
                      >
                        Edit
                      </Button>
                    </Table.Cell>
                    <Table.Cell className="py-3 px-7 hidden">{supply.category}</Table.Cell>
                    <Table.Cell className="py-3 px-7 hidden">{supply.itemImage}</Table.Cell>
                    <Table.Cell className="py-3 px-7 hidden">{new Date(supply.purchaseDate).toISOString().split('T')[0]}</Table.Cell>
                  </Table.Row>
                ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="6" className="text-center py-4">
                  No supplys found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      <AddSupply
        openModal={openAddModal}
        setOpenModal={setOpenAddModal}
        onSupplyAdded={fetchSupplys}
      />

      {openEditModal && (
        <EditSupply
          openModal={openEditModal}
          setOpenModal={setOpenEditModal}
          supply={supplyToEdit} 
          onSupplyUpdated={fetchSupplys} 
        />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Button, Table, TextInput } from "flowbite-react";
import AddProduct from "../pages/AddProduct"; 
import { useSelector } from 'react-redux';
import EditProduct from "../pages/EditProduct";

export default function Product() {
  const [products, setProducts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [search, setSearch] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);  
  const [openEditModal, setOpenEditModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/product/all`);
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const res = await fetch(`/api/product/delete/${productId}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setProducts((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEdit = (product) => {
    setProductToEdit(product); 
    setOpenEditModal(true); 
  };

  return (
    <div className="p-5 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setOpenAddModal(true)}>Add Product</Button>
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
            {products && products.length > 0 ? (
              products.map((product) => (
                <Table.Row
                  key={product._id}
                  className="bg-white border-b hover:bg-gray-100 transition-colors duration-200"
                >
                  <Table.Cell className="py-3 px-7">{product.itemName}</Table.Cell>
                  <Table.Cell className="py-3 px-7">{product.supplierName}</Table.Cell>
                  <Table.Cell className="py-3 px-7">${product.price}</Table.Cell>
                  <Table.Cell className="py-3 px-7">{product.quantity}</Table.Cell>
                  <Table.Cell className="py-3 px-7">{new Date(product.expiryDate).toISOString().split('T')[0]}</Table.Cell>
                  <Table.Cell className="py-3 px-7 flex gap-2">
                    <Button
                      color="failure"
                      size="xs"
                      className="uppercase text-sm" 
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      color="blue"
                      size="xs"
                      className="uppercase text-sm text-white"
                      onClick={() => handleEdit(product)} 
                    >
                      Edit
                    </Button>
                  </Table.Cell>
                  <Table.Cell className="py-3 px-7 hidden">{product.category}</Table.Cell>
                  <Table.Cell className="py-3 px-7 hidden">{product.itemImage}</Table.Cell>
                  <Table.Cell className="py-3 px-7 hidden">{product.itemCode}</Table.Cell>
                  <Table.Cell className="py-3 px-7 hidden">{new Date(product.purchaseDate).toISOString().split('T')[0]}</Table.Cell>
                  <Table.Cell className="py-3 px-7 hidden">{product.description}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell colSpan="6" className="text-center py-4">
                  No products found.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>

      <AddProduct
        openModal={openAddModal}
        setOpenModal={setOpenAddModal}
        onProductAdded={fetchProducts}
      />

      <EditProduct
        openModal={openEditModal}
        setOpenModal={setOpenEditModal}
        product={productToEdit} 
        onProductUpdated={fetchProducts} 
      />
    </div>
  );
}  

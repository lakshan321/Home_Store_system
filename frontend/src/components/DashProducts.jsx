import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProducts() {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/product/getproducts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
          if (data.products.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchProducts();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = products.length;
    try {
      const res = await fetch(
        `/api/product/getproducts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts((prev) => [...prev, ...data.products]);
        if (data.products.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteProduct = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/product/deleteproduct/${productIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setProducts((prev) => prev.filter((product) => product._id !== productIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3">
      {currentUser.isAdmin && products.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Product Name</Table.HeadCell>
              <Table.HeadCell>Image</Table.HeadCell>
              <Table.HeadCell>Price</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {products.map((product) => (
              <Table.Body className="divide-y" key={product._id}>
                <Table.Row>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>
                    <img src={product.image} alt={product.name} className="w-20 h-10 object-cover" />
                  </Table.Cell>
                  <Table.Cell>${product.price}</Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setProductIdToDelete(product._id);
                      }}
                      className="text-red-500 cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="text-blue-500" to={`/update-product/${product._id}`}>
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-blue-500 py-3">
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No products available.</p>
      )}

      <Modal show={showModal} onClose={() => setShowModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg">Are you sure you want to delete this product?</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteProduct}>
                Yes, Delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

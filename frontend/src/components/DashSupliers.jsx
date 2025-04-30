import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function RoleManagement() {
  const { currentUser } = useSelector((state) => state.user);
  const [roles, setRoles] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`/api/addrole/getRoles`);
        const data = await res.json();
        if (res.ok) {
          setRoles(data.AddRoles); 
          if (data.AddRoles.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser?.isAdmin) {
      fetchRoles();
    }
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = roles.length;
    try {
      const res = await fetch(`/api/addrole/getRoles?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setRoles((prev) => [...prev, ...data.AddRoles]); 
        if (data.AddRoles.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteRole = async () => {
    try {
      const res = await fetch(`/api/addrole/delete/${roleIdToDelete}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setRoles((prev) => prev.filter((role) => role._id !== roleIdToDelete));
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && roles.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {roles.map((role) => (
              <Table.Body className="divide-y" key={role._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>{new Date(role.createdAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>{role.supplierName}</Table.Cell>
                  <Table.Cell>{role.supUsername}</Table.Cell>
                  <Table.Cell>{role.supEmail}</Table.Cell>
                  <Table.Cell>{role.role}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setRoleIdToDelete(role._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>No roles found!</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this role?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteRole}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { FaTrash, FaTimes, FaEdit, FaCheck } from "react-icons/fa"
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice";
import {toast} from "react-toastify"
import Message from "../../components/Message";
import Loader from "../../components/Loader";



const UserListPage = () => {
    const { data: users, refetch, isLoading, error } = useGetUsersQuery();
    const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation()
    
    const deleteHandler = async (id) => {
        if(window.confirm("Are you sure?")){
            try {
                await deleteUser(id).unwrap();
                toast.success("User deleted!");
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
    }
    return (
        <>
            <h1>Users</h1>
            {loadingDelete && <Loader className="my-2"/>}
            {isLoading ? <Loader /> : error ? (<Message variant="danger">{error?.data?.message || error.error}</Message>) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th>MORE</th>
                        </tr>

                    </thead>
                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key={user._id}>
                                    <td>{user._id}</td>
                                    <td>{user.name}</td>
                                    <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                        
                                    
                                    <td>{user.isAdmin ? (
                                        <FaCheck style={{color: "green"}} />
                                    ) : (
                                        <FaTimes style={{color: "red"}} />
                                    )}</td>
                                    
                                    <td>
                                        <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                            <Button variant="primary" className="btn-sm mx-2 my-2"><FaEdit /></Button>
                                        </LinkContainer>
                                        <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}><FaTrash style={{color: "white"}}></FaTrash></Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            )}

        </>
    )

}

export default UserListPage;
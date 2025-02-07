import { useEffect, useState } from "react";
import styles from "../../../styles/AdminUsers.module.scss";
import { useGetUsersQuery, useUpdateUserMutation } from "../../../api/users";
import toast from "react-hot-toast";
import Loading from "../../../components/Loading";
import { UserResponseType } from "../../../types";

const AdminUsers = () => {
  const {data,isSuccess,isError,error,isLoading,refetch} = useGetUsersQuery(undefined,{pollingInterval:500,refetchOnFocus:true,refetchOnReconnect:true})
  const [users, setUsers] = useState<UserResponseType[]>([]);
  const [updateUser,{isLoading:updateLoading,isError:updateIsError,error:updateError,isSuccess:updateIsSuccess,data:updateData}]=useUpdateUserMutation()

  const toggleUserStatus = (id: string) => {
    const userToUpdate = users.find((user) => user.id === id)
    if (!userToUpdate) return
    const updatedStatus = !userToUpdate.isActive;
    updateUser({'id':id,'isActive':updatedStatus})


  };
  useEffect(() => {
    if (isSuccess) {
      if (Array.isArray(data)) {
        setUsers(data)
      }
        
    }
    if (isError) {
      if ('data' in error) {
        const msg:string = error.data as string
        toast.error(msg)
      }
    }
  },[isSuccess,isError,data])
  
  useEffect(() => {
    if (updateIsSuccess) {
      console.log(updateData)
      toast.success(updateData)
      refetch()
    }
    if (updateIsError) {
      if ('data' in updateError) {
        const msg:string = updateError.data as string
        toast.error(msg)
      }
    }
  },[updateIsError,updateIsSuccess])
  return (
    <div className={styles.usersContainer}>{
      isLoading ?
        <Loading /> :
        
          users.length <= 0 ?
          <p> no user found</p>
          :
            <>
              <h2 className={styles.title}>Manage Users</h2>
              <table className={styles.userTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className={!user.isActive ? styles.inactiveRow : ""}>
                      <td>{index + 1}</td>
                      <td>{user.first_name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={user.isActive ? styles.active : styles.inactive}>
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                        className={`${styles.actionButton} ${styles.deactivate}`}
                        onClick={() => toggleUserStatus(user.id)}
                        >
                        {
                          updateLoading? <Loading/>:
                          user.isActive ? "Deactivate" : "Activate"
                        }
                        </button>
                        <button className={`${styles.actionButton} ${styles.more}`}>More</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
        }
        
    </div>
  );
};

export default AdminUsers;

import { useState } from "react";
import styles from "../../../styles/AdminUsers.module.scss";

interface User {
  id: number;
  firstName: string;
  email: string;
  isActive: boolean;
}

const initialUsers: User[] = [
  { id: 1, firstName: "Alice", email: "alice@example.com", isActive: true },
  { id: 2, firstName: "Bob", email: "bob@example.com", isActive: false },
  { id: 3, firstName: "Charlie", email: "charlie@example.com", isActive: true },
];

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);

  const toggleUserStatus = (id: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isActive: !user.isActive } : user
      )
    );
  };

  return (
    <div className={styles.usersContainer}>
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
              <td>{user.firstName}</td>
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
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
                <button className={`${styles.actionButton} ${styles.more}`}>More</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;

import React, { useState } from "react";
import styles from "../../../styles/CategoryPage.module.scss";

// Define the type for a category
type Category = {
  id: number;
  name: string;
};

const CategoryPage: React.FC = () => {
  // Static data for categories
  const initialCategories: Category[] = [
    { id: 1, name: "Clothes" },
    { id: 2, name: "Electronics" },
    { id: 3, name: "Furniture" },
    { id: 4, name: "Books" },
  ];

  // State to manage categories
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState<string>("");

  // Handle editing a category
  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  // Handle saving an edited category
  const handleSave = (id: number, newName: string) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, name: newName } : category
      )
    );
    setEditingId(null);
  };

  // Handle deleting a category
  const handleDelete = (id: number) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  // Handle adding a new category
  const handleAdd = () => {
    if (newCategory.trim()) {
      const newId = categories.length + 1;
      setCategories([...categories, { id: newId, name: newCategory }]);
      setNewCategory("");
    }
  };

  return (
    <div className={styles.categoryPage}>
      <h1>Category Management</h1>

      {/* Add New Category Section */}
      <div className={styles.addCategory}>
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category"
        />
        <button onClick={handleAdd}>Add Category</button>
      </div>

      {/* Categories Table */}
      <table className={styles.categoryTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>
                {editingId === category.id ? (
                  <input
                    type="text"
                    defaultValue={category.name}
                    onBlur={(e) => handleSave(category.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSave(category.id, e.target.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  category.name
                )}
              </td>
              <td>
                {editingId === category.id ? (
                  <button
                    className={styles.saveButton}
                    onClick={() =>
                      handleSave(
                        category.id,
                        (document.querySelector("input") as HTMLInputElement)
                          .value
                      )
                    }
                  >
                    Save
                  </button>
                ) : (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(category.id)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(category.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryPage;
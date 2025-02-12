import React, { useState } from "react";
import styles from '../../../styles/SubCategory.module.scss'
import { FaTshirt, FaDesktop, FaCouch, FaBook } from "react-icons/fa";

// Define the type for a subcategory
type Subcategory = {
  id: number;
  name: string;
  categoryId: number; // Parent category ID
};

// Define the type for a category
type Category = {
  id: number;
  name: string;
};

const SubcategoryPage: React.FC = () => {
  // Static data for categories
  const categories: Category[] = [
    { id: 1, name: "Clothes" },
    { id: 2, name: "Electronics" },
    { id: 3, name: "Furniture" },
    { id: 4, name: "Books" },
  ];

  // Static data for subcategories
  const initialSubcategories: Subcategory[] = [
    { id: 1, name: "T-Shirts", categoryId: 1 },
    { id: 2, name: "Laptops", categoryId: 2 },
    { id: 3, name: "Sofas", categoryId: 3 },
    { id: 4, name: "Novels", categoryId: 4 },
  ];

  // State to manage subcategories
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newSubcategory, setNewSubcategory] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Handle editing a subcategory
  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  // Handle saving an edited subcategory
  const handleSave = (id: number, newName: string) => {
    setSubcategories(
      subcategories.map((subcategory) =>
        subcategory.id === id ? { ...subcategory, name: newName } : subcategory
      )
    );
    setEditingId(null);
  };

  // Handle deleting a subcategory
  const handleDelete = (id: number) => {
    setSubcategories(subcategories.filter((subcategory) => subcategory.id !== id));
  };

  // Handle adding a new subcategory
  const handleAdd = () => {
    if (newSubcategory.trim() && selectedCategoryId !== null) {
      const newId = subcategories.length + 1;
      setSubcategories([
        ...subcategories,
        { id: newId, name: newSubcategory, categoryId: selectedCategoryId },
      ]);
      setNewSubcategory("");
      setSelectedCategoryId(null);
    }
  };

  // Get the icon for a category
  const getCategoryIcon = (categoryId: number) => {
    switch (categoryId) {
      case 1:
        return <FaTshirt />;
      case 2:
        return <FaDesktop />;
      case 3:
        return <FaCouch />;
      case 4:
        return <FaBook />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.subcategoryPage}>
      <h1>Subcategory Management</h1>

      {/* Add New Subcategory Section */}
      <div className={styles.addSubcategory}>
        <select
          value={selectedCategoryId || ""}
          onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
          placeholder="Enter new subcategory"
        />
        <button onClick={handleAdd}>Add Subcategory</button>
      </div>

      {/* Subcategories Table */}
      <table className={styles.subcategoryTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Category</th>
            <th>Subcategory Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((subcategory) => (
            <tr key={subcategory.id}>
              <td>{subcategory.id}</td>
              <td>
                {getCategoryIcon(subcategory.categoryId)}
                {categories.find((cat) => cat.id === subcategory.categoryId)?.name}
              </td>
              <td>
                {editingId === subcategory.id ? (
                  <input
                    type="text"
                    defaultValue={subcategory.name}
                    onBlur={(e) => handleSave(subcategory.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSave(subcategory.id, e.target.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  subcategory.name
                )}
              </td>
              <td>
                {editingId === subcategory.id ? (
                  <button
                    className={styles.saveButton}
                    onClick={() =>
                      handleSave(
                        subcategory.id,
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
                    onClick={() => handleEdit(subcategory.id)}
                  >
                    Edit
                  </button>
                )}
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(subcategory.id)}
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

export default SubcategoryPage;
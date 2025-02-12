import React, { useEffect, useState } from "react";
import ReactLoading from 'react-loading'
import styles from "../../../styles/CategoryPage.module.scss";
import { useAddCategoryMutation, useDeleteCategoryMutation, useGetAllCategoryQuery, useUpdateCategoryMutation } from "../../../api/category";
import toast from "react-hot-toast";

// Define the type for a category
type Category = {
  id: string;
  category: string;
};

const CategoryPage =()=>{

  // category get
  const [categories, setCategories] = useState<Category[]>([]);
  const {refetch, data:categoryData,isLoading:categoryIsLoading,isSuccess:categoryIsSuccess,isError:categoryIsError,error:categoryError} = useGetAllCategoryQuery()
  useEffect(() => {
  if(categoryIsError){
    console.log(categoryError)
  }
    if (categoryIsSuccess) {
      console.log(categoryData)
      setCategories(categoryData)
    }
},[categoryIsError,categoryIsSuccess,categoryData])


  // update category
  const [updateCategory,{data:updateData,isSuccess:updateIsSuccess,isError:updateIsError,error:updateError,isLoading:updateIsLoading}]=useUpdateCategoryMutation()
  useEffect(() => {
    if (updateIsSuccess) {
        setEditingId(null);
      toast.success(updateData)
      refetch()
    }
    if (updateIsError) {
      if('data' in updateError) toast.error(updateError?.data as string)
    }
  },[updateIsError,updateIsSuccess])

  // Handle saving an edited category
  const handleSave = (id: string, newName: string) => {
    updateCategory({id:id,category:newName})
  };

  // Handle editing a category
  const handleEdit = (id: string) => {
    setEditingId(id);
  };


  // add category
  const [addCategory,{data:addData,isLoading:dataIsLoading,isSuccess:dataIsSuccess,isError:dataIsError,error:dataError}]= useAddCategoryMutation()
  useEffect(() => {
    if (dataIsSuccess) {
    toast.success(addData)
    refetch()
    }
    if (dataIsError) {
      if('data' in dataError)toast.error(dataError?.data as string)
    }
},[dataIsSuccess,dataIsError])


    // Handle adding a new category
  const handleAdd = () => {
    if (newCategory.trim()) {
      addCategory({ category: newCategory });
      setNewCategory("");
    }
  };


  // delete category
  const [deleteCategory,{data:deleteData,isSuccess:deleteIsSuccess,isError:deleteIsError,error:deleteError}]=useDeleteCategoryMutation()
  useEffect(() => {
    if(deleteIsSuccess){
      toast.success(deleteData)
      refetch()
    }
    if (deleteIsError) {
      if('data' in deleteError)toast.success(deleteError?.data as string)
    }
  },[deleteIsError,deleteIsSuccess])
  // Handle deleting a category
  const handleDelete = (id: string) => {
    deleteCategory({id:id})
  };


  // State to manage categories
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState<string>("");




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
        {
          dataIsLoading?<ReactLoading type="bars" color="#3498db" height={50} width={50} /> 
          :
        <button onClick={handleAdd}>Add Category</button>
        }
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
          {categoryIsLoading? <ReactLoading type="bars" color="#3498db" height={50} width={50} /> :
            categories.map((category, index) => (
            <tr key={category.id}>
              <td>{index+1}</td>
              <td>
                {editingId === category.id ? (
                  <input
                    type="text"
                    defaultValue={category.category}
                    onBlur={(e) => handleSave(category.id, e.target.value)}
                    onKeyPress={(e:React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === "Enter") {
                        handleSave(category.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  category.category
                )}
              </td>
              <td>
                  {editingId === category.id ? (
                     updateIsLoading ?  <ReactLoading type="bars" color="#3498db" height={50} width={50} /> 
                        :
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
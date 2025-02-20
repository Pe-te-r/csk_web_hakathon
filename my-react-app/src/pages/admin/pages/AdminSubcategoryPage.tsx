import React, { useEffect, useState } from "react";
import styles from '../../../styles/SubCategory.module.scss'
import { useGetAllCategoryQuery } from "../../../api/category";
import { useAddSubCategoryMutation, useDeleteSubCategoryMutation, useGetAllSubCategoryQuery, useUpdateSubCategoryMutation } from "../../../api/sub_category";
import {   SubCategoryResponseDetailsType } from "../../../types";
import toast from "react-hot-toast";
import ReactLoading from 'react-loading'


const SubcategoryPage: React.FC = () => {

  // category get
  const [categories, setCategories] = useState < {id:string,category:string}[]>([]);
  const { data:categoryData,isLoading:categoryIsLoading,isSuccess:categoryIsSuccess,isError:categoryIsError,error:categoryError} = useGetAllCategoryQuery()
  useEffect(() => {
  if(categoryIsError){
    console.log(categoryError)
  }
    if (categoryIsSuccess) {
      console.log(categoryData)
      setCategories(categoryData)
    }
},[categoryIsError,categoryIsSuccess,categoryData])


// get all subcategory
  const { refetch,data: subcategoryData, isSuccess: subcategoryIsSuccess, isError: subcategoryIsError, error: subcategoryError } = useGetAllSubCategoryQuery({category_name:true})
  useEffect(() => {
    if (subcategoryIsError) {
      console.log(subcategoryError)
    }
    if (subcategoryIsSuccess) {
      console.log(subcategoryData)
      setSubcategories(subcategoryData)
    }
  },[subcategoryIsError,subcategoryIsSuccess,subcategoryData])


  // delete subcategory
const [deleteCategory,{data:deleteData,isSuccess:deleteIsSuccess,isError:deleteIsError,error:deleteError}]= useDeleteSubCategoryMutation()
  useEffect(() => {
    if(deleteIsSuccess){
      console.log('here one ')
      console.log(deleteData)
      toast.success(deleteData)
      setSubcategories([])
      refetch()
    }
    if (deleteIsError) {
      if('data' in deleteError)toast.success(deleteError?.data as string)
    }
  },[deleteIsError,deleteIsSuccess])
  // Handle deleting a subcategory
  const handleDelete = (id:string) => {
    deleteCategory({id:id})
  };

  // add subcategory
const [addSubCategory,{data:addData,isLoading:dataIsLoading,isSuccess:dataIsSuccess,isError:dataIsError,error:dataError}] = useAddSubCategoryMutation()
  useEffect(() => {
    if (dataIsSuccess) {
    toast.success(addData)
    setNewSubcategory("");
    setSelectedCategoryId(null);
    refetch()
    }
    if (dataIsError) {
      if('data' in dataError)toast.error(dataError?.data as string)

    }
},[dataIsSuccess,dataIsError])


  // Handle adding a new subcategory
  const handleAdd = () => {
    if (newSubcategory.trim() && selectedCategoryId !== null) {
      addSubCategory({'category_id':selectedCategoryId,'subcategory':newSubcategory})
    }
  };
// State to manage subcategories
const [subcategories, setSubcategories] = useState<SubCategoryResponseDetailsType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubcategory, setNewSubcategory] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Handle editing a subcategory
    const [updateCategory,{data:updateData,isSuccess:updateIsSuccess,isError:updateIsError,error:updateError}]=useUpdateSubCategoryMutation()
  useEffect(() => {
    if (updateIsSuccess) {
      setEditingId(null);
      toast.success(updateData)
      refetch()
    }
    if (updateIsError) {
      if('data' in updateError) toast.error(updateError?.data as string)
        console.log(updateError)
    }
  },[updateIsError,updateIsSuccess])

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  // Handle saving an edited subcategory
  const handleSave = (id: string, newName: string) => {
    updateCategory({id:id,subcategory:newName});
  };



  return (
    <div className={styles.subcategoryPage}>
      <h1>Subcategory Management</h1>

      {/* Add New Subcategory Section */}
      <div className={styles.addSubcategory}>
        {categoryIsLoading ?<ReactLoading type="bars" color="#3498db" height={50} width={50} /> 
        :
        <select
        value={selectedCategoryId || ""}
        onChange={(e) => setSelectedCategoryId(String(e.target.value))}
        >
          <option value="" disabled>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </select>
        }
        <input
          type="text"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
          placeholder="Enter new subcategory"
        />
        {dataIsLoading ? <ReactLoading type="bars" color="#3498db" height={50} width={50} /> :
        <button onClick={handleAdd}>Add Subcategory</button>
        }
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
          {subcategories.length < 1 ?
          <p>No sub category found</p>
          :
          subcategories.map((subcategory,index) => (
            <tr key={subcategory.id}>
              <td>{index+1}</td>
              <td>
                {subcategory.category}
              </td>
              <td>
                {editingId === subcategory.id ? (
                  <input
                    type="text"
                    defaultValue={subcategory.subcategory}
                    onBlur={(e) => handleSave(subcategory.id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSave(subcategory.id, e.currentTarget.value);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  subcategory.subcategory
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
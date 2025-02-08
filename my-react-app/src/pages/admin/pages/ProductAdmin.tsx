import { useEffect, useState } from "react";

import styles from "../../../styles/AdminProduct.module.scss";
import ProductCard from "../../../components/ProductCard"; // Assuming you have a ProductCard component
import { useGetAllCategoryQuery, useGetOneCategoryDetailsQuery } from "../../../api/category";
import ReactLoading from "react-loading";

const AdminProduct = () => {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    subcategory: "",
    price: "",
    description: "",
    image: null as File | null,
  });


  //categories
    const {data:categoryData,isSuccess:categoryIsSuccess,isError:categoryIsError,isLoading:categoryIsLoading}=useGetAllCategoryQuery()
  const [categories, setCategories] = useState<{ id: string, category: string }[]>([]);
  const [selectedCategory,setSelectedCategory]=useState<string>('')
  
  // sub categories
  const { data:subcategoryData,isLoading:subcategoryIsLoading,isSuccess:subcategoryIsSuccess,isError:subcategoryIsError } = useGetOneCategoryDetailsQuery(
    { id: selectedCategory, subcategory: true },
    { skip: !selectedCategory }
  )
  const [subcategories, setSubCategories] = useState<{ id: string, subcategory: string }[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedCategory(value)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleSubmit = () => {
    console.log("Final Submission Data:", formData);
    setShowPreview(false);
  };

  const handleBack = () => {
    setShowPreview(false);
  };

  const handleDelete = () => {
    setFormData({
      productName: "",
      category: "",
      subcategory: "",
      price: "",
      description: "",
      image: null,
    });
    setShowPreview(false);
  };

  // wait categories list
  useEffect(() => {
    if (categoryIsSuccess) {
      console.log(categoryData)
      setCategories(categoryData)
    }
  },[categoryIsError,categoryIsSuccess])

  // wait subcategoryies list
  useEffect(() => {
    if (subcategoryIsSuccess) {
      // console.log(subcategoryData.subcategories)
      if (subcategoryData && Array.isArray(subcategoryData)) {
        // const subcategories: { id: string, subcategory: string }[] = subcategoryData.subcategories[0]
        setSubCategories(subcategoryData.subcategories)

      }
    }
    if (subcategoryIsError) {
      // console.log(subcategoryError)
    }
    
  },[subcategoryIsSuccess,subcategoryIsError])
  return (
    <div className={styles.adminProductPage}>
      {!showPreview ? (
        <>
      <h2>Add New Product</h2>
        <form className={styles.productForm}>
          <div className={styles.formGroup}>
            <label>Product Name</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
          </div>

          <div className={styles.formGroup}>
              <label>Category</label>
              {categoryIsLoading ? <ReactLoading type="bars" color="#3498db" height={50} width={50} />              :
            <select name="category" value={formData.category} onChange={handleChange} required>                    
                    <option value=' '>Choose Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                      {cat.category}
                      </option>
                    ))}                  
            </select>
                  }
          </div>

          <div className={styles.formGroup}>
              <label>Sub-Category</label>
              {subcategoryIsLoading ? <ReactLoading type="bars" color="#3498db" height={50} width={50} /> :
                 <select name="subcategory" value={formData.subcategory} onChange={handleChange} required>                    
                  {selectedCategory == '' ? <option value=' '>Choose Category First</option> :
                    <option value="subcategory">Choose Subcategory</option>
                  }
                    {subcategories && subcategories.map((cat) => (
                      <option key={cat.id} value={cat.subcategory}>
                      {cat.subcategory}
                      </option>
                    ))}                  
            </select>
              }
          </div>

          <div className={styles.formGroup}>
            <label>Price ($)</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label>Product Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} required />
            {formData.image && <img src={URL.createObjectURL(formData.image)} alt="Preview" />}
          </div>

          <button type="button" onClick={handlePreview} className={styles.submitBtn}>Preview Product</button>
          </form>
                  </>

      ) : (
        <div className={styles.previewModal}>
          <h3 className={styles.modalHeader}>Product Preview</h3>
            <div className={styles.modalContent}>
              
            <ProductCard
            product={formData.productName}
            sub_category={formData.subcategory}
            price={Number(formData.price)}
            description={formData.description}
            img_path={formData.image ? URL.createObjectURL(formData.image) : ""}
            />
            
            </div>
          <div className={styles.previewActions}>
            <button onClick={handleSubmit} className={styles.submitBtn}>Submit</button>
            <button onClick={handleBack} className={styles.backBtn}>Back</button>
            <button onClick={handleDelete} className={styles.deleteBtn}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;

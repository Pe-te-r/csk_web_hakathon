import React, {  useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import styles from "../styles/ProductPage.module.scss";


import { useGetAllProductQuery } from "../api/product";
import Loading from "../components/Loading";
import { ProductRequestType } from "../types";


const ProductsPage: React.FC = () => {
  const [product,setProduct]=useState<ProductRequestType[]>([])
  // product
  const { data,error,isLoading,isSuccess,isError }=useGetAllProductQuery()
  // search
    const [searchTerm, setSearchTerm] = useState("");
    const filteredProducts = product.filter((p) =>
        p.product.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  useEffect(() => {
    if (isSuccess) {
      console.log(data)
      setProduct(data)
    }
    if (isError) {
      console.log(error)
    }
  },[isSuccess,isError])
  

    return (
        <div className={styles.productsPage}>
      <h1>Our Products</h1>
      <input
        type="text"
        placeholder="Search for a product..."
                className={styles.searchBar}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
        {
       isLoading ? <Loading /> :
        
            <div className={styles.productList}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod, index) => <ProductCard key={index} {...prod} />)
              ) : (
                <p className={styles.noResults}>No products found</p>
              )}
            </div>}
    </div>
  );
};

export default ProductsPage;

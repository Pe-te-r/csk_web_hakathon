import React, { useState } from "react";
import ProductCard from "../components/ProductCard";
import styles from "../styles/ProductPage.module.scss";

const fakeProducts = [
  {
    sub_category: "Electronics",
    product: "Wireless Headphones",
    img_path: "https://via.placeholder.com/150",
    price: 99.99,
    description: "High-quality wireless headphones with noise cancellation.",
  },
  {
    sub_category: "Fashion",
    product: "Sneakers",
    img_path: "https://via.placeholder.com/150",
    price: 59.99,
    description: "Stylish and comfortable sneakers for everyday wear.",
  },
  {
    sub_category: "Home",
    product: "Coffee Maker",
    img_path: "https://via.placeholder.com/150",
    price: 39.99,
    description: "Brew the perfect cup of coffee with this modern coffee maker.",
  }, {
    sub_category: "Fashion",
    product: "Sneakers",
    img_path: "https://via.placeholder.com/150",
    price: 59.99,
    description: "Stylish and comfortable sneakers for everyday wear.",
  },
  {
    sub_category: "Home",
    product: "Coffee Maker",
    img_path: "https://via.placeholder.com/150",
    price: 39.99,
    description: "Brew the perfect cup of coffee with this modern coffee maker.",
  }, {
    sub_category: "Fashion",
    product: "Sneakers",
    img_path: "https://via.placeholder.com/150",
    price: 59.99,
    description: "Stylish and comfortable sneakers for everyday wear.",
  },
  {
    sub_category: "Home",
    product: "Coffee Maker",
    img_path: "https://via.placeholder.com/150",
    price: 39.99,
    description: "Brew the perfect cup of coffee with this modern coffee maker.",
  },
];

const ProductsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredProducts = fakeProducts.filter((p) =>
        p.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
      <div className={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prod, index) => <ProductCard key={index} {...prod} />)
        ) : (
          <p className={styles.noResults}>No products found</p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

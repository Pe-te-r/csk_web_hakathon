import React from "react";
import styles from "../styles/Product.module.scss";

interface ProductProps {
  sub_category: string;
  product: string;
  img_path: string;
  price: number;
  description: string;
}

const ProductCard: React.FC<ProductProps> = ({
  sub_category,
  product,
  img_path,
  price,
  description,
}) => {
  return (
    <div className={styles.productCard}>
      <img src={img_path} alt={product} className={styles.productImage} />
      <div className={styles.productInfo}>
        <h3>{product}</h3>
        <p className={styles.category}>{sub_category}</p>
        <p className={styles.description}>{description}</p>
        <div className={styles.bottom}>
          <span className={styles.price}>${price.toFixed(2)}</span>
          <button className={styles.buyBtn}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

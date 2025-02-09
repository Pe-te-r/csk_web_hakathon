import React from "react";
import styles from "../styles/Product.module.scss";
import { useBasketStorage } from "../hooks/useBasketStorage";

interface ProductProps {
  id: string;
  sub_category: string;
  product: string;
  img_path: string;
  price: number;
  description: string;
}

const ProductCard: React.FC<ProductProps> = ({
  id,
  sub_category,
  product,
  img_path,
  price,
  description,
}) => {
  const { basket, addToBasket, removeFromBasket, updateBasket } =
    useBasketStorage();

  const basketItem = basket.find((item) => item.id === id);
  const quantity = basketItem ? basketItem.quantity : 0;

  const handleUpdate = (newQuantity: number) => {
   
    if (newQuantity === 0) {
      removeFromBasket(id);
    } else {
      updateBasket(id, newQuantity);
    }
  };

  return (
    <div className={styles.productCard}>
      <img src={img_path} alt={product} className={styles.productImage} />
      <div className={styles.productInfo}>
        <h3>{product}</h3>
        <p className={styles.category}>{sub_category}</p>
        <p className={styles.description}>{description}</p>
        <div className={styles.bottom}>
          <span className={styles.price}>${price.toFixed(2)}</span>
          {quantity > 0 ? (
            <div className={styles.quantityControls}>
              <button
                className={styles.subtractbtn}
                onClick={() => handleUpdate(quantity - 1)}
              >
                -
              </button>
              <span className={styles.quantity}>{quantity}</span>
              <button
                className={styles.addBtn}
                onClick={() => handleUpdate(quantity + 1)}
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                addToBasket({ id, sub_category, product, img_path, price, description, quantity: 1 })
              }
              className={styles.buyBtn}
            >
              Add to Basket
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

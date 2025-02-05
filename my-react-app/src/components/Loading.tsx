import ReactLoading from "react-loading";
import styles from '../styles/Loading.module.scss'
const Loading = () => {
  return (
    <div className={styles.loading}>
      <ReactLoading type="spin" color="blue" height={50} width={50} />
    </div>
  );
};

export default Loading;

import { useGetProducts } from "../../hooks/useGetProducts";

import "./style.css";

export const HomePage = () => {
  const { products } = useGetProducts();

  return (
    <div className="home">
      <div className="products">
        {products.map((product) => (
          <div>
            {product.productName} {product.price}
          </div>
        ))}
      </div>
    </div>
  );
};

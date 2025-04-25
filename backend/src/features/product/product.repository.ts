import Repository from "db/repository.js";

import { ProductModel } from "./product.model.js";

const collectionName = "product";

const productRepository = new Repository<ProductModel>(collectionName);
export default productRepository;

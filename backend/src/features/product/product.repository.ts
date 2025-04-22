import Repository from "db/repository.js";
import { NewProduct } from "./product.model.js";

const collectionName = "product";

const productRepository = new Repository<NewProduct>(collectionName);
export default productRepository;

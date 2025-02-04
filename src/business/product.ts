import { product } from "./../models/product";
import { IProduct } from "../interfaces/product";
import { productListParser, productParser } from "../parsers/product";
import { productErrorMessages } from "../utils/errorMessages";

export async function createBusiness(data: IProduct): Promise<number> {
  if (product.checkExists(data.sku)) {
    throw new Error(productErrorMessages.CONFLICT);
  }

  return product.create(data);
}

export async function findAll(): Promise<IProduct[]> {
  const productList = product.findAll();
  return productListParser(productList);
}

export async function findBySku(sku: number): Promise<IProduct> {
  const response = product.findBySku(sku);
  if (response.length === 0) {
    throw new Error(productErrorMessages.NOT_FOUND);
  }

  return productParser(response[0]);
}

export async function update(sku: number, payload: IProduct): Promise<IProduct> {
  const productIndex: number = product.getProductIndex(sku);

  if (productIndex === -1) {
    throw new Error(productErrorMessages.NOT_FOUND);
  }
  payload.sku = sku;
  const response = product.update(productIndex, payload);
  return productParser(response);
}

export async function remove(sku: number): Promise<void> {
  if (!product.checkExists(sku)) {
    throw new Error(productErrorMessages.NOT_FOUND);
  }
  product.remove(sku);
}

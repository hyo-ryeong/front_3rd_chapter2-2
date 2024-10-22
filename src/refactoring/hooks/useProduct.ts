import { useState } from 'react'
import { Product } from '../../types.ts'

// 상품 관리 커스텀 훅
export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts)

  // 기존 상품 업데이트
  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) => prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
  }

  // 새로운 상품 추가
  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct])
  }

  return {
    products,
    updateProduct,
    addProduct,
  }
}

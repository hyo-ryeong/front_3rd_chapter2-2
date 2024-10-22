// useCart.ts
import { useState } from 'react'
import { CartItem, Coupon, Product } from '../../types'
import { calculateCartTotal, updateCartItemQuantity, getRemainingStock } from './utils/cartUtils'

// 장바구니 관리 커스텀 훅
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null)

  // 장바구니에 상품 추가
  const addToCart = (product: Product) => {
    const remainingStock = getRemainingStock(cart, product)
    if (remainingStock <= 0) return

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item,
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  // 장바구니에서 상품 제거
  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  // 장바구니에서 수량 업데이트
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) => updateCartItemQuantity(prevCart, productId, newQuantity))
  }

  // 쿠폰 적용
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon)
  }

  // 총 금액, 할인 계산
  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  }
}

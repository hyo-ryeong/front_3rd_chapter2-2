import { CartItem, Coupon, Product } from '../../../types'

// 장바구니 아이템의 총 금액을 계산
export const calculateItemTotal = (item: CartItem) => {
  const discount = getMaxApplicableDiscount(item) // 최대 할인율 가져오기
  return item.product.price * item.quantity * (1 - discount) // 할인 적용된 가격 계산
}

// 해당 아이템에 적용 가능한 최대 할인을 계산
export const getMaxApplicableDiscount = (item: CartItem) => {
  return item.product.discounts.reduce((maxDiscount, discount) => {
    return item.quantity >= discount.quantity && discount.rate > maxDiscount ? discount.rate : maxDiscount
  }, 0)
}

// 장바구니 전체 금액과 할인 후 금액을 계산
export const calculateCartTotal = (cart: CartItem[], selectedCoupon: Coupon | null) => {
  let totalBeforeDiscount = 0
  let totalAfterDiscount = 0

  cart.forEach((item) => {
    totalBeforeDiscount += item.product.price * item.quantity // 할인 전 총 금액
    totalAfterDiscount += calculateItemTotal(item) // 할인 후 총 금액
  })

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === 'amount') {
      totalAfterDiscount = Math.max(0, totalAfterDiscount - selectedCoupon.discountValue)
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100
    }
  }

  const totalDiscount = totalBeforeDiscount - totalAfterDiscount

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  }
}

// 장바구니 아이템 수량 업데이트
export const updateCartItemQuantity = (cart: CartItem[], productId: string, newQuantity: number): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity))
        return updatedQuantity > 0 ? { ...item, quantity: updatedQuantity } : null
      }
      return item
    })
    .filter((item): item is CartItem => item !== null)
}

// 남은재고 수량
export const getRemainingStock = (cart: CartItem[], product: Product) => {
  const cartItem = cart.find((item) => item.product.id === product.id)
  return product.stock - (cartItem?.quantity || 0)
}

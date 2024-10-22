import { Coupon } from '../../types.ts'
import { useState } from 'react'

// 쿠폰 관리 커스텀 훅
export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)

  // 쿠폰 추가
  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon])
  }

  return { coupons, addCoupon }
}

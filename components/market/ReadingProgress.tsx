'use client'

import React from 'react'
import { useScroll, motion } from 'framer-motion'

export function ReadingProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-[#C9A96E] z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

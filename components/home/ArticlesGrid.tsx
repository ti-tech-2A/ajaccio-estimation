'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import ArticleCard from '@/components/articles/ArticleCard'
import type { ArticleTeaser } from '@/types/wp'

interface ArticlesGridProps {
  articles: ArticleTeaser[]
}

export default function ArticlesGrid({ articles }: ArticlesGridProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
    >
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </motion.div>
  )
}

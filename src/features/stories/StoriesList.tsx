import type { Story } from '../../types/hn'
import StoryCard from './StoryCard'
import styles from './StoriesList.module.css'

export default function StoriesList({ stories }: { stories: Story[] }) {
  if (stories.length === 0) {
    return <p className={styles.empty}>No stories found. Try a different category or search.</p>
  }

  return (
    <section className={styles.list} aria-label="Stories">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </section>
  )
}

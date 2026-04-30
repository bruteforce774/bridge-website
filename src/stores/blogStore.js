import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useBlogStore = defineStore('blog', () => {
  const posts = ref([])
  const isLoading = ref(false)
  const errorMessage = ref(null)

  const fetchPosts = async () => {
    isLoading.value = true
    errorMessage.value = null

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts')
        if (!response.ok) {
            throw new Error(`Error fetching posts: ${response.statusText}`)
        }
        const data = await response.json()
        posts.value = data
    } catch (error) {
        errorMessage.value = error.message
    } finally {
        isLoading.value = false
    }
  }

  return { posts, isLoading, errorMessage, fetchPosts }
})
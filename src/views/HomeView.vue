<script setup>
import { onMounted } from 'vue'
import { useBlogStore } from '../stores/blogStore'

const blogStore = useBlogStore()

onMounted(() => {
    if (blogStore.posts.length === 0) {
        blogStore.fetchPosts()
    }
})
</script>

<template>
    <h1>Home</h1>
    <p v-if="blogStore.isLoading">Loading...</p>
    <p v-else-if="blogStore.errorMessage">{{ blogStore.errorMessage }}</p>
    <ul v-else>
        <li v-for="post in blogStore.posts" :key="post.id">
            <h2>{{ post.title }}</h2>
            <div v-html="post.body"></div>
        </li>
    </ul>
</template>

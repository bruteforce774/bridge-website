<script setup>
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const password = ref('')
const title = ref('')
const body = ref('')
const status = ref('')

async function save() {
  status.value = 'Saving...'
  try {
    const response = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': password.value
      },
      body: JSON.stringify({ title: title.value, body: body.value }),
    })
    if (!response.ok) {
      const data = await response.json().catch(() => ({}))
      throw new Error(data.error || `HTTP ${response.status}`)
    }
    status.value = 'Saved.'
    title.value = ''
    body.value = ''
  } catch (error) {
    status.value= `Error: ${error.message}`
  }
}
</script>

<template>
  <h1>New Post</h1>
  
  <p>
    <label>Admin password</label><br />
    <input v-model="password" type="password" />
  </p>

  <p>
    <label>Title</label><br />
    <input v-model="title" />
  </p>

  <p>
    <label>Body</label>
  </p>
  <QuillEditor v-model:content="body" content-type="html" theme="snow" />

  <p>
    <button @click="save">Save</button>
  </p>

  <p>{{ status }}</p>
</template>

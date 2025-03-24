<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { postAxios } from '@/utils/fetch';
import { marked } from 'marked';

const response = ref(null);
const files: Ref<File[]> = ref([]);
const path = ref('oddish');
const submitted = ref(false);

const addFile = (e: any) => {
  files.value = e.target.files;
};

const handlePath = (e: any) => {
  path.value = e.target.checked ? 'oddish_crew' : 'oddish';
};

const getFile = async () => {
  response.value = null;

  const formData = new FormData();
  if (!files.value.length) {
    return;
  }

  for (let i = 0; i < files.value.length; i++) {
    formData.append('files', files.value[i]);
  }

  submitted.value = true;

  const resp = await postAxios(`/tutor/${path.value}`, formData, {
    headers: { 'content-type': 'multipart/form-data' }
  });
  response.value = resp.data;
  submitted.value = false;
};
</script>
<template>
  <div class="content">
    <div>
      <input class="input files-selection" name="files" type="file" multiple @change="addFile" />
      <button class="button" @click="getFile">Submit</button>
    </div>
    <div class="checkbox">
      <input id="crew" type="checkbox" class="switch" @change="handlePath" />
      <label for="crew" class="ml-2">With MAS</label>
    </div>
    <div class="is-flex">
      <div v-if="files.length" class="section">
        <h1>Given files</h1>
        <p v-for="file in files" :key="file.name">{{ file.name }}</p>
      </div>
      <div v-if="submitted && !response" class="loader my-6 mx-6">
        <div class="square"></div>
      </div>
      <div v-if="response" class="section">
        <h1>Response</h1>
        <p v-if="response" v-html="marked.parse(response)" contenteditable />
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  width: 50%;
  overflow: scroll;
  height: 90vh;
}
.square {
  background-color: #333;
}
.content {
  overflow: hidden;
  height: 100%;
}

.checkbox {
  margin: 0 1rem;
  width: 200px;
}

.files-selection {
  width: 50%;
}

.files-selection.button {
  width: 50px;
}
</style>

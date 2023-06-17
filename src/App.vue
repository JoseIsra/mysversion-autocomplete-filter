<template>
  <section class="container">
    <h1>Busca libros</h1>
    <input
      v-model="inputModel"
      @input="($e) => handleInputSearch($e.target.value)"
    />
    <p v-if="inputModel.length === 0">Escribe una sugerencia de libro</p>
    <progress v-if="loading"></progress>
    <div
      v-if="errorMessage"
      style="background: #bf4545; color: white; padding: 20px"
    >
      <p>{{ errorMessage }}</p>
    </div>
    <div v-if="results.length > 0">
      <div v-for="result in results" :key="result.id">
        <p>{{ result.title }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { getAutoCompleteResults } from "./api/getAutoCompleteResults";

const inputModel = ref("");
const results = ref([]);
const loading = ref(false);
const errorMessage = ref(null);
const timeoutId = ref(-1);
let abortController = null;
const handleInputSearch = (val) => {
  if (!val.length) {
    loading.value = false;
    errorMessage.value = null;
    results.value = [];
    return;
  }
  clearTimeout(timeoutId);
  timeoutId.value = setTimeout(async () => {
    try {
      if (abortController) {
        abortController.abort();
      }
      abortController = new AbortController();
      loading.value = true;
      const books = await getAutoCompleteResults({
        query: val,
        signal: abortController.signal,
      });
      results.value = books.results.slice(0, 10);
      loading.value = false;
    } catch (error) {
      if (error.name !== "AbortError") {
        errorMessage.value = error;
        loading.value = false;
      }
    }
  }, 700);
};
</script>

<template>
  <q-page class="q-pa-md transition-all">
    <div
      :class="[
        'transition-header row justify-center',
        searchQuery ? 'search-active' : 'search-idle',
      ]"
    >
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 text-center">
        <div v-if="!searchQuery" class="q-mb-xl animate-fade">
          <h1 class="text-h3 text-weight-bolder text-primary google-font">
            Mapeamento<span class="text-grey-6">IFG</span>
          </h1>
        </div>

        <q-input
          v-model="searchQuery"
          rounded
          outlined
          bg-color="white"
          placeholder="Pesquise por servidores, fluxos ou setores"
          debounce="500"
          clearable
          class="google-search-bar"
        >
          <template #prepend><q-icon name="search" color="primary" /></template>
          <template #append>
            <q-spinner v-if="pending" color="primary" size="xs" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="max-width-container q-mx-auto q-mt-lg">
      <div v-if="pending && !departments" class="row q-col-gutter-md">
        <div v-for="n in 4" :key="n" class="col-12 col-sm-6 col-md-3">
          <q-skeleton height="150px" square bordered />
        </div>
      </div>

      <section v-if="departments?.length">
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-grey-8">
            {{ searchQuery ? "Resultados Encontrados" : "Explorar por:" }}
          </div>
          <q-badge color="grey-3" text-color="grey-9">
            {{ departments.length }} setores
          </q-badge>
        </div>

        <div class="row q-col-gutter-md">
          <div
            v-for="dept in departments"
            :key="dept.uorg_code"
            class="col-12 col-sm-6 col-md-4 col-lg-3 cursor-pointer animate-fade"
          >
            <DepartmentCard :dept="dept" :search-query="searchQuery" />
          </div>
        </div>
      </section>

      <div
        v-if="!pending && departments?.length === 0"
        class="text-center q-pa-xl"
      >
        <q-icon name="search_off" size="50px" color="grey-4" />
        <div class="text-grey-6">
          Nenhum resultado encontrado para "{{ searchQuery }}"
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const searchQuery = ref("");

const { data: departments, pending } = await useFetch("/api/departments", {
  query: { search: searchQuery },
});
</script>

<style lang="scss" scoped>
/* Mantidos seus estilos originais conforme solicitado */
.transition-header {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.search-idle {
  padding-top: 12vh;
  padding-bottom: 5vh;
}
.search-active {
  padding-top: 2vh;
  padding-bottom: 2vh;
}
.google-search-bar {
  max-width: 600px;
  margin: 0 auto;
  transition: transform 0.3s;
  &:focus-within {
    transform: translateY(-2px);
    :deep(.q-field__control) {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
    }
  }
}
.google-font {
  font-family: "Product Sans", "Roboto", sans-serif;
  letter-spacing: -1.5px;
}
.max-width-container {
  max-width: 1200px;
}
.animate-fade {
  animation: fadeIn 0.8s ease-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

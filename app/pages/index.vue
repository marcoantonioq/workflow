<template>
  <q-page class="q-pa-lg">
    
    <div 
      class="column items-center transition-all"
      :style="searchQuery ? 'margin-top: 0' : 'margin-top: 15vh'"
    >
      
      <q-transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-if="!searchQuery" class="text-center q-mb-xl">
          <h1 class="text-h2 text-weight-bolder text-primary q-ma-none google-font">
            Mapeamento<span class="text-grey-6">IFG</span>
          </h1>
        </div>
      </q-transition>

      <div class="col-12 w-full max-width-search">
        <q-input
          v-model="searchQuery"
          outlined
          rounded
          bg-color="white"
          placeholder="Encontre setores, fluxos e servidores em um só lugar..."
          :loading="pending"
          clearable
          autofocus
          class="search-input-heavy"
          @clear="searchQuery = ''"
        >
          <template #prepend>
            <q-icon name="search" color="primary" size="sm" />
          </template>
          
          <template #append>
            <q-btn 
              round 
              dense 
              flat 
              icon="tune" 
              color="grey-6"
            >
              <q-tooltip>Filtros Avançados</q-tooltip>
            </q-btn>
          </template>
        </q-input>

        <div v-if="false" class="row justify-center q-gutter-sm q-mt-md">
          <q-chip 
            v-for="tag in ['Gabinete', 'TI', 'Biblioteca', 'Extensão']" 
            :key="tag"
            clickable 
            @click="searchQuery = tag"
            color="white" 
            text-color="primary" 
            icon="trending_up"
            class="shadow-1"
          >
            {{ tag }}
          </q-chip>
        </div>
      </div>
    </div>

    <div class="q-mt-xl max-width-container q-mx-auto">
      <q-banner 
        v-if="searchQuery && departments?.length" 
        rounded 
        class="bg-white text-grey-9 q-mb-lg shadow-1 border-primary-left"
      >
        <template #avatar>
          <q-icon name="format_list_bulleted" color="primary" />
        </template>
        Exibindo <strong>{{ departments.length }}</strong> resultados para sua busca.
      </q-banner>

      <div class="row q-col-gutter-lg">
        <template v-if="pending && !departments?.length">
          <div v-for="n in 8" :key="n" class="col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card flat bordered>
              <q-item>
                <q-item-section avatar>
                  <q-skeleton type="QAvatar" />
                </q-item-section>
                <q-item-section>
                  <q-skeleton type="text" width="60%" />
                  <q-skeleton type="text" width="40%" />
                </q-item-section>
              </q-item>
              <q-skeleton height="100px" square />
            </q-card>
          </div>
        </template>

        <div
          v-for="dept in departments"
          :key="dept.uorg_code"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <DepartmentCard 
            v-ripple
            :dept="dept" 
            :search-query="searchQuery" 
            class="full-height cursor-pointer hover-elevated"
          />
        </div>
      </div>

      <div v-if="!pending && departments?.length === 0 && searchQuery" class="column items-center q-pa-xl">
        <q-img
          src="https://cdn.quasar.dev/img/empty-state/no-data.svg"
          style="width: 150px; opacity: 0.5"
        />
        <div class="text-h6 text-grey-5 q-mt-md">Nenhum resultado encontrado</div>
        <q-btn outline color="primary" label="Limpar busca" class="q-mt-sm" @click="searchQuery = ''" />
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="help_outline" color="secondary" padding="sm" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
const searchQuery = ref("");
const { data: departments, pending } = await useFetch("/api/departments", {
  query: { search: searchQuery },
  watch: [searchQuery]
});
</script>

<style lang="scss" scoped>
.google-font {
  font-family: 'Product Sans', 'Roboto', sans-serif;
}

.max-width-search {
  width: 100%;
  max-width: 700px;
}

.max-width-container {
  max-width: 1400px;
}

.search-input-heavy {
  :deep(.q-field__control) {
    height: 64px; 
    font-size: 1.15rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-radius: 32px;
    padding: 0 20px;
    
    .q-field__marginal {
      height: 100%;
      display: flex;
      align-items: center;
    }

    .q-field__native {
      padding-top: 0;
      padding-bottom: 0;
      min-height: 100%;
    }
  }

  &.q-field--focused :deep(.q-field__control) {
    box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  }
}

.hover-elevated {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0,0,0,0.05);
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important;
  }
}

.border-primary-left {
  border-left: 5px solid var(--q-primary);
}

.transition-all {
  transition: all 0.5s ease-in-out;
}

.w-full {
  width: 100%;
}
</style>
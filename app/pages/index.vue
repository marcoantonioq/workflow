<template>
  <q-page class="q-pa-lg">
    
    <div 
      class="column items-center transition-all"
      :style="searchQuery ? 'margin-top: 0' : 'margin-top: 12vh'"
    >
      
      <q-transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
      >
        <div v-if="!searchQuery" class="text-center q-mb-lg">
          <h1 class="text-h4 text-weight-bolder text-primary q-ma-none google-font">
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
          placeholder="Pesquise setores, fluxos e servidores em um só lugar..."
          :loading="pending"
          clearable
          autofocus
          class="search-input-heavy"
          @clear="searchQuery = ''"
        >
          <template #prepend>
            <q-icon name="search" color="primary" size="xs" />
          </template>
          
          <template #append>
            <q-btn round dense flat icon="tune" color="grey-6" size="sm">
              <q-tooltip>Filtros</q-tooltip>
            </q-btn>
          </template>
        </q-input>
      </div>
    </div>

    <div class="q-mt-xl max-width-container q-mx-auto">
      
      <div v-if="searchQuery && departments?.length" class="row items-center q-mb-md q-px-sm">
        <q-icon name="sort" color="grey-6" class="q-mr-sm" />
        <span class="text-grey-8">Encontrados: <strong>{{ departments.length }}</strong> setores</span>
      </div>

      <div class="row q-col-gutter-lg">
        
        <template v-if="pending && !departments?.length">
          <div v-for="n in 4" :key="n" class="col-12 col-md-6">
            <q-card flat bordered>
              <q-item>
                <q-item-section avatar><q-skeleton type="QAvatar" size="48px" /></q-item-section>
                <q-item-section>
                  <q-skeleton type="text" width="60%" />
                  <q-skeleton type="text" width="30%" />
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </template>

        <div
          v-for="dept in departments"
          :key="dept.uorg_code"
          class="col-12 col-md-6"
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
        <q-icon name="search_off" size="64px" color="grey-4" />
        <div class="text-body1 text-grey-6 q-mt-md">Nenhum resultado para "{{ searchQuery }}"</div>
      </div>
    </div>
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
.google-font { font-family: 'Product Sans', sans-serif; }
.max-width-search { width: 100%; max-width: 600px; }
.max-width-container { max-width: 1100px; }

.search-input-heavy {
  :deep(.q-field__control) {
    height: 54px; // Reduzido de 64px
    font-size: 1rem; // Reduzido de 1.15rem
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    
    .q-field__marginal {
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}

.transition-all { transition: all 0.4s ease-in-out; }
.hover-elevated {
  transition: transform 0.2s;
  &:hover { transform: translateY(-3px); }
}
</style>
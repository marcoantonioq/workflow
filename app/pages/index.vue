<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12">
        <div class="text-h5 q-mb-md">Meu Perfil</div>
        
        <q-card flat bordered class="bg-white q-pa-sm">
          <q-item>
            <q-item-section avatar>
              <q-avatar size="80px" color="primary" text-color="white" icon="person" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6">{{ auth.userDetails.value?.full_name }}</q-item-label>
              <q-item-label caption class="text-weight-bold">
                {{ auth.userDetails.value?.position?.name || 'Cargo não definido' }}
              </q-item-label>
              <q-item-label caption>
                Matrícula: {{ auth.userId.value }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-chip icon="domain" color="orange-1" text-color="orange-9" outline>
                Setor: {{ auth.userDetails.value?.department?.name || 'Não alocado' }}
              </q-chip>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 row items-center justify-between">
        <div class="text-h6">Explorar Outros Setores</div>
        <q-badge color="grey-7">{{ departments?.length || 0 }} setores encontrados</q-badge>
      </div>

      <template v-if="pending">
        <div v-for="n in 4" :key="n" class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar><q-skeleton type="QAvatar" /></q-item-section>
              <q-item-section><q-skeleton type="text" /></q-item-section>
            </q-item>
          </q-card>
        </div>
      </template>

      <template v-else>
        <div v-for="dept in departments" :key="dept.id" class="col-12 col-sm-6 col-md-3">
          <q-card 
            flat bordered 
            class="hover-card cursor-pointer" 
            @click="navigateTo(`/map/setores/${dept.id}`)"
          >
            <q-card-section class="row items-center no-wrap">
              <q-avatar icon="account_tree" color="blue-1" text-color="blue-8" size="md" />
              <div class="q-ml-md">
                <div class="text-weight-bold">{{ dept.name }}</div>
                <div class="text-caption text-grey-7">Clique para ver detalhes</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
const auth = useAuth()

// Busca os setores usando o hook nativo do Nuxt
const { data: departments, pending } = await useFetch('/api/departments')
</script>

<style scoped>
.hover-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
  border-color: var(--q-primary);
}
</style>
<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card class="q-pa-md shadow-2" style="width: 400px; border-radius: 12px">
      <q-card-section class="text-center">
        <q-icon name="settings_suggest" size="64px" color="primary" />
        <div class="text-h5 q-mt-md">Configuração Inicial</div>
        <div class="text-subtitle2 text-grey-7">
          Prepare seu ambiente para o primeiro uso.
        </div>
      </q-card-section>

      <q-separator inset />

      <q-card-section>
        <div class="column q-gutter-sm">
          <q-item clickable v-ripple class="bg-blue-1 rounded-borders">
            <q-item-section avatar>
              <q-icon name="storage" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Banco de Dados</q-item-label>
              <q-item-label caption>Criação de tabelas e sementes</q-item-label>
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>

      <q-card-actions vertical align="center">
        <q-btn
          color="primary"
          unelevated
          class="full-width text-weight-bold"
          label="Inicializar Sistema"
          :loading="status === 'pending'"
          @click="startSetup"
        >
          <template v-slot:loading>
            <q-spinner-facebook class="on-left" />
            Configurando...
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
const $q = useQuasar()

const { execute: startSetup, status } = useFetch('/api/setup/db', {
  method: 'POST',
  immediate: false,
  onResponse({ response }) {
    if (response.ok) {
      $q.notify({
        type: 'positive',
        message: 'Sistema configurado com sucesso!',
        icon: 'check_circle'
      })
      // navigateTo('/')
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erro ao configurar banco de dados.',
        caption: response._data?.message || 'Erro desconhecido'
      })
    }
  },
  onResponseError() {
    $q.notify({
      type: 'negative',
      message: 'Falha na conexão com o servidor.'
    })
  }
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
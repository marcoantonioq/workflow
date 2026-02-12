<template>
  <q-page class="flex flex-center bg-grey-3">
    <q-card flat bordered style="width: 350px; border-radius: 12px">
      <q-card-section class="bg-primary text-white text-center q-pa-lg">
        <q-icon name="lock" size="48px" />
        <div class="text-h6 q-mt-md">Acesso Restrito</div>
        <div class="text-caption">Informe sua credencial para continuar</div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <q-input 
          v-model="matricula" 
          label="ID de Usuário" 
          outlined 
          stack-label
          :disable="loading"
          @keyup.enter="doLogin"
        >
          <template #prepend><q-icon name="badge" /></template>
        </q-input>
      </q-card-section>

      <q-card-actions class="q-px-lg q-pb-lg">
        <q-btn 
          label="Entrar no Sistema" 
          color="primary" 
          class="full-width" 
          unelevated
          :loading="loading"
          @click="doLogin"
          :disable="matricula === '' || loading"
        />
        <q-btn 
          label="Voltar" 
          flat 
          color="grey-9" 
          class="full-width q-mt-sm" 
          to="/"
          :disable="loading"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
const { login } = useAuth()
const matricula = ref('')
const loading = ref(false)

const doLogin = async () => {
  if (!matricula.value) return
  loading.value = true
  try {
    await login(matricula.value)
  } catch (e) {
    // Aqui você pode adicionar um QNotify de erro caso o ID não exista no Prisma
  } finally {
    loading.value = false
  }
}
</script>
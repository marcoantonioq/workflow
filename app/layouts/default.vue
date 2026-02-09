<template>
  <ClientOnly>
    <q-layout view="lHh lpr lFf" class="bg-grey-2 app-root">
      <q-header elevated class="no-print">
        <q-toolbar class="q-py-xs">
          <div class="cursor-pointer non-selectable q-px-md">
            <q-item to="/" clickable v-close-popup>
              <q-item-section> Inicio</q-item-section>
            </q-item>
          </div>

          <div class="q-ml-sm cursor-pointer non-selectable q-px-md">
            Editar
            <q-menu auto-close>
              <q-list dense style="min-width: 150px">
                <q-item to="/workflow/create" clickable v-close-popup>
                  <q-item-section>Mapeamento de Processos</q-item-section>
                </q-item>
                <q-item to="/map/setores" clickable>
                  <q-item-section>Setores</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>

          <q-space />

          <div class="row items-center q-gutter-sm">
            <template v-if="auth.isAuthenticated.value">
              <div class="column items-end q-mr-sm text-white">
                <span class="text-weight-bold text-caption">
                  {{ auth.userDetails.value?.full_name || "Carregando..." }}
                </span>
                <span style="font-size: 0.7rem; opacity: 0.8">
                  {{ auth.userDetails.value?.position?.name || "Sessão Ativa" }}
                </span>
              </div>

              <q-btn round flat icon="account_circle">
                <q-menu style="min-width: 200px">
                  <q-list>
                    <q-item-label header>Sessão Atual</q-item-label>
                    <q-item dense>
                      <q-item-section avatar
                        ><q-icon name="badge"
                      /></q-item-section>
                      <q-item-section>
                        <q-item-label caption>ID/Matrícula</q-item-label>
                        <q-item-label>{{ auth.userId.value }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator q-my-sm />
                    <q-item
                      clickable
                      v-close-popup
                      @click="handleLogout"
                      class="text-negative"
                    >
                      <q-item-section avatar
                        ><q-icon name="logout"
                      /></q-item-section>
                      <q-item-section>Encerrar Sessão</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </template>

            <q-btn v-else flat icon="login" label="Entrar" to="/login" />
          </div>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page class="q-pa-md max-width-container">
          <div class="max-width-container ">
            <NuxtPage />
          </div>
        </q-page>
      </q-page-container>
    </q-layout>

    <template #fallback>
      <div class="fullscreen flex flex-center">
        <q-spinner-orbit color="primary" size="3em" />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
const auth = useAuth();

const handleLogout = () => {
  auth.logout();
};

// Re-sincroniza dados do Prisma ao montar o layout (caso de Refresh)
onMounted(async () => {
  if (auth.userId.value && !auth.userDetails.value) {
    await auth.fetchUserDetails();
  }
});
</script>

<style lang="scss" scoped>
.max-width-container {
  max-width: 1200px;
  margin: 0 auto;
}

.q-router-link--exact-active {
  font-weight: bold;
  color: #88B08B
}
</style>
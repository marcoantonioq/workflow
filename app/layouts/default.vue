<template>
  <ClientOnly>
    <q-layout view="lHh Lpr fFf" class="bg-grey-2 app-root">
      <q-page-container>
        <q-page class="q-pa-md">
          <div class="max-width-container">
            <NuxtPage />
          </div>

          <q-page-sticky
            v-if="!auth.isAuthenticated.value"
            position="bottom-right"
            :offset="[16, 16]"
          >
            <q-btn
              flat
              round
              dense
              icon="login"
              color="grey-7"
              to="/login"
              class="discreet-entry-btn"
            />
          </q-page-sticky>
        </q-page>
      </q-page-container>

      <q-footer
        v-if="auth.isAuthenticated.value"
        class="bg-white text-grey-9 border-top"
      >
        <nav class="row no-wrap items-stretch" style="height: 50px">
          <q-btn
            flat
            no-caps
            class="col nav-button"
            to="/"
            icon="home"
            color="grey-7"
          />

          <q-btn
            flat
            no-caps
            class="col nav-button"
            icon="apps"
            color="primary"
          >
            <q-menu
              anchor="top middle"
              self="bottom middle"
              :offset="[0, 12]"
              class="google-apps-menu"
            >
              <div class="q-pa-md grid-container">
                <q-btn
                  flat
                  stack
                  no-caps
                  class="app-item"
                  to="/workflow/create"
                  v-close-popup
                >
                  <q-icon name="account_tree" color="blue" size="28px" />
                  <div class="app-label">Processos</div>
                </q-btn>

                <q-btn
                  flat
                  stack
                  no-caps
                  class="app-item"
                  to="/map/setores"
                  v-close-popup
                >
                  <q-icon name="domain" color="green" size="28px" />
                  <div class="app-label">Setores</div>
                </q-btn>

                <q-btn flat stack no-caps class="app-item" color="grey-7">
                  <q-icon name="settings" size="28px" />
                  <div class="app-label">Config</div>
                </q-btn>
              </div>
            </q-menu>
          </q-btn>

          <q-btn
            flat
            no-caps
            class="col nav-button"
            icon="account_circle"
            color="grey-7"
          >
            <q-menu
              anchor="top right"
              self="bottom right"
              :offset="[0, 12]"
              class="profile-menu"
            >
              <div
                class="column items-center q-pa-md bg-grey-1"
                style="min-width: 200px"
              >
                <q-avatar
                  size="50px"
                  color="primary"
                  text-color="white"
                  class="q-mb-sm shadow-1"
                >
                  {{
                    auth.userDetails?.value?.full_name?.charAt(0).toUpperCase()
                  }}
                </q-avatar>
                <div class="text-weight-bold text-dark">
                  {{ auth.userDetails?.value?.full_name }}
                </div>
                <div class="text-caption text-grey-7">
                  {{ auth.userDetails?.value?.position?.name || "Membro" }}
                </div>
              </div>

              <q-list dense class="q-py-sm">
                <q-item
                  clickable
                  :to="`/members/profile/${auth.userId?.value}`"
                  v-close-popup
                >
                  <q-item-section avatar
                    ><q-icon name="person_outline" size="20px"
                  /></q-item-section>
                  <q-item-section>Meu Perfil</q-item-section>
                </q-item>

                <q-separator q-my-sm />

                <q-item
                  clickable
                  @click="handleLogout"
                  class="text-negative"
                  v-close-popup
                >
                  <q-item-section avatar
                    ><q-icon name="logout" size="20px"
                  /></q-item-section>
                  <q-item-section>Sair da conta</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </nav>
      </q-footer>
    </q-layout>

    <template #fallback>
      <div class="fullscreen flex flex-center bg-grey-2">
        <q-spinner-orbit color="primary" size="3em" />
      </div>
    </template>
  </ClientOnly>
</template>

<script setup>
const auth = useAuth();
const handleLogout = () => auth.logout();

onMounted(async () => {
  if (auth.userId?.value && !auth.userDetails.value) {
    await auth.fetchUserDetails();
  }
});
</script>

<style lang="scss" scoped>
.app-root {
  min-height: 100vh;
}
.max-width-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* BARRA COMPACTA */
.nav-button {
  height: 100%;
  border-radius: 0; /* Remove arredondamento para o clique preencher o quadrado */
  padding: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
}

/* MENU DE APPS */
.google-apps-menu {
  border-radius: 12px;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.1);
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
}

.app-item {
  width: 75px;
  height: 75px;
  border-radius: 8px;
  .app-label {
    font-size: 10px;
    margin-top: 4px;
    color: #5f6368;
  }
}

/* ENTRADA DISCRETA */
.discreet-entry-btn {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

@media (max-width: 599px) {
  .q-page {
    padding-bottom: 50px;
  }
}
</style>

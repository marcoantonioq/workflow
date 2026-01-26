<template>
  <div class="fixed-full overflow-hidden">
    <ClientOnly>
      <q-layout
        view="lHh lpr lFf"
        container
        style="height: 100vh"
        class="shadow-2"
      >
        <q-header elevated>
          <div class="q-pa-sm q-pl-md row items-center">
            <div class="cursor-pointer non-selectable">
              Arquivos
              <q-menu>
                <q-list dense style="min-width: 100px">
                  <q-item to="/" clickable v-close-popup>
                    <q-item-section>Principal</q-item-section>
                  </q-item>
                  <q-item to="/new" clickable v-close-popup>
                    <q-item-section>Novo</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </div>

            <div class="q-ml-md cursor-pointer non-selectable">
              Editar
              <q-menu auto-close>
                <q-list dense>
                  <q-item to="/map/setores" clickable><q-item-section>Mapeamento Setores</q-item-section></q-item>
                  <q-item to="/map/cargos" clickable><q-item-section>Mapeamento Cargos</q-item-section></q-item>
                </q-list>
              </q-menu>
            </div>
          </div>
        </q-header>

        <q-page-container class="scroll" style="height: 100vh">
          <q-page class="q-pa-md">
            <NuxtPage />
          </q-page>
        </q-page-container>
      </q-layout>

      <template #fallback>
        <div class="fullscreen flex flex-center">
          <q-spinner-orbit color="primary" size="3em" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
/* 3. Garante que o scrollbar apareça apenas no container do layout */
:deep(.q-layout-container > div) {
  overflow: hidden;
}

/* Força o container de página a ser rolável se o conteúdo exceder */
.scroll {
  overflow-y: auto;
}
</style>
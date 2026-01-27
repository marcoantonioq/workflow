<template>
  <ClientOnly>
    <q-layout view="lHh lpr lFf" class="bg-grey-2 app-root">
      
      <q-header elevated class="no-print">
        <q-toolbar class="q-py-xs">
          <div class="cursor-pointer non-selectable q-px-md">
            Arquivos
            <q-menu>
              <q-list dense style="min-width: 150px">
                <q-item to="/" clickable v-close-popup>
                  <q-item-section>Principal</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </div>
          <div class="q-ml-sm cursor-pointer non-selectable q-px-md">
            Editar
            <q-menu auto-close>
              <q-list dense style="min-width: 150px">
                <q-item to="/map/setores" clickable><q-item-section>Setores</q-item-section></q-item>
              </q-list>
            </q-menu>
          </div>
        </q-toolbar>
      </q-header>

      <q-page-container>
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
</template>

<style>
/* FORÇA O SCROLL NO NÍVEL DO NAVEGADOR (Resolve Edge/Chrome) */
html, body {
  overflow-y: auto !important;
  height: auto !important;
  min-height: 100% !important;
}

/* Garante que o container do Quasar não bloqueie o scroll */
.q-page-container {
  overflow: visible !important;
}

.app-root {
  min-height: 100vh;
}

/* IMPRESSÃO */
@media print {
  .no-print { display: none !important; }
  body { background: white !important; }
  .q-page-container { padding-top: 0 !important; }
  .q-card { box-shadow: none !important; border: 1px solid #ddd !important; page-break-inside: avoid; }
}
</style>
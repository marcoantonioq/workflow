<template>
  <q-page padding class="row justify-center bg-grey-2">
    <div class="col-12 col-sm-11 col-md-10 col-lg-9">
      <div class="q-mb-lg">
        <div class="text-h5 text-primary text-weight-bolder row items-center">
          <q-icon name="account_tree" class="q-mr-sm" />
          MAPEAMENTO IFG
        </div>
        <div class="text-caption text-grey-7">
          Os dados são salvos automaticamente no seu navegador.
        </div>
      </div>

      <draggable
        v-model="listaFluxos"
        item-key="id"
        handle=".handle-fluxo"
        ghost-class="ghost"
      >
        <template #item="{ element: fluxo, index: fIndex }">
          <q-card flat bordered class="q-mb-xl shadow-1 overflow-hidden">
            <q-toolbar class="bg-primary text-white q-py-xs">
              <q-icon
                name="drag_indicator"
                class="handle-fluxo cursor-pointer q-mr-sm"
              />
              <q-toolbar-title class="text-subtitle2">
                FLUXO #{{ fIndex + 1 }}
              </q-toolbar-title>
              <q-btn
                flat
                round
                icon="delete"
                size="sm"
                @click="removerFluxo(fIndex)"
              />
            </q-toolbar>

            <q-card-section class="row q-col-gutter-sm">
              <q-input
                v-model="fluxo.identificacao"
                label="IDENTIFICAÇÃO"
                filled
                dense
                class="col-12"
                @update:model-value="checkAutoAddFluxo(fIndex)"
              />
              <q-input
                v-model="fluxo.descricao"
                label="DESCRIÇÃO"
                filled
                dense
                autogrow
                class="col-12 col-md-4"
              />
              <q-input
                v-model="fluxo.objetivos"
                label="OBJETIVOS"
                filled
                dense
                autogrow
                class="col-12 col-md-4"
              />
              <q-input
                v-model="fluxo.documentos"
                label="DOCUMENTOS"
                filled
                dense
                autogrow
                class="col-12 col-md-4"
              />
            </q-card-section>

            <q-card-section class="q-pt-none">
              <div class="text-overline text-secondary q-mb-xs">ETAPAS</div>

              <draggable
                v-model="fluxo.etapas"
                item-key="id"
                handle=".handle-etapa"
                ghost-class="ghost"
              >
                <template #item="{ element: etapa, index: eIndex }">
                  <div
                    class="q-mb-md q-pa-sm border-left-accent bg-white rounded-borders shadow-1"
                  >
                    <div class="row q-col-gutter-xs items-center">
                      <q-icon
                        name="reorder"
                        size="xs"
                        class="handle-etapa cursor-pointer text-grey-6 col-auto"
                      />
                      <q-input
                        v-model="etapa.nome_etapa"
                        placeholder="Nome da Etapa"
                        dense
                        outlined
                        class="col-grow bg-grey-1"
                        @update:model-value="checkAutoAddEtapa(fIndex, eIndex)"
                      />
                      <q-btn
                        icon="close"
                        flat
                        round
                        size="xs"
                        color="grey-5"
                        @click="fluxo.etapas.splice(eIndex, 1)"
                        class="col-auto"
                      />
                    </div>

                    <div class="q-mt-sm q-pl-sm">
                      <draggable
                        v-model="etapa.tarefas"
                        item-key="id"
                        handle=".handle-tarefa"
                        ghost-class="ghost"
                      >
                        <template #item="{ element: tarefa, index: tIndex }">
                          <q-card
                            flat
                            bordered
                            class="q-mb-xs bg-grey-1 no-border-radius"
                          >
                            <div
                              class="row items-center q-pa-xs q-col-gutter-xs"
                            >
                              <q-icon
                                name="drag_handle"
                                size="xs"
                                class="handle-tarefa cursor-pointer text-grey-4 col-auto"
                              />

                              <q-input
                                v-model="tarefa.nome"
                                label="Tarefa"
                                dense
                                filled
                                class="col-12 col-md-3"
                                @update:model-value="
                                  checkAutoAddTarefa(fIndex, eIndex, tIndex)
                                "
                              />
                              <q-input
                                v-model="tarefa.setor"
                                label="Setor"
                                dense
                                filled
                                class="col-6 col-md-2"
                              />
                              <q-input
                                v-model="tarefa.sistemas"
                                label="Sistema"
                                dense
                                filled
                                class="col-6 col-md-2"
                              />

                              <q-expansion-item
                                icon="tune"
                                dense
                                class="col-grow"
                                header-class="q-pa-none"
                              >
                                <div
                                  class="row q-col-gutter-xs q-pa-sm bg-white"
                                >
                                  <q-input
                                    v-model="tarefa.insumos"
                                    label="Insumos"
                                    dense
                                    outlined
                                    class="col-12 col-md-6"
                                  />
                                  <q-input
                                    v-model="tarefa.problemas"
                                    label="Problemas"
                                    dense
                                    outlined
                                    class="col-12 col-md-6"
                                  />
                                  <q-input
                                    v-model="tarefa.solucoes"
                                    label="Soluções"
                                    dense
                                    outlined
                                    class="col-12 col-md-6"
                                  />
                                  <q-input
                                    v-model="tarefa.prazos"
                                    label="Prazos (horas)"
                                    dense
                                    outlined
                                    class="col-12 col-md-3"
                                  />
                                  <q-input
                                    v-model="tarefa.base_legal"
                                    label="Base Legal"
                                    dense
                                    outlined
                                    class="col-12 col-md-3"
                                  />
                                </div>
                              </q-expansion-item>

                              <q-btn
                                icon="remove"
                                flat
                                color="negative"
                                round
                                size="xs"
                                @click="etapa.tarefas.splice(tIndex, 1)"
                                class="col-auto"
                              />
                            </div>
                          </q-card>
                        </template>
                      </draggable>
                    </div>
                  </div>
                </template>
              </draggable>
            </q-card-section>
          </q-card>
        </template>
      </draggable>

      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn fab icon="download" color="primary" @click="exportarTudo" />
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import draggable from "vuedraggable";
import { exportFile, useQuasar } from "quasar";

const $q = useQuasar();
const generateId = () => Math.random().toString(36).substring(2, 9);

const factoryTarefa = () => ({
  id: generateId(),
  nome: "",
  setor: "",
  sistemas: "",
  insumos: "",
  problemas: "",
  solucoes: "",
  prazos: "",
  base_legal: "",
});
const factoryEtapa = () => ({
  id: generateId(),
  nome_etapa: "",
  tarefas: [factoryTarefa()],
});
const factoryFluxo = () => ({
  id: generateId(),
  identificacao: "",
  descricao: "",
  objetivos: "",
  documentos: "",
  etapas: [factoryEtapa()],
});

const listaFluxos = ref([factoryFluxo()]);

// AUTO-SAVE LÓGICA
onMounted(() => {
  const saved = localStorage.getItem("mapeamento_fluxos");
  if (saved) listaFluxos.value = JSON.parse(saved);
});

watch(
  listaFluxos,
  (newVal) => {
    localStorage.setItem("mapeamento_fluxos", JSON.stringify(newVal));
  },
  { deep: true },
);

// AUTO-ADD LÓGICA
const checkAutoAddFluxo = (idx) => {
  if (
    idx === listaFluxos.value.length - 1 &&
    listaFluxos.value[idx].identificacao.trim() !== ""
  ) {
    listaFluxos.value.push(factoryFluxo());
  }
};
const checkAutoAddEtapa = (fIdx, eIdx) => {
  const etapas = listaFluxos.value[fIdx].etapas;
  if (eIdx === etapas.length - 1 && etapas[eIdx].nome_etapa.trim() !== "") {
    etapas.push(factoryEtapa());
  }
};
const checkAutoAddTarefa = (fIdx, eIdx, tIdx) => {
  const tarefas = listaFluxos.value[fIdx].etapas[eIdx].tarefas;
  if (tIdx === tarefas.length - 1 && tarefas[tIdx].nome.trim() !== "") {
    tarefas.push(factoryTarefa());
  }
};

const removerFluxo = (idx) => {
  $q.dialog({
    title: "Excluir",
    message: "Deseja remover este fluxo?",
    cancel: true,
  }).onOk(() => {
    listaFluxos.value.splice(idx, 1);
    if (listaFluxos.value.length === 0) listaFluxos.value = [factoryFluxo()];
  });
};

const exportarTudo = () => {
  const clean = listaFluxos.value
    .filter((f) => f.identificacao.trim() !== "")
    .map((f) => ({
      ...f,
      etapas: f.etapas
        .filter((e) => e.nome_etapa.trim() !== "")
        .map((e) => ({
          ...e,
          tarefas: e.tarefas.filter((t) => t.nome.trim() !== ""),
        })),
    }));

  if (clean.length === 0) return $q.notify("Preencha ao menos um fluxo!");
  exportFile(
    "fluxos_ifg.json",
    JSON.stringify(clean, null, 2),
    "application/json",
  );
};
</script>

<style scoped>
.border-left-accent {
  border-left: 4px solid var(--q-secondary);
}
.ghost {
  opacity: 0.3;
}
.cursor-pointer {
  cursor: grab;
}
</style>

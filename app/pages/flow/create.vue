<template>
    <div class="col-12 col-md-10 col-lg-8">
      <q-form @submit="exportarJSON">
        <q-card flat bordered class="q-mb-md">
          <q-toolbar class="bg-primary text-white">
            <q-toolbar-title class="text-weight-bolder"
              >MAPER - FLUXO IFG</q-toolbar-title
            >
            <q-btn
              flat
              round
              icon="download"
              @click="exportarJSON"
              title="Exportar"
            />
          </q-toolbar>

          <q-card-section class="row q-col-gutter-sm">
            <q-input
              v-model="fluxo.identificacao"
              label="IDENTIFICAÇÃO"
              filled
              class="col-12"
              dense
            />
            <q-input
              v-model="fluxo.descricao"
              label="DESCRIÇÃO"
              filled
              autogrow
              class="col-md-6 col-xs-12"
              dense
            />
            <q-input
              v-model="fluxo.objetivos"
              label="OBJETIVOS"
              filled
              autogrow
              class="col-md-6 col-xs-12"
              dense
            />
            <q-input
              v-model="fluxo.documentos"
              label="DOCUMENTOS"
              filled
              autogrow
              class="col-12"
              dense
            />
          </q-card-section>
        </q-card>

        <draggable
          v-model="fluxo.etapas"
          item-key="id"
          handle=".handle-etapa"
          ghost-class="ghost"
        >
          <template #item="{ element: etapa, index: eIndex }">
            <q-card flat bordered class="q-mb-md border-left-ifg">
              <q-item class="bg-secondary text-white">
                <q-item-section avatar>
                  <q-icon
                    name="drag_indicator"
                    class="handle-etapa cursor-pointer"
                  />
                </q-item-section>
                <q-item-section>
                  <q-input
                    v-model="etapa.nome_etapa"
                    dark
                    borderless
                    dense
                    placeholder="Nome da Etapa"
                    class="text-weight-bold"
                  />
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    icon="delete"
                    flat
                    color="white"
                    round
                    size="sm"
                    @click="fluxo.etapas.splice(eIndex, 1)"
                  />
                </q-item-section>
              </q-item>

              <q-card-section>
                <draggable
                  v-model="etapa.tarefas"
                  item-key="id"
                  handle=".handle-tarefa"
                  ghost-class="ghost-task"
                >
                  <template #item="{ element: tarefa, index: tIndex }">
                    <q-card
                      flat
                      bordered
                      class="q-mb-xs bg-white border-dashed"
                    >
                      <div class="row no-wrap items-start">
                        <q-icon
                          name="more_vert"
                          class="handle-tarefa q-pa-sm cursor-pointer text-grey-6"
                        />

                        <div class="row q-col-gutter-xs full-width q-pa-sm">
                          <q-input
                            v-model="tarefa.nome"
                            label="TAREFA"
                            dense
                            filled
                            class="col-md-4 col-xs-12"
                          />
                          <q-input
                            v-model="tarefa.setor"
                            label="SETOR"
                            dense
                            filled
                            class="col-md-4 col-xs-12"
                          />
                          <q-input
                            v-model="tarefa.sistemas"
                            label="SISTEMA"
                            dense
                            filled
                            class="col-md-4 col-xs-12"
                          />

                          <q-expansion-item
                            label="Detalhes Técnicos"
                            dense
                            class="col-12 text-grey-7"
                            header-class="q-pa-none min-height-0"
                          >
                            <div class="row q-col-gutter-xs q-pt-sm">
                              <q-input
                                v-model="tarefa.insumos"
                                label="INSUMOS"
                                dense
                                filled
                                class="col-md-6 col-xs-12"
                              />
                              <q-input
                                v-model="tarefa.problemas"
                                label="PROBLEMAS"
                                dense
                                filled
                                class="col-md-6 col-xs-12"
                              />
                              <q-input
                                v-model="tarefa.solucoes"
                                label="SOLUÇÕES"
                                dense
                                filled
                                class="col-md-6 col-xs-12"
                              />
                              <q-input
                                v-model="tarefa.prazos"
                                label="PRAZOS"
                                dense
                                filled
                                class="col-md-3 col-xs-6"
                              />
                              <q-input
                                v-model="tarefa.base_legal"
                                label="BASE LEGAL"
                                dense
                                filled
                                class="col-md-3 col-xs-6"
                              />
                            </div>
                          </q-expansion-item>
                        </div>

                        <q-btn
                          icon="close"
                          flat
                          color="negative"
                          round
                          size="xs"
                          class="q-mt-xs"
                          @click="etapa.tarefas.splice(tIndex, 1)"
                        />
                      </div>
                    </q-card>
                  </template>
                </draggable>

                <q-btn
                  outline
                  color="primary"
                  icon="add"
                  label="Adicionar Tarefa"
                  class="full-width q-mt-sm"
                  @click="addTarefa(eIndex)"
                />
              </q-card-section>
            </q-card>
          </template>
        </draggable>

        <div class="row justify-center q-mt-lg">
          <q-btn
            label="Adicionar Nova Etapa"
            color="secondary"
            icon="add_circle"
            @click="addEtapa"
          />
        </div>
      </q-form>
    </div>
</template>

<script setup>
import { ref } from "vue";
import draggable from "vuedraggable";
import { exportFile, useQuasar } from "quasar";

const $q = useQuasar();
const generateId = () => Math.random().toString(36).substring(2, 9);

const fluxo = ref({
  identificacao: "",
  descricao: "",
  objetivos: "",
  documentos: "",
  etapas: [{ id: generateId(), nome_etapa: "", tarefas: [] }],
});

const addEtapa = () =>
  fluxo.value.etapas.push({ id: generateId(), nome_etapa: "", tarefas: [] });
const addTarefa = (idx) =>
  fluxo.value.etapas[idx].tarefas.push({
    id: generateId(),
    nome: "",
    setor: "",
    sistemas: "",
  });

const exportarJSON = () => {
  const status = exportFile(
    `${fluxo.value.identificacao || "fluxo"}.json`,
    JSON.stringify(fluxo.value, null, 2),
    "application/json",
  );
  if (status)
    $q.notify({ color: "positive", message: "JSON exportado com sucesso!" });
};
</script>

<style scoped>
.border-left-ifg {
  border-left: 6px solid var(--q-primary);
}
.border-dashed {
  border: 1px dashed #ccc;
}
.ghost {
  opacity: 0.4;
  background: #e8f5e9;
}
.ghost-task {
  opacity: 0.4;
  border: 2px solid var(--q-primary);
}
.cursor-pointer {
  cursor: grab;
}
.cursor-pointer:active {
  cursor: grabbing;
}
</style>

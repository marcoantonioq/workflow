<template>
  <q-page padding class="bg-grey-2">
    <div class="q-mx-auto" style="max-width: 1200px">
      <q-card flat bordered class="q-mb-md">
        <q-toolbar class="q-py-sm">
          <q-toolbar-title class="text-primary text-weight-bold">
            Mapeamento IFG
            <q-badge
              v-if="estaSalvando"
              color="orange"
              label="Salvando..."
              class="q-ml-sm"
            />
          </q-toolbar-title>

          <q-btn
            :icon="isReadOnly ? 'edit' : 'visibility'"
            :label="isReadOnly ? 'Habilitar Edição' : 'Modo Visualização'"
            :color="isReadOnly ? 'orange' : 'secondary'"
            @click="isReadOnly = !isReadOnly"
            unelevated
          />
        </q-toolbar>
      </q-card>

      <draggable
        v-model="listaFluxos"
        item-key="id"
        handle=".handle-fluxo"
        :disabled="isReadOnly"
        :animation="250"
      >
        <template #item="{ element: fluxo, index: fIdx }">
          <q-card flat bordered class="q-mb-xl shadow-2 overflow-hidden">
            <q-toolbar
              :class="
                fluxo.identificacao
                  ? 'bg-primary text-white'
                  : 'bg-grey-4 text-grey-9'
              "
            >
              <q-icon
                name="drag_indicator"
                class="handle-fluxo cursor-pointer"
                v-if="!isReadOnly"
              />
              <q-input
                v-model="fluxo.identificacao"
                dark
                borderless
                class="col q-ml-md text-h6"
                placeholder="Nome do Processo/Fluxo..."
                :readonly="isReadOnly"
              />
              <q-select
                v-model="fluxo.department_id"
                :options="opcoesSetores"
                dense
                standout
                dark
                label="Setor UORG"
                class="col-3 q-mx-md"
                :readonly="isReadOnly"
              />
              <q-btn
                flat
                round
                :icon="fluxo.isExpanded ? 'expand_less' : 'expand_more'"
                @click="fluxo.isExpanded = !fluxo.isExpanded"
              />
              <q-btn
                v-if="!isReadOnly"
                flat
                round
                icon="delete"
                @click="confirmarExclusao(fluxo, fIdx)"
              />
            </q-toolbar>

            <q-slide-transition>
              <div v-if="fluxo.isExpanded && fluxo.department_id">
                <q-card-section class="row q-col-gutter-md">
                  <q-input
                    v-model="fluxo.descricao"
                    label="DESCRIÇÃO"
                    filled
                    dense
                    class="col-4"
                    autogrow
                    :readonly="isReadOnly"
                  />
                  <q-input
                    v-model="fluxo.objetivos"
                    label="OBJETIVOS"
                    filled
                    dense
                    class="col-4"
                    autogrow
                    :readonly="isReadOnly"
                  />
                  <q-input
                    v-model="fluxo.documentos"
                    label="DOCUMENTOS"
                    filled
                    dense
                    class="col-4"
                    autogrow
                    :readonly="isReadOnly"
                  />
                </q-card-section>

                <q-card-section>
                  <draggable
                    v-model="fluxo.etapas"
                    item-key="id"
                    handle=".handle-etapa"
                    :disabled="isReadOnly"
                    :animation="250"
                  >
                    <template #item="{ element: etapa, index: eIdx }">
                      <div class="q-mb-lg q-pa-sm border-etapa">
                        <q-toolbar
                          dense
                          class="bg-grey-3 q-mb-sm rounded-borders"
                        >
                          <q-icon
                            name="reorder"
                            class="handle-etapa cursor-pointer q-mr-sm"
                            v-if="!isReadOnly"
                          />
                          <q-input
                            v-model="etapa.nome_etapa"
                            borderless
                            class="col text-weight-bold"
                            placeholder="Digite um nome para criar uma nova etapa"
                            :readonly="isReadOnly"
                          />
                          <q-btn
                            icon="close"
                            flat
                            round
                            size="xs"
                            color="negative"
                            @click="fluxo.etapas.splice(eIdx, 1)"
                            v-if="!isReadOnly"
                          />
                        </q-toolbar>

                        <div v-if="etapa.nome_etapa" class="q-pl-md">
                          <draggable
                            v-model="etapa.tarefas"
                            item-key="id"
                            handle=".handle-tarefa"
                            :disabled="isReadOnly"
                            :animation="250"
                          >
                            <template #item="{ element: tarefa, index: tIdx }">
                              <MapeamentoTarefa
                                v-model="etapa.tarefas[tIdx]"
                                :readonly="isReadOnly"
                                :opts-setores="opcoesSetores"
                                :opts-sistemas="opcoesSistemas"
                                @remove="etapa.tarefas.splice(tIdx, 1)"
                              />
                            </template>
                          </draggable>
                        </div>
                      </div>
                    </template>
                  </draggable>
                </q-card-section>
              </div>
              <div
                v-else-if="
                  !fluxo.department_id && fluxo.isExpanded && !isReadOnly
                "
                class="q-pa-xl text-center text-grey-6 bg-grey-1"
              >
                Selecione um <strong>Setor UORG</strong> para liberar o
                mapeamento deste fluxo.
              </div>
            </q-slide-transition>
          </q-card>
        </template>
      </draggable>

      <q-inner-loading :showing="estaCarregando">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import draggable from "vuedraggable";
import { useMapeamento } from "~/composables/flow/useMapeamento";
import MapeamentoTarefa from "~/components/flow/TarefaItem.vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const auth = useAuth();

if (!auth?.userId?.value) {
  navigateTo("/");
}

const {
  listaFluxos,
  estaCarregando,
  estaSalvando,
  removerFluxo,
  carregarDados,
} = useMapeamento();
const isReadOnly = ref(false);

const opcoesSetores = [
  "CP-GOIAS",
  "GOI-CA",
  "GOI-CAA",
  "GOI-DAA",
  "GOI-CRHAS",
  "GOI-CATINF",
];
const opcoesSistemas = ["SUAP", "E-mail", "Whatsapp", "Meet"];

const confirmarExclusao = (fluxo, index) => {
  // Se o fluxo estiver vazio e for o último, nem pergunta
  if (!fluxo.identificacao && listaFluxos.value.length > 1) {
    listaFluxos.value.splice(index, 1);
    return;
  }

  $q.dialog({
    title: "Confirmar Exclusão",
    message: `Deseja realmente apagar o fluxo "${fluxo.identificacao || "Sem nome"}"? Esta ação não pode ser desfeita.`,
    cancel: true,
    persistent: true,
    ok: { label: "Apagar", color: "negative", flat: true },
  }).onOk(() => {
    console.log("Removendo item...", fluxo);
    removerFluxo(fluxo.id, index);
  });
};

onMounted(() => {
  carregarDados();
});
</script>

<style scoped>
.border-etapa {
  border: 1px solid #ddd;
  border-left: 6px solid var(--q-primary);
  border-radius: 8px;
  background: #fdfdfd;
}
.handle-fluxo,
.handle-etapa,
.handle-tarefa {
  opacity: 0.5;
  transition: opacity 0.3s;
}
.handle-fluxo:hover,
.handle-etapa:hover,
.handle-tarefa:hover {
  opacity: 1;
}
</style>

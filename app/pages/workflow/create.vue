<template>
  <q-page padding class="bg-grey-2">
    <div class="q-mx-auto" style="max-width: 1200px">
      <div class="row items-center justify-between q-mb-sm no-wrap">
        <div class="row items-center">
          <q-icon
            name="account_tree"
            class="text-primary q-mr-sm"
            size="24px"
          />
          <div class="column">
            <span class="text-weight-bolder text-primary text-h6 leading-tight"
              >Mapeamento IFG</span
            >
            <q-badge
              v-if="estaSalvando"
              color="orange-1"
              text-color="orange-10"
              class="text-bold"
            >
              <q-spinner-dots size="10px" class="q-mr-xs" /> SALVANDO
            </q-badge>
          </div>
        </div>

        <q-btn
          :unelevated="!isReadOnly"
          :outline="isReadOnly"
          :color="isReadOnly ? 'blue-grey-8' : 'secondary'"
          @click="isReadOnly = !isReadOnly"
          dense
          class="q-px-md"
          size="12px"
        >
          <q-icon
            :name="isReadOnly ? 'visibility' : 'edit'"
            size="xs"
            class="q-mr-xs"
          />
          <span class="text-bold">{{ isReadOnly ? "Editar" : "Ver" }}</span>
        </q-btn>
      </div>

      <div class="row items-center no-wrap q-gutter-x-xs q-ma-md">
        <q-btn
          flat
          dense
          :color="isAllFluxosOpen ? 'primary' : 'grey-7'"
          :icon="isAllFluxosOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          :class="[isAllFluxosOpen ? 'bg-blue-1' : 'bg-white shadow-sm']"
          @click="handleToggle('fluxos')"
          class="btn-toggle"
        >
          <span class="q-ml-xs text-bold">Fluxos</span>
        </q-btn>

        <transition name="q-transition--scale">
          <div v-if="hasAnyFluxoOpen" class="row items-center no-wrap">
            <q-icon name="chevron_right" color="grey-4" size="sm" />
            <q-btn
              flat
              dense
              :color="isAllEtapasOpen ? 'secondary' : 'grey-7'"
              :icon="isAllEtapasOpen ? 'layers' : 'layers_clear'"
              :class="[isAllEtapasOpen ? 'bg-teal-1' : 'bg-white shadow-sm']"
              @click="handleToggle('etapas')"
              class="btn-toggle"
            >
              <span class="q-ml-xs text-bold">Etapas</span>
            </q-btn>
          </div>
        </transition>

        <transition name="q-transition--scale">
          <div v-if="hasAnyEtapaOpen" class="row items-center no-wrap">
            <q-icon name="chevron_right" color="grey-4" size="sm" />
            <q-btn
              flat
              dense
              :color="isAllTarefasOpen ? 'grey-10' : 'grey-6'"
              :icon="isAllTarefasOpen ? 'visibility' : 'visibility_off'"
              :class="[isAllTarefasOpen ? 'bg-grey-4' : 'bg-white shadow-sm']"
              @click="handleToggle('tarefas')"
              class="btn-toggle"
            >
              <span class="q-ml-xs text-bold">Tarefas</span>
            </q-btn>
          </div>
        </transition>
      </div>

      <draggable
        v-model="listaFluxos"
        item-key="id"
        handle=".handle-fluxo"
        :disabled="isReadOnly"
        :animation="250"
      >
        <template #item="{ element: fluxo, index: fIdx }">
          <q-card
            flat
            bordered
            class="q-mb-xl shadow-2 overflow-hidden rounded-borders"
          >
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
                placeholder="Nome do Fluxo..."
                :readonly="isReadOnly"
                :input-style="{ caretColor: '#000' }"
                />
              <q-select
                v-model="fluxo.department_id"
                :options="opcoesSetores"
                dense
                standout
                dark
                label="Setor"
                class="col-3 q-mx-md gt-xs"
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
              <div v-show="fluxo.isExpanded">
                <q-card-section class="row q-col-gutter-md">
                  <q-select
                    v-model="fluxo.department_id"
                    :options="opcoesSetores"
                    filled
                    dense
                    label="SETOR"
                    class="col-12 lt-sm"
                    :readonly="isReadOnly"
                  />
                  <q-input
                    v-model="fluxo.descricao"
                    label="DESCRIÇÃO"
                    filled
                    dense
                    class="col-12 col-md-4"
                    autogrow
                    :readonly="isReadOnly"
                  />
                  <q-input
                    v-model="fluxo.objetivos"
                    label="OBJETIVOS"
                    filled
                    dense
                    class="col-12 col-md-4"
                    autogrow
                    :readonly="isReadOnly"
                  />
                  <q-input
                    v-model="fluxo.documentos"
                    label="DOCUMENTOS"
                    filled
                    dense
                    class="col-12 col-md-4"
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
                      <div
                        class="q-mb-lg q-pa-sm border-etapa bg-grey-1 rounded-borders"
                      >
                        <q-toolbar
                          dense
                          class="bg-grey-3 q-mb-sm rounded-borders"
                        >
                          <q-icon
                            name="reorder"
                            class="handle-etapa cursor-pointer q-mr-sm text-grey-6"
                            v-if="!isReadOnly"
                          />
                          <q-input
                            v-model="etapa.nome_etapa"
                            borderless
                            dense
                            class="col text-weight-bold"
                            placeholder="Nome da Etapa..."
                            :readonly="isReadOnly"
                          />
                          <q-btn
                            flat
                            round
                            dense
                            color="grey-7"
                            :icon="
                              etapa.isExpanded
                                ? 'keyboard_arrow_up'
                                : 'keyboard_arrow_down'
                            "
                            @click="etapa.isExpanded = !etapa.isExpanded"
                          />
                          <q-btn
                            v-if="!isReadOnly"
                            icon="close"
                            flat
                            round
                            dense
                            size="sm"
                            color="negative"
                            @click="fluxo.etapas.splice(eIdx, 1)"
                          />
                        </q-toolbar>

                        <q-slide-transition>
                          <div
                            v-show="etapa.isExpanded"
                            class="q-pl-md-lg q-pl-xs"
                          >
                            <draggable
                              v-model="etapa.tarefas"
                              item-key="id"
                              handle=".handle-tarefa"
                              :disabled="isReadOnly"
                              :animation="250"
                            >
                              <template
                                #item="{ element: tarefa, index: tIdx }"
                              >
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
                        </q-slide-transition>
                      </div>
                    </template>
                  </draggable>
                </q-card-section>
              </div>
            </q-slide-transition>
          </q-card>
        </template>
      </draggable>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import draggable from "vuedraggable";
import { useMapeamento } from "~/composables/flow/useMapeamento";
import MapeamentoTarefa from "~/components/flow/TarefaItem.vue";

const $q = useQuasar();
const isReadOnly = ref(false);
const { listaFluxos, estaSalvando, removerFluxo, carregarDados } =
  useMapeamento();

// --- ESTADOS DE VISIBILIDADE ---

// 1. FLUXOS
const hasAnyFluxoOpen = computed(() =>
  listaFluxos.value.some((f) => f.isExpanded),
);
const isAllFluxosOpen = computed(
  () =>
    listaFluxos.value.length > 0 &&
    listaFluxos.value.every((f) => f.isExpanded),
);

// 2. ETAPAS (Baseadas nos fluxos que estão abertos no momento)
const openFluxos = computed(() =>
  listaFluxos.value.filter((f) => f.isExpanded),
);
const hasAnyEtapaOpen = computed(() =>
  openFluxos.value.some((f) => f.etapas?.some((e) => e.isExpanded)),
);
const isAllEtapasOpen = computed(() => {
  if (openFluxos.value.length === 0) return false;
  return openFluxos.value.every((f) => f.etapas?.every((e) => e.isExpanded));
});

// 3. TAREFAS (Baseadas nas etapas que estão abertas no momento)
const isAllTarefasOpen = computed(() => {
  const activeEtapas = openFluxos.value
    .flatMap((f) => f.etapas || [])
    .filter((e) => e.isExpanded);
  if (activeEtapas.length === 0) return false;
  return activeEtapas.every((e) => e.tarefas?.every((t) => !t._minimized));
});

// --- LÓGICA DE TOGGLE ---

const handleToggle = (nivel) => {
  const actions = {
    fluxos: () => {
      const target = !isAllFluxosOpen.value;
      listaFluxos.value.forEach((f) => {
        f.isExpanded = target;
        if (!target) f.etapas?.forEach((e) => (e.isExpanded = false));
      });
    },
    etapas: () => {
      const target = !isAllEtapasOpen.value;
      openFluxos.value.forEach((f) =>
        f.etapas?.forEach((e) => (e.isExpanded = target)),
      );
    },
    tarefas: () => {
      const targetMin = isAllTarefasOpen.value; // Inverte: se todas abertas, minimiza
      openFluxos.value.forEach((f) =>
        f.etapas
          ?.filter((e) => e.isExpanded)
          .forEach((e) =>
            e.tarefas?.forEach((t) => (t._minimized = targetMin)),
          ),
      );
    },
  };
  actions[nivel]?.();
};

// --- DADOS E MÉTODOS AUXILIARES ---

const opcoesSetores = [ "DEMANDANTE","CP-GOIAS", "GOI-CONCAM", "GOI-NAPNE", "GOI-CG", "GOI-CCS", "GOI-GA", "GOI-CGOF", "GOI-CAP", "GOI-CAM", "GOI-CAC", "GOI-DAA", "GOI-CONDE", "GOI-CA", "GOI-CAA", "GOI-CAPD", "GOI-CCTIAU", "GOI-CCTIAG", "GOI-CCBCIN", "GOI-CCLAV", "GOI-CCBA", "GOI-CCQSE", "GOI-GPPGE", "GOI-CIEE", "GOI-CAE", "GOI-CAAAE", "GOI-CRA", "GOI-CB", "GOI-CRHAS", "GOI-CATINF"];
const opcoesSistemas = ["SUAP", "E-mail", "Whatsapp", "Meet", "SIAFI"];

const confirmarExclusao = (fluxo, index) => {
  if (!fluxo.identificacao && listaFluxos.value.length > 1) {
    return listaFluxos.value.splice(index, 1);
  }
  $q.dialog({
    title: "Confirmar Exclusão",
    message: `Apagar o fluxo "${fluxo.identificacao || "Sem nome"}"?`,
    cancel: true,
    ok: { label: "Apagar", color: "negative", flat: true },
  }).onOk(() => removerFluxo(fluxo.id, index));
};

onMounted(carregarDados);
</script>

<style scoped>
/* Botão de Toggle Customizado */
.btn-toggle {
  min-width: 90px;
  font-size: 11px;
  padding: 4px 12px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.leading-tight {
  line-height: 1.2;
}
.border-grey-3 {
  border: 1px solid #e0e0e0;
}
.border-etapa {
  border: 1px solid #e0e0e0;
}
.rounded-borders {
  border-radius: 12px !important;
}

/* Estados Ativos */
.bg-blue-1 {
  background-color: #e3f2fd !important;
  border: 1px solid #bbdefb;
}
.bg-teal-1 {
  background-color: #e0f2f1 !important;
  border: 1px solid #b2dfdb;
}
.bg-grey-4 {
  background-color: #eeeeee !important;
  border: 1px solid #bdbdbd;
}

/* Transição Scale */
.q-transition--scale-enter-active,
.q-transition--scale-leave-active {
  transition: all 0.3s ease;
}
.q-transition--scale-enter-from,
.q-transition--scale-leave-to {
  opacity: 0;
  transform: translateX(-10px) scale(0.9);
}

/* Responsividade Mobile */
@media (max-width: 599px) {
  .btn-toggle {
    min-width: 75px;
    padding: 4px 6px;
  }
  .btn-toggle span {
    font-size: 10px;
  }
}
</style>

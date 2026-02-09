<template>
  <q-page class="q-pa-md q-pa-sm-xl bg-grey-1">
    <div class="q-mb-xl">
      <q-btn
        flat
        no-caps
        color="primary"
        icon="arrow_back"
        label="Voltar"
        class="hover-accent rounded-borders"
        @click="goBack"
      />
    </div>

    <div v-if="pending" class="flex flex-center q-pa-xl column">
      <q-spinner-ring color="primary" size="60px" thickness="4" />
      <div class="text-grey-7 q-mt-md font-medium">Sincronizando dados...</div>
    </div>

    <div v-else-if="workflow" class="row q-col-gutter-xl">
      <div class="col-12 col-lg-8">
        <header class="q-mb-xl">
          <div class="row items-center no-wrap">
            <q-avatar
              color="primary"
              text-color="white"
              icon="account_tree"
              size="64px"
              class="shadow-3 q-mr-lg"
            />
            <div>
              <div
                class="text-h3 text-weight-bolder text-grey-10 tracking-tight leading-tight"
              >
                {{ workflow.title }}
              </div>
              <div class="row items-center q-gutter-sm q-mt-xs">
                <q-badge
                  color="primary"
                  label="Fluxo de Trabalho"
                  class="text-weight-bold q-pa-xs px-sm"
                />
                <div class="text-grey-6">•</div>
                <div class="text-subtitle1 text-grey-8 text-weight-medium">
                  {{ workflow.department?.name }}
                  <span class="text-grey-6 text-weight-regular"
                    >({{ workflow.department?.initials }})</span
                  >
                </div>
              </div>
            </div>
          </div>
        </header>

        <q-card flat class="main-card q-mb-xl">
          <q-card-section class="q-pa-lg">
            <div class="row q-col-gutter-lg">
              <div class="col-12">
                <div class="section-title">Descrição do Processo</div>
                <p class="text-body1 text-grey-9 leading-relaxed">
                  {{
                    workflow.description ||
                    "Nenhuma descrição detalhada fornecida."
                  }}
                </p>
              </div>
              <div class="col-12" v-if="workflow.objectives">
                <div class="section-title">Objetivos Estratégicos</div>
                <div class="border-left-accent q-pl-md">
                  <p class="text-body1 text-grey-8 leading-relaxed text-italic">
                    {{ workflow.objectives }}
                  </p>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div class="row items-center justify-between q-mb-md">
          <div class="text-h5 text-weight-bold text-grey-9">
            Etapas do Processo
          </div>
          <q-badge
            outline
            color="grey-8"
            :label="`${filteredSteps.length} Etapas`"
            class="text-bold"
          />
        </div>

        <q-timeline color="primary" class="custom-timeline q-px-sm">
          <q-timeline-entry
            v-for="(step, index) in filteredSteps"
            :key="index"
            icon="ads_click"
            class="timeline-card"
          >
            <template #title>
              <div class="text-h6 text-weight-bold text-grey-10">
                {{ step.nome_etapa || step.label || step.title }}
              </div>
            </template>
            <template #subtitle>
              <q-badge
                color="blue-grey-1"
                text-color="blue-grey-9"
                class="q-py-xs"
              >
                {{ step.tarefas?.length || 0 }} TAREFAS
              </q-badge>
            </template>

            <div v-if="step.tarefas?.length" class="q-mt-md">
              <q-list class="task-list rounded-borders shadow-sm bg-white">
                <q-item
                  v-for="(tarefa, ti) in step.tarefas"
                  :key="ti"
                  class="q-py-md"
                >
                  <q-item-section avatar top>
                    <q-icon
                      name="assignment_turned_in"
                      color="primary"
                      size="24px"
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label
                      class="text-weight-bold text-grey-10 text-body1"
                    >
                      {{ tarefa.title }}
                    </q-item-label>
                    <q-item-label class="text-grey-8 q-mb-sm">
                      {{ tarefa.description || tarefa.insumos }}
                    </q-item-label>

                    <div class="row q-gutter-xs q-mt-xs">
                      <q-badge
                        v-for="s in tarefa.setores || []"
                        :key="s"
                        color="blue-grey-6"
                        :label="s"
                      />
                      <q-badge
                        v-for="sys in tarefa.sistemas || []"
                        :key="sys"
                        color="indigo-7"
                        icon="laptop_mac"
                        :label="sys"
                      />
                      <q-badge
                        v-if="tarefa.deadline_minutes"
                        color="orange-9"
                        icon="timer"
                      >
                        {{ tarefa.deadline_minutes }} min
                      </q-badge>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>

            <div
              v-else
              class="text-grey-7 bg-grey-2 q-pa-md rounded-borders border-dashed"
            >
              Sem tarefas detalhadas para esta etapa.
            </div>
          </q-timeline-entry>

          <q-timeline-entry
            icon="flag"
            color="positive"
            class="timeline-end-section"
          >
            <template #title>
              <div class="text-h6 text-weight-bold text-positive">
                Fim do Processo
              </div>
            </template>
            <div class="text-grey-7 italic"></div>
          </q-timeline-entry>
        </q-timeline>
      </div>

      <div class="col-12 col-lg-4">
        <div class="sticky-top">
          <q-card
            flat
            class="main-card q-mb-lg border-primary-top"
            v-if="workflow.documents"
          >
            <q-card-section class="row items-center q-pb-none">
              <q-icon
                name="folder_shared"
                color="primary"
                size="sm"
                class="q-mr-sm"
              />
              <div class="text-h6 text-weight-bold text-grey-9">
                Documentos e Normas
              </div>
            </q-card-section>

            <q-card-section
              class="text-grey-9 custom-html-content"
              v-html="workflow.documents"
            />
          </q-card>

          <q-card flat class="main-card shadow-1">
            <q-list separator>
              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-icon name="person" color="primary" size="28px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption class="text-weight-bold"
                    >EDITOR</q-item-label
                  >
                  <q-item-label class="text-grey-9">
                    {{ workflow.author?.full_name || "Não informado" }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-icon name="history" color="primary" size="28px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption class="text-weight-bold"
                    >ÚLTIMA ATUALIZAÇÃO</q-item-label
                  >
                  <q-item-label class="text-grey-9">
                    {{ formatDate(workflow.updated_at) }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item class="q-py-md">
                <q-item-section avatar>
                  <q-icon name="business" color="primary" size="28px" />
                </q-item-section>
                <q-item-section>
                  <q-item-label caption class="text-weight-bold"
                    >SETOR GESTOR</q-item-label
                  >
                  <q-item-label class="text-grey-9">
                    {{ workflow.department?.initials }} -
                    {{ workflow.department?.name }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-card-section>
              <q-btn
                unelevated
                color="primary"
                label="GERAR RELATÓRIO PDF"
                icon="print"
                class="full-width rounded-borders q-py-sm text-bold"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const { data: workflow, pending } = await useFetch(
  `/api/workflows/${route.params.id}`,
);

const parseJson = (data) => {
  if (!data) return null;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return data;
};

const parsedStructure = computed(() => {
  const raw = parseJson(workflow.value?.structure);
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (raw.etapas && Array.isArray(raw.etapas)) return raw.etapas;
  return [];
});

const filteredSteps = computed(() => {
  return parsedStructure.value
    .map((s) => {
      const filteredTarefas = (s.tarefas || []).filter(
        (t) => t.title && t.title.toString().trim(),
      );
      return { ...s, tarefas: filteredTarefas };
    })
    .filter((s) => {
      const hasTasks = (s.tarefas || []).length > 0;
      const name =
        (s.nome_etapa || s.label || s.title) &&
        (s.nome_etapa || s.label || s.title).toString().trim();
      return hasTasks || name;
    });
});

const goBack = () => router.back();

const formatDate = (dateString) => {
  if (!dateString) return "Data não disponível";
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
</script>

<style scoped>
.main-card {
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04) !important;
}
.section-title {
  font-size: 0.7rem;
  font-weight: 900;
  color: var(--q-primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
}
.custom-timeline :deep(.q-timeline__content) {
  padding-bottom: 40px;
}

/* Remove a linha conectora após o último item (o de conclusão) */
.timeline-end-section :deep(.q-timeline__dot:after) {
  display: none;
}

.task-list {
  border: 1px solid #eee;
}
.task-list .q-item:not(:last-child) {
  border-bottom: 1px solid #f5f5f5;
}

@media (min-width: 1024px) {
  .sticky-top {
    position: sticky;
    top: 20px;
  }
}

.border-left-accent {
  border-left: 4px solid var(--q-primary);
}
.border-primary-top {
  border-top: 4px solid var(--q-primary);
}
.border-dashed {
  border: 2px dashed #e0e0e0;
}
.leading-relaxed {
  line-height: 1.6;
}
</style>

<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="q-mb-lg">
      <q-btn flat dense color="primary" icon="arrow_back" label="Voltar" @click="goBack" />
    </div>

    <div v-if="pending" class="flex flex-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="workflow" class="row q-col-gutter-lg">
      <div class="col-12 col-md-8">
        
        <q-card flat bordered class="q-mb-lg shadow-1">
          <q-card-section class="q-pa-lg">
            <div class="row items-center q-mb-md">
              <q-icon name="account_tree" color="primary" size="32px" class="q-mr-md" />
              <div>
                <div class="text-h4 text-weight-bold text-grey-9">{{ workflow.title }}</div>
                <div class="text-subtitle2 text-grey-6 uppercase tracking-widest">
                  Fluxo de Trabalho • {{ workflow.department?.name }} ({{ workflow.department?.initials }})
                </div>
              </div>
            </div>
            
            <q-separator class="q-my-md" />
            
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="text-subtitle1 text-weight-bold text-grey-8">Descrição</div>
                <p class="text-body1 text-grey-7">{{ workflow.description || 'Sem descrição informada.' }}</p>
              </div>
              <div class="col-12" v-if="workflow.objectives">
                <div class="text-subtitle1 text-weight-bold text-grey-8">Objetivos</div>
                <p class="text-body1 text-grey-7">{{ workflow.objectives }}</p>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <div class="text-h6 q-mb-sm text-grey-8">Etapas do Processo</div>
        <q-timeline color="primary" class="q-px-md">
          <template v-if="parsedStructure.length > 0">
            <q-timeline-entry
              v-for="(step, index) in parsedStructure"
              :key="index"
              :title="step.label || step.title"
              :subtitle="step.responsible ? `Responsável: ${step.responsible}` : ''"
              icon="navigate_next"
            >
              <div class="text-body1 text-grey-8 q-mb-sm">
                {{ step.content || step.description }}
              </div>
              <q-badge v-if="step.department" outline color="blue-grey" :label="step.department" />
            </q-timeline-entry>
          </template>
          <div v-else class="q-pa-md bg-white border-dashed text-center text-grey-6 rounded-borders">
            Nenhuma etapa detalhada para este fluxo.
          </div>
        </q-timeline>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="q-mb-lg shadow-1" v-if="workflow.documents">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Documentos de Apoio</div>
          </q-card-section>
          
          <q-list separator>
            <q-card-section class="text-grey-9" v-html="workflow.documents" />            
          </q-list>
        </q-card>

        <q-card flat bordered class="bg-white">
          <q-list>
            <q-item>
              <q-item-section avatar><q-icon name="person" color="grey-7" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Autor</q-item-label>
                <q-item-label>{{ workflow.author?.full_name }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="event" color="grey-7" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Última Atualização</q-item-label>
                <q-item-label>{{ formatDate(workflow.updated_at) }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="business" color="grey-7" /></q-item-section>
              <q-item-section>
                <q-item-label caption>Setor Gestor</q-item-label>
                <q-item-label>{{ workflow.department?.initials }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <div v-else class="flex flex-center q-pa-xl">
      <div class="text-center">
        <q-icon name="error_outline" size="64px" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">Fluxo não encontrado.</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const { data: workflow, pending } = await useFetch(`/api/workflows/${route.params.id}`);

// Função auxiliar para garantir que o que vem do banco seja um Array
const ensureArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  return [];
};

// Computed properties que tratam os dados reativamente
const parsedStructure = computed(() => ensureArray(workflow.value?.structure));

const goBack = () => {
  router.back();
};

const openLink = (url) => {
  if (url) window.open(url, '_blank');
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};
</script>

<style scoped>
.border-dashed {
  border: 2px dashed #e0e0e0;
}
</style>
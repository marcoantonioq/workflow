<template>
  <q-card 
    flat 
    bordered 
    class="department-card clickable column no-wrap full-height" 
    @click="navigateTo(`/department/${dept.uorg_code}`)"
  >
    <q-card-section class="q-pa-md">
      <div class="row items-start no-wrap">
        <q-avatar 
          icon="business" 
          color="blue-1" 
          text-color="blue-8" 
          size="md"
          class="flex-shrink-0" 
        />
        <div class="q-ml-md" style="min-width: 0; flex: 1;">
          <div class="text-weight-bold text-blue-grey-9 text-subtitle2 name-container">
            {{ dept.name }}
          </div>
          <div class="text-caption text-grey-6 text-uppercase text-weight-medium">
            {{ dept.initials }}
          </div>
        </div>
      </div>
    </q-card-section>

    <div v-if="searchQuery" class="col-grow column">
      <q-separator inset class="opacity-30" />
      
      <q-card-section class="q-pa-sm q-px-md overflow-auto custom-scroll">
        <div v-if="matchedMembers.length > 0" class="q-mb-sm">
          <div class="text-overline text-primary lineHeight-xs q-mb-xs">Servidores</div>
          <div class="column q-gutter-y-xs">
            <div
              v-for="m in matchedMembers"
              :key="m.id"
              class="search-item row items-center no-wrap q-pa-xs rounded-borders"
              @click.stop="navigateTo(`/members/profile/${m.id}`)"
            >
              <q-icon name="person" size="16px" color="grey-6" class="flex-shrink-0 q-mr-sm" />
              <span class="text-caption text-grey-9 ellipsis">{{ m.full_name }}</span>
            </div>
          </div>
        </div>

        <div v-if="matchedWorkflows.length > 0">
          <div class="text-overline text-secondary lineHeight-xs q-mb-xs">Fluxos</div>
          <div class="column q-gutter-y-xs">
            <div
              v-for="wf in matchedWorkflows"
              :key="wf.id"
              class="search-item row items-center no-wrap q-pa-xs rounded-borders"
              @click.stop="navigateTo(`/workflow/${wf.id}`)"
            >
              <q-icon name="account_tree" size="16px" color="grey-6" class="flex-shrink-0 q-mr-sm" />
              <span class="text-caption text-grey-9 ellipsis">{{ wf.title }}</span>
            </div>
          </div>
        </div>

        <div v-if="isOnlyDeptMatch" class="text-caption text-italic text-grey-5 q-py-xs">
          Match no nome do setor
        </div>
      </q-card-section>
    </div>

    <div v-else class="col-grow"></div>

    <q-card-section class="q-pa-sm text-caption text-grey-7 border-top-light bg-grey-1">
      <div class="row items-center justify-around no-wrap">
        <div class="row items-center no-wrap">
          <q-icon name="person" size="18px" color="grey-5" class="q-mr-xs" />
          <span class="text-weight-bolder">{{ dept._count?.members || 0 }}</span>
        </div>

        <q-separator vertical inset class="q-mx-xs" style="min-height: 12px" />

        <div class="row items-center no-wrap">
          <q-icon name="account_tree" size="18px" color="grey-5" class="q-mr-xs" />
          <span class="text-weight-bolder">{{ dept._count?.workflows || 0 }}</span>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  dept: { type: Object, required: true },
  searchQuery: { type: String, default: "" },
});

/**
 * Função de normalização idêntica à do servidor para manter consistência
 */
const normalizeText = (text) => {
  if (!text) return "";
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase();
};

// Filtra membros localmente ignorando acentos
const matchedMembers = computed(() => {
  if (!props.searchQuery) return [];
  const s = normalizeText(props.searchQuery);
  
  return props.dept.members?.filter(m => 
    normalizeText(m.full_name).includes(s) || 
    normalizeText(m.position?.name).includes(s)
  ).slice(0, 4) || [];
});

// Filtra fluxos localmente ignorando acentos
const matchedWorkflows = computed(() => {
  if (!props.searchQuery) return [];
  const s = normalizeText(props.searchQuery);
  
  return props.dept.workflows?.filter(wf => 
    normalizeText(wf.title).includes(s) ||
    normalizeText(wf.description).includes(s)
  ).slice(0, 3) || [];
});

const isOnlyDeptMatch = computed(() => 
  props.searchQuery && matchedMembers.value.length === 0 && matchedWorkflows.value.length === 0
);

// Função de navegação (assumindo que você usa Vue Router ou Nuxt)
const navigateTo = (path) => {
  // Se estiver no Nuxt use: 
  useRouter().push(path);
};
</script>

<style lang="scss" scoped>
.department-card {
  transition: all 0.2s ease-in-out;
  border-radius: 12px;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    border-color: var(--q-primary);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
  }
}

.name-container {
  line-height: 1.25;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

.search-item {
  transition: background 0.2s;
  cursor: pointer;
  min-height: 28px;

  &:hover {
    background: rgba(25, 118, 210, 0.08); // Cor baseada no primary do Quasar
    .q-icon {
      color: var(--q-primary) !important;
    }
  }
}

.lineHeight-xs { 
  line-height: 1.2; 
  font-size: 0.65rem; 
  letter-spacing: 0.5px;
}

.border-top-light { 
  border-top: 1px solid rgba(0, 0, 0, 0.08); 
}

.custom-scroll {
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
}
</style>
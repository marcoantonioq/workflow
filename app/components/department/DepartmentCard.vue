<template>
  <q-card
    flat
    bordered
    class="department-card clickable full-height column no-wrap overflow-hidden"
    @click="navigateTo(`/department/${dept.uorg_code}`)"
  >
    <q-card-section class="q-pb-sm">
      <div class="row items-center no-wrap">
        <q-avatar
          icon="business"
          color="blue-1"
          text-color="blue-8"
          size="md"
          class="flex-shrink-0"
        />
        <div class="q-ml-md overflow-hidden" style="min-width: 0">
          <div
            class="text-weight-bold text-blue-grey-9 ellipsis text-subtitle2"
          >
            {{ dept.name }}
          </div>
          <div class="text-caption text-grey-7 ellipsis">
            {{ dept.initials }}
          </div>
        </div>
      </div>
    </q-card-section>

    <template v-if="searchQuery">
      <q-separator inset />
      <q-card-section class="q-py-sm col-grow overflow-auto custom-scroll">
        <div v-if="matchedMembers.length > 0" class="q-mb-md">
          <div class="text-overline text-primary lineHeight-xs q-mb-xs">
            Servidores
          </div>
          <div
            v-for="m in matchedMembers"
            :key="m.id"
            class="search-item q-pa-xs rounded-borders row items-center no-wrap"
            @click.stop="navigateTo(`/members/profile/${m.id}`)"
          >
            <q-icon name="person" size="14px" class="q-mr-xs flex-shrink-0" />
            <span class="text-caption text-grey-9 ellipsis">{{
              m.full_name
            }}</span>
            <q-tooltip border-radius="8px">Perfil: {{ m.full_name }}</q-tooltip>
          </div>
        </div>

        <div v-if="matchedWorkflows.length > 0">
          <div class="text-overline text-secondary lineHeight-xs q-mb-xs">
            Fluxos
          </div>
          <div
            v-for="wf in matchedWorkflows"
            :key="wf.id"
            class="search-item q-pa-xs rounded-borders row items-center no-wrap"
            @click.stop="navigateTo(`/workflow/${wf.id}`)"
          >
            <q-icon
              name="account_tree"
              size="14px"
              class="q-mr-xs flex-shrink-0"
            />
            <span class="text-caption text-grey-9 ellipsis">{{
              wf.title
            }}</span>
            <q-tooltip border-radius="8px">Fluxo: {{ wf.title }}</q-tooltip>
          </div>
        </div>

        <div
          v-if="isOnlyDeptMatch"
          class="text-caption text-italic text-grey-6"
        >
          Setor identificado pelo nome
        </div>
      </q-card-section>
    </template>

    <q-card-section
      class="q-py-xs text-caption text-grey-6 border-top-light bg-grey-1"
    >
      <div class="row items-center justify-around">
        <div class="row items-center">
          <q-icon name="people" size="16px" class="q-mr-xs" />
          {{ dept._count?.members || 0 }}
        </div>
        <q-separator vertical inset class="q-mx-xs" />
        <div class="row items-center">
          <q-icon name="account_tree" size="16px" class="q-mr-xs" />
          {{ dept._count?.workflows || 0 }}
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
const props = defineProps({
  dept: { type: Object, required: true },
  searchQuery: { type: String, default: "" },
});

const matchedMembers = computed(() => {
  if (!props.searchQuery) return [];
  const s = props.searchQuery.toLowerCase();
  return (
    props.dept.members
      ?.filter(
        (m) =>
          m.full_name?.toLowerCase().includes(s) ||
          m.position?.name?.toLowerCase().includes(s),
      )
      .slice(0, 5) || []
  ); // Limitamos para não explodir o card verticalmente
});

const matchedWorkflows = computed(() => {
  if (!props.searchQuery) return [];
  const s = props.searchQuery.toLowerCase();
  return (
    props.dept.workflows
      ?.filter((wf) => wf.title?.toLowerCase().includes(s))
      .slice(0, 5) || []
  );
});

const isOnlyDeptMatch = computed(
  () =>
    props.searchQuery &&
    matchedMembers.value.length === 0 &&
    matchedWorkflows.value.length === 0,
);
</script>

<style lang="scss" scoped>
.department-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  min-width: 0; // Importante para permitir que o flex-item encolha

  &:hover {
    transform: translateY(-4px);
    border-color: var(--q-primary);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

.search-item {
  transition: background 0.2s;
  cursor: pointer;

  &:hover {
    background: rgba(var(--q-primary), 0.08);
    color: var(--q-primary);
  }

  span {
    display: block;
    width: 100%;
  }
}

.lineHeight-xs {
  line-height: 1;
  font-size: 0.65rem;
}

.border-top-light {
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.flex-shrink-0 {
  flex-shrink: 0;
}

// Scroll customizado para não poluir visualmente
.custom-scroll {
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 10px;
  }
}
</style>

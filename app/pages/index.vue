<template>
  <q-page class="q-pa-md transition-all">
    <div 
      :class="[
        'transition-header row justify-center',
        searchQuery ? 'search-active' : 'search-idle'
      ]"
    >
      <div class="col-12 col-sm-10 col-md-8 col-lg-6 text-center">
        <div v-if="!searchQuery" class="q-mb-xl animate-fade">
          <h1 class="text-h3 text-weight-bolder text-primary google-font">
            Mapeamento<span class="text-grey-6">Gov</span>
          </h1>
          <p class="text-grey-7 text-subtitle1">Pesquise por servidores, fluxos ou setores</p>
        </div>

        <q-input
          v-model="searchQuery"
          rounded
          outlined
          bg-color="white"
          placeholder="O que você procura hoje?"
          debounce="500"
          clearable
          class="google-search-bar"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
          <template v-slot:append>
            <q-spinner v-if="pending" color="primary" size="xs" />
          </template>
        </q-input>
      </div>
    </div>

    <div class="max-width-container q-mx-auto q-mt-lg">
      
      <div v-if="pending && !departments" class="row q-col-gutter-md">
        <div v-for="n in 4" :key="n" class="col-12 col-sm-6 col-md-3">
          <q-skeleton height="150px" square bordered />
        </div>
      </div>

      <div v-if="searchQuery">
        <section v-if="filteredMembers.length > 0" class="q-mb-xl">
          <div class="text-overline text-grey-7 q-mb-sm">Servidores Encontrados</div>
          <div class="row q-col-gutter-md">
            <div v-for="member in filteredMembers" :key="member.id" class="col-12 col-sm-6 col-md-4">
              <q-card flat bordered class="hover-card-member clickable" @click="navigateTo(`/members/profile/${member.id}`)">
                <q-card-section class="row items-center no-wrap">
                  <q-avatar :color="`${getAvatarColor(member.id)}-1`" :text-color="getAvatarColor(member.id)">
                    {{ member.full_name?.charAt(0).toUpperCase() }}
                  </q-avatar>
                  <div class="q-ml-md">
                    <div class="text-weight-bold">{{ member.full_name }}</div>
                    <div class="text-caption text-grey-7">{{ member.position?.name || 'Membro' }}</div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </section>

        <section v-if="filteredWorkflows.length > 0" class="q-mb-xl">
          <div class="text-overline text-grey-7 q-mb-sm">Processos e Fluxos</div>
          <div class="row q-col-gutter-md">
            <div v-for="wf in filteredWorkflows" :key="wf.id" class="col-12 col-sm-6 col-md-4">
              <q-card flat bordered class="hover-card clickable" @click="navigateTo(`/workflow/${wf.id}`)">
                <q-card-section>
                  <div class="text-weight-bold text-primary">{{ wf.title }}</div>
                  <div class="text-caption ellipsis-2-lines">{{ wf.description }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </section>
      </div>

      <section>
        <div class="row items-center justify-between q-mb-md">
          <div class="text-h6 text-grey-8">
            {{ searchQuery ? 'Setores Filtrados' : 'Explorar Setores' }}
          </div>
          <q-badge v-if="departments?.length" color="grey-3" text-color="grey-9" label="">
            {{ departments.length }} setores
          </q-badge>
        </div>

        <div class="row q-col-gutter-md">
          <div v-for="dept in departments" :key="dept.uorg_code" class="col-12 col-sm-6 col-md-3">
            <q-card flat bordered class="hover-card clickable full-height" @click="navigateTo(`/department/${dept.uorg_code}`)">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <q-avatar icon="business" color="blue-1" text-color="blue-8" size="md" />
                  <div class="q-ml-md overflow-hidden">
                    <div class="text-weight-bold text-blue-grey-9 ellipsis">{{ dept.name }}</div>
                    <div class="text-caption text-grey-7">{{ dept.initials }}</div>
                  </div>
                </div>
              </q-card-section>
              <q-card-section class="q-py-xs text-caption text-grey-6 border-top-light">
                <q-icon name="people" class="q-mr-xs" /> {{ dept._count?.members || 0 }}
                <q-icon name="account_tree" class="q-ml-md q-mr-xs" /> {{ dept._count?.workflows || 0 }}
              </q-card-section>
            </q-card>
          </div>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup>
const searchQuery = ref("");

// Correção: Desestruturar pending corretamente do useFetch
const { data: departments, pending } = await useFetch("/api/departments", {
  query: { search: searchQuery },
  watch: [searchQuery],
});

// Computeds com proteções de erro (?. e fallback para arrays vazios)
const filteredMembers = computed(() => {
  if (!departments.value || !searchQuery.value) return [];
  const members = new Map();
  const s = searchQuery.value.toLowerCase();

  departments.value.forEach((dept) => {
    dept.members?.forEach((m) => {
      if (m.full_name?.toLowerCase().includes(s) || m.position?.name?.toLowerCase().includes(s)) {
        if (!members.has(m.id)) members.set(m.id, m);
      }
    });
  });
  return Array.from(members.values());
});

const filteredWorkflows = computed(() => {
  if (!departments.value || !searchQuery.value) return [];
  const workflows = [];
  const s = searchQuery.value.toLowerCase();

  departments.value.forEach((dept) => {
    dept.workflows?.forEach((wf) => {
      if (wf.title?.toLowerCase().includes(s) || wf.description?.toLowerCase().includes(s)) {
        workflows.push(wf);
      }
    });
  });
  return workflows;
});

const getAvatarColor = (id) => {
  const colors = ["blue", "teal", "green", "purple", "orange", "red", "cyan"];
  const charCode = id?.toString().charCodeAt(0) || 0;
  return colors[charCode % colors.length];
};
</script>

<style lang="scss" scoped>
.transition-header {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

// Estado Inicial (Google Style)
.search-idle {
  padding-top: 12vh;
  padding-bottom: 5vh;
}

// Estado com Busca Ativa
.search-active {
  padding-top: 2vh;
  padding-bottom: 2vh;
}

.google-search-bar {
  max-width: 600px;
  margin: 0 auto;
  transition: transform 0.3s;
  
  &:focus-within {
    transform: translateY(-2px);
    :deep(.q-field__control) {
      box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
    }
  }
}

.google-font {
  font-family: 'Product Sans', 'Roboto', sans-serif;
  letter-spacing: -1.5px;
}

.max-width-container {
  max-width: 1200px;
}

.hover-card, .hover-card-member {
  transition: all 0.2s ease-in-out;
  border-radius: 12px;
  
  &.clickable:hover {
    cursor: pointer;
    border-color: var(--q-primary);
    background: #fdfdfd;
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.05) !important;
  }
}

.border-top-light {
  border-top: 1px solid rgba(0,0,0,0.03);
}

.animate-fade {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
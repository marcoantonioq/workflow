<template>
  <q-page class="q-pa-md">
    <div v-if="auth.isAuthenticated.value" class="q-mb-lg">
      <q-card flat bordered class="rounded-borders bg-white shadow-1">
        <q-card-section class="q-pa-md">
          <div class="row items-center q-col-gutter-md">
            <div class="col-12 col-sm-auto flex justify-center">
              <q-avatar
                size="64px"
                color="primary"
                text-color="white"
                class="shadow-1"
              >
                {{ auth.userDetails.value?.full_name?.charAt(0).toUpperCase() }}
              </q-avatar>
            </div>

            <div class="col-12 col-sm text-center text-sm-left">
              <div class="text-h6 text-weight-bold">
                {{ auth.userDetails.value?.full_name }}
              </div>
              <div class="text-subtitle2 text-primary">
                {{
                  auth.userDetails.value?.position?.name || "Cargo não definido"
                }}
              </div>
              <div class="text-caption text-grey-7">
                Matrícula: <strong>{{ auth.userId.value }}</strong>
              </div>
            </div>

            <div class="col-12 col-sm-auto flex justify-center justify-sm-end">
              <q-chip
                clickable
                color="blue-1"
                text-color="blue-9"
                icon="domain"
                class="text-weight-bold department-chip"
                @click="
                  navigateTo(
                    `/department/${auth.userDetails.value?.department?.uorg_code}`,
                  )
                "
              >
                <div
                  class="ellipsis-2-lines text-wrap"
                  style="max-width: 250px; line-height: 1.2"
                >
                  {{ auth.userDetails.value?.department?.name || "Geral" }}
                </div>

                <q-tooltip v-if="auth.userDetails.value?.department?.name">
                  Ir para {{ auth.userDetails.value?.department?.name }}
                </q-tooltip>
              </q-chip>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12">
        <q-input
          v-model="searchQuery"
          filled
          bg-color="white"
          placeholder="Pesquisar setores, servidores, processo..."
          hint="A busca percorre nomes, fluxos, documentos e membros"
          debounce="500"
          clearable
        >
          <template v-slot:prepend>
            <q-icon name="search" color="primary" />
          </template>
          <template v-slot:append v-if="pending">
            <q-spinner color="primary" size="xs" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Membros encontrados -->
    <div v-if="searchQuery && filteredMembers.length > 0" class="q-mb-lg">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 row items-center justify-between q-mb-sm">
          <div class="text-h6 text-grey-8">Servidores</div>
          <q-badge color="info" outline class="q-pa-xs">
            {{ filteredMembers.length }} resultado(s)
          </q-badge>
        </div>

        <div
          v-for="member in filteredMembers"
          :key="member.id"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card
            flat
            bordered
            class="hover-card-member cursor-pointer full-height"
            @click="navigateTo(`/members/profile/${member.id}`)"
          >
            <q-card-section>
              <div class="row items-center no-wrap">
                <q-avatar
                  :text-color="getAvatarColor(member.full_name)"
                  :color="`${getAvatarColor(member.id)}-1`"
                  size="md"
                >
                  {{ member.full_name?.charAt(0).toUpperCase() }}
                </q-avatar>
                <div class="q-ml-md col card-content">
                  <div class="text-weight-bold text-blue-grey-9 ">
                    {{ member.full_name }}
                  </div>
                  <div class="text-caption">
                    {{ member?.position?.name || "Cargo não definido" }}
                  </div>
                  <div class="text-caption text-primary q-mt-xs">
                    {{ member?.department_id || "Sem departamento" }}
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="q-py-xs">
              <div class="text-caption text-grey-6">
                <q-icon name="badge" size="12px" class="q-mr-xs" />
                Matrícula: {{ member.id.substring(0, 8).toUpperCase() }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Fluxos encontrados -->
    <div v-if="searchQuery && filteredWorkflows.length > 0" class="q-mb-lg">
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 row items-center justify-between q-mb-sm">
          <div class="text-h6 text-grey-8">Fluxos</div>
          <q-badge color="secondary" outline class="q-pa-xs">
            {{ filteredWorkflows.length }} resultado(s)
          </q-badge>
        </div>

        <div
          v-for="wf in filteredWorkflows"
          :key="wf.id"
          class="col-12 col-sm-6 col-md-4"
        >
          <q-card
            flat
            bordered
            class="hover-card cursor-pointer full-height"
            @click="navigateTo(`/workflow/${wf.id}`)"
          >
            <q-card-section>
              <div class="row items-center no-wrap">
                <q-avatar icon="device_hub" color="teal-1" text-color="teal-9" size="md" />
                <div class="q-ml-md col card-content">
                  <div class="text-weight-bold text-blue-grey-9 ">
                    {{ wf.title }}
                  </div>
                  <div class="text-caption">
                    {{ wf.description || wf.objectives || 'Sem descrição' }}
                  </div>
                  <div class="text-caption text-primary q-mt-xs">
                    {{ wf.departmentName }}
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Departamentos -->
    <div class="row q-col-gutter-md">
      <div class="col-12 row items-center justify-between q-mb-sm">
        <div class="text-h6 text-grey-8">Setores</div>
        <q-badge color="primary" outline class="q-pa-xs">
          {{ departments?.length || 0 }} resultado(s)
        </q-badge>
      </div>

      <template v-if="pending && !departments">
        <div v-for="n in 8" :key="n" class="col-12 col-sm-6 col-md-3">
          <q-card flat bordered>
            <q-item>
              <q-item-section avatar
                ><q-skeleton type="QAvatar"
              /></q-item-section>
              <q-item-section><q-skeleton type="text" /></q-item-section>
            </q-item>
          </q-card>
        </div>
      </template>

      <template v-else>
        <div
          v-for="dept in departments"
          :key="dept.uorg_code"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card
            flat
            bordered
            class="hover-card cursor-pointer full-height"
            @click="navigateTo(`/department/${dept.uorg_code}`)"
          >
            <q-card-section>
              <div class="row items-center no-wrap">
                <q-avatar
                  icon="business"
                  color="blue-1"
                  text-color="blue-8"
                  size="md"
                />
                <div class="q-ml-md">
                  <div class="text-weight-bold text-blue-grey-9 line-height-1 ellipsis-2-lines">
                    {{ dept.name }}
                  </div>
                  <div class="text-caption text-grey-7">
                    {{ dept.initials }}
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-separator inset />

            <q-card-section class="q-py-xs">
              <div class="text-caption text-grey-6 row items-center">
                <q-icon name="people" size="14px" class="q-mr-xs" />
                {{ dept._count?.members || 0 }} membros
                <q-icon
                  name="account_tree"
                  size="14px"
                  class="q-ml-md q-mr-xs"
                />
                {{ dept._count?.workflows || 0 }} fluxos
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div
          v-if="departments?.length === 0"
          class="col-12 flex flex-center q-pa-xl"
        >
          <div class="text-center text-grey-6">
            <q-icon name="search_off" size="64px" />
            <div class="text-h6 q-mt-md">
              Nenhum setor encontrado para "{{ searchQuery }}"
            </div>
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
const auth = useAuth();
const searchQuery = ref("");

const { data: departments, pending } = await useFetch("/api/departments", {
  query: { search: searchQuery },
  watch: [searchQuery],
});

const filteredMembers = computed(() => {
  if (!departments.value || !searchQuery.value) return [];

  const members = new Map();

  departments.value.forEach((dept) => {
    if (dept.members && Array.isArray(dept.members)) {
      dept.members.forEach((member) => {
        const searchLower = searchQuery.value.toLowerCase();
        if (
          member.full_name?.toLowerCase().includes(searchLower) ||
          member.position?.name?.toLowerCase().includes(searchLower)
        ) {
          if (!members.has(member.id)) {
            members.set(member.id, member);
          }
        }
      });
    }
  });

  return Array.from(members.values());
});

const filteredWorkflows = computed(() => {
  if (!departments.value || !searchQuery.value) return [];
  const map = new Map();
  const s = searchQuery.value.toLowerCase();
  departments.value.forEach((dept) => {
    if (dept.workflows && Array.isArray(dept.workflows)) {
      dept.workflows.forEach((wf) => {
        if (
          (wf.title && wf.title.toLowerCase().includes(s)) ||
          (wf.description && wf.description.toLowerCase().includes(s)) ||
          (wf.objectives && wf.objectives.toLowerCase().includes(s))
        ) {
          if (!map.has(wf.id)) {
            map.set(wf.id, { ...wf, departmentName: dept.name, departmentId: dept.uorg_code });
          }
        }
      });
    }
  });
  return Array.from(map.values());
});

const getAvatarColor = (id) => {
  const colors = ["blue", "teal", "green", "purple", "orange", "red", "cyan"];
  const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return colors[hash % colors.length];
};
</script>

<style scoped>
.hover-card,
.hover-card-member {
  transition: all 0.3s ease;
  border-radius: 12px;
}
.hover-card:hover,
.hover-card-member:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
  border-color: var(--q-primary);
}
.line-height-1 {
  line-height: 1.1;
  margin-bottom: 2px;
}
.department-chip {
  height: auto !important;
  padding: 8px 12px;
  transition:
    transform 0.2s,
    background-color 0.2s;
}

.department-chip:hover {
  background-color: #e3f2fd !important;
  transform: scale(1.02);
}

.text-wrap {
  white-space: normal;
  word-wrap: break-word;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* permite truncamento com 2 linhas */
.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-word;
}

/* garante que colunas internas em flex possam encolher e permitir truncamento */
.card-content {
  min-width: 0;
}

/* maior distribuição em telas grandes */
.col-12.col-sm-6.col-md-4.col-lg-3 {
  /* deixado para possíveis futuras classes; uso de col-lg via template se necessário */
}
</style>

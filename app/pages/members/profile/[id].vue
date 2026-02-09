<template>
  <q-page class="q-pa-md">
    <!-- Header com voltar -->
    <div class="q-mb-lg">
      <q-btn
        flat
        round
        dense
        icon="arrow_back"
        @click="navigateTo(-1)"
        class="q-mb-md"
      />
    </div>

    <!-- Loading -->
    <div v-if="pending" class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-skeleton type="QAvatar" class="q-pa-md" />
          <q-skeleton type="text" class="q-pa-md" />
          <q-skeleton type="text" class="q-pa-md" />
        </q-card>
      </div>
      <div class="col-12 col-md-8">
        <q-card flat bordered class="q-pa-md">
          <q-skeleton type="text" />
          <q-skeleton type="text" class="q-mt-md" />
          <q-skeleton type="text" class="q-mt-md" />
        </q-card>
      </div>
    </div>

    <!-- Perfil -->
    <div v-else-if="member" class="row q-col-gutter-md">
      <!-- Card lateral com informações básicas -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="text-center">
          <q-card-section class="q-pa-lg">
            <q-avatar
              :text-color="getAvatarColor(member.id)"
              :color="`${getAvatarColor(member.id)}-1`"
              size="120px"
              class="q-mx-auto shadow-1"
            >
              {{ member.full_name?.charAt(0).toUpperCase() }}
            </q-avatar>
            <div class="text-h6 text-weight-bold q-mt-lg">
              {{ member.full_name }}
            </div>
            <div class="text-subtitle2 text-primary q-mt-xs">
              {{ member.position?.name || "Cargo não definido" }}
            </div>
            <div class="text-caption text-grey-6 q-mt-md">
              <q-icon name="badge" size="16px" class="q-mr-xs" />
              Matrícula: <strong>{{ member.id }}</strong>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-md">
            <div class="text-left">
              <div class="text-caption text-grey-6 text-weight-bold q-mb-md">
                DEPARTAMENTO
              </div>
              <q-chip
                clickable
                color="blue-1"
                text-color="blue-9"
                icon="domain"
                class="full-width"
                @click="navigateTo(`/department/${member.department?.uorg_code}`)"
              >
                <div class="ellipsis">
                  {{ member.department?.name || "Sem departamento" }}
                </div>
              </q-chip>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-md">
            <div class="text-caption text-grey-6 text-weight-bold q-mb-md">
              STATUS
            </div>
            <q-chip
              :color="member.is_active ? 'green-1' : 'red-1'"
              :text-color="member.is_active ? 'green-9' : 'red-9'"
              :icon="member.is_active ? 'check_circle' : 'cancel'"
            >
              {{ member.is_active ? "Ativo" : "Inativo" }}
            </q-chip>
          </q-card-section>
        </q-card>
      </div>

      <!-- Informações detalhadas -->
      <div class="col-12 col-md-8">
        <!-- Informações de Contato -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="bg-blue-1">
            <div class="text-h6 text-weight-bold text-blue-9">
              <q-icon name="mail" size="20px" class="q-mr-xs" />
              Informações de Contato
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12">
                <div class="text-caption text-grey-6 text-weight-bold q-mb-xs">
                  EMAIL
                </div>
                <div class="text-subtitle2">
                  {{ member.email || "Não informado" }}
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-6 text-weight-bold q-mb-xs">
                  TELEFONE
                </div>
                <div class="text-subtitle2">
                  {{ member.phone || "Não informado" }}
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-6 text-weight-bold q-mb-xs">
                  ESTAÇÃO DE TRABALHO
                </div>
                <div class="text-subtitle2">
                  {{ member.workstation || "Não informado" }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Informações Profissionais -->
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="bg-teal-1">
            <div class="text-h6 text-weight-bold text-teal-9">
              <q-icon name="work" size="20px" class="q-mr-xs" />
              Informações Profissionais
            </div>
          </q-card-section>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-6 text-weight-bold q-mb-xs">
                  CARGO
                </div>
                <div class="text-subtitle2">
                  {{ member.position?.name || "Não informado" }}
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-6 text-weight-bold q-mb-xs">
                  DEPARTAMENTO
                </div>
                <div class="text-subtitle2">
                  {{ member.department?.name || "Não informado" }}
                </div>
              </div>
              <div class="col-12">
                <div class="text-caption text-grey-6 text-weight-bold q-mb-xs">
                  HORÁRIO DE ATENDIMENTO
                </div>
                <div class="text-subtitle2">
                  {{ member.service_hours || "Não informado" }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- Data de Criação -->
        <q-card flat bordered>
          <q-card-section class="bg-grey-2">
            <div class="row items-center justify-between">
              <div>
                <div class="text-caption text-grey-6 text-weight-bold">
                  CADASTRO NO SISTEMA
                </div>
                <div class="text-subtitle2">
                  {{ formatDate(member.created_at) }}
                </div>
              </div>
              <q-icon name="calendar_today" size="32px" color="grey-4" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Não encontrado -->
    <div v-else class="flex flex-center q-pa-xl">
      <div class="text-center text-grey-6">
        <q-icon name="person_off" size="64px" />
        <div class="text-h6 q-mt-md">Membro não encontrado</div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const route = useRoute();
const memberId = route.params.id;

const { data: member, pending } = await useFetch(`/api/members/${memberId}`);

const getAvatarColor = (id) => {
  const colors = ["blue", "teal", "green", "purple", "orange", "red", "cyan"];
  const hash = id.charCodeAt(0) + id.charCodeAt(id.length - 1);
  return colors[hash % colors.length];
};

const formatDate = (date) => {
  if (!date) return "Não informado";
  return new Date(date).toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

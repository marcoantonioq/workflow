<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="column q-mb-xl">
      <q-btn
        flat
        dense
        color="primary"
        icon="arrow_back"
        label="Voltar"
        @click="router.back()"
        class="self-start q-mb-md"
      />

      <div class="row items-end q-gutter-x-md">
        <div class="text-h3 text-weight-bold text-grey-9">
          {{ department.name }}
        </div>
        <div class="text-h5 text-grey-6 q-pb-xs">
          | {{ department.initials }}
        </div>
      </div>
      <q-separator
        class="q-mt-sm"
        color="primary"
        size="2px"
        style="width: 100px"
      />
    </div>

    <div v-if="pending" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <div v-else-if="department" class="row q-col-gutter-xl">
      <div class="col-12 col-md-7">
        <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-sm">
          Sobre o Departamento
        </div>
        <q-card flat bordered class="rounded-borders bg-white">
          <q-card-section class="text-body1 text-grey-9 line-height-relaxed">
            <div class="q-mb-lg text-justify">
              {{
                department.responsibilities ||
                "As responsabilidades deste setor ainda não foram detalhadas."
              }}
            </div>

            <q-separator q-my-md />

            <div class="text-weight-bold q-mb-xs">Competências Principais:</div>
            <div class="text-grey-8">
              {{
                department.competencies ||
                "Nenhuma competência técnica mapeada."
              }}
            </div>
          </q-card-section>
        </q-card>

        <div class="row q-gutter-sm q-mt-lg">
          <q-btn
            outline
            rounded
            color="primary"
            label="Fluxos de Processos"
            icon="account_tree"
            no-caps
          />
          <q-btn
            outline
            rounded
            color="primary"
            label="Documentos"
            icon="description"
            no-caps
          />
        </div>
      </div>

      <div class="col-12 col-md-5">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-subtitle1 text-weight-bold text-grey-8">
            Equipe do Setor
          </div>
          <q-badge outline color="primary"
            >{{ department.members?.length || 0 }} Integrantes</q-badge
          >
        </div>

        <q-card flat bordered class="rounded-borders bg-white">
          <q-list separator>
            <q-item
              v-for="member in department.members"
              :key="member.id"
              class="q-py-md"
            >
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" shadow-1>
                  {{ member.full_name.charAt(0).toUpperCase() }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold text-grey-9">
                  {{ member.full_name }}
                </q-item-label>
                <q-item-label caption class="text-primary text-weight-medium">
                  {{ member.position?.name || "Membro" }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn flat round dense icon="contact_mail" color="grey-5">
                  <q-tooltip>Ver contato</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>

            <q-item
              v-if="!department.members?.length"
              class="text-center text-grey-6 q-pa-md"
            >
              Nenhum membro vinculado a este departamento.
            </q-item>
          </q-list>
        </q-card>

        <q-card flat bordered class="q-mt-md rounded-borders bg-blue-grey-1">
          <q-card-section class="q-py-sm">
            <div class="text-subtitle2 text-grey-9 q-mb-sm row items-center">
              <q-icon name="info" color="primary" class="q-mr-xs" />
              Informações de Atendimento
            </div>

            <div class="column q-gutter-y-xs">
              <div class="row items-center text-body2 text-grey-8">
                <q-icon
                  name="schedule"
                  size="xs"
                  color="primary"
                  class="q-mr-sm"
                />
                <span class="text-weight-medium q-mr-xs">Horário:</span>
                {{ department.service_hours || "Não informado" }}
              </div>

              <div
                v-if="department.email"
                class="row items-center text-body2 text-grey-8"
              >
                <q-icon name="mail" size="xs" color="primary" class="q-mr-sm" />
                <span class="text-weight-medium q-mr-xs">E-mail:</span>
                {{ department.email || "Não informado" }}
              </div>

              <div class="row items-center text-body2 text-grey-8">
                <q-icon name="call" size="xs" color="primary" class="q-mr-sm" />
                <span class="text-weight-medium q-mr-xs">Telefone:</span>
                {{ department.phone || "Não informado" }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const { data: department, pending } = await useFetch(
  `/api/department/${route.params.id}`,
);
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}

.line-height-relaxed {
  line-height: 1.6;
}

.text-justify {
  text-align: justify;
  text-justify: inter-word;
}
</style>

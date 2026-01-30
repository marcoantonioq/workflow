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

      <template v-if="department">
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
      </template>
    </div>

    <div v-if="pending" class="flex flex-center q-pa-xl">
      <q-spinner color="primary" size="40px" />
    </div>

    <div v-else-if="department" class="row q-col-gutter-xl">
      <div class="col-12 col-md-7">
        <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-sm">
          Sobre o Departamento
        </div>
        <q-card flat bordered class="rounded-borders bg-white q-mb-lg">
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

        <div v-if="department.faq && department.faq.length > 0" class="q-mb-lg">
          <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-sm">
            Perguntas Frequentes
          </div>
          <q-list bordered class="rounded-borders bg-white">
            <q-expansion-item
              v-for="(item, index) in department.faq"
              :key="index"
              group="faq_group"
              :label="item.pergunta"
              header-class="text-weight-bold text-grey-9"
              expand-separator
            >
              <q-card>
                <q-card-section
                  class="text-grey-9 bg-grey-2"
                  v-html="item.resposta"
                />
              </q-card>
            </q-expansion-item>
          </q-list>
        </div>

        <div class="row q-gutter-sm">
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
        <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-sm">
          Equipe do Setor
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
                  <img
                    v-if="member.photo_url"
                    :src="member.photo_url"
                    style="object-fit: cover"
                  />
                  <template v-else>
                    {{ member.full_name?.charAt(0).toUpperCase() }}
                  </template>
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold text-grey-9">{{
                  member.full_name
                }}</q-item-label>
                <q-item-label caption class="text-primary text-weight-medium">
                  {{ member.position?.name || "Membro" }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <q-card flat bordered class="q-mt-md rounded-borders bg-blue-grey-1">
          <q-card-section class="q-py-md">
            <div class="text-subtitle2 text-grey-9 q-mb-sm row items-center">
              <q-icon name="schedule" color="primary" class="q-mr-xs" />
              Horário de Atendimento
            </div>
            <div class="text-body2 text-grey-8">
              {{ department.service_hours || "Não informado" }}
            </div>

            <q-separator class="q-my-md" />

            <div class="column q-gutter-y-xs">
              <div
                class="row items-center text-caption text-grey-7"
                v-if="department.email"
              >
                <q-icon name="mail" size="14px" class="q-mr-xs" />
                {{ department.email }}
              </div>
              <div
                class="row items-center text-caption text-grey-7"
                v-if="department.phone"
              >
                <q-icon name="phone" size="14px" class="q-mr-xs" />
                {{ department.phone }}
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div v-else class="text-center q-pa-xl text-grey-7">
      <q-icon name="error_outline" size="lg" />
      <p>Departamento não encontrado.</p>
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

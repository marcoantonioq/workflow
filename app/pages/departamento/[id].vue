<template>
  <q-page class="q-pa-md">
    <q-btn
      flat
      color="primary"
      icon="arrow_back"
      label="Voltar"
      @click="router.back()"
      class="q-mb-md"
    />

    <div v-if="pending" class="text-center q-pa-xl">
      <q-spinner-dots color="primary" size="40px" />
    </div>

    <div v-else-if="department">
      <div class="row items-center q-mb-lg">
        <q-avatar
          icon="domain"
          color="primary"
          text-color="white"
          size="lg"
          class="q-mr-md shadow-1"
        />
        <div>
          <div class="text-h4 text-weight-bold">{{ department.name }}</div>
          <div class="text-grey-7">{{ department.competencies }}</div>
        </div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-7">
          <q-card flat bordered class="rounded-borders">
            <q-card-section>
              <div class="text-h6 row items-center">
                Equipe do Setor
                <q-badge color="grey-3" text-color="grey-9" class="q-ml-sm">
                  {{ department.members?.length || 0 }}
                </q-badge>
              </div>
            </q-card-section>

            <q-list separator>
              <q-item
                v-for="comp in department.members"
                :key="comp.id"
                class="q-py-md"
              >
                <q-item-section avatar>
                  <q-icon name="psychology" color="blue-8" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{
                    comp.full_name
                  }}</q-item-label>
                  <q-item-label caption>{{
                    comp.position?.name || "Cargo não definido"
                  }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

// Busca os dados via SSR/Hydration
const { data: department, pending } = await useFetch(
  `/api/department/${route.params.id}`,
);
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>

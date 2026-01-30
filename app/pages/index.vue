<template>
  <q-page class="q-pa-md">
    <div v-if="auth.isAuthenticated.value" class="q-mb-lg">
      <q-card flat bordered class="rounded-borders bg-white">
        <q-card-section class="q-pa-md">
          <div class="row items-center q-col-gutter-md">
            <div class="col-12 col-sm-auto flex justify-center">
              <q-avatar size="64px" color="primary" text-color="white" shadow-1>
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
                color="blue-1"
                text-color="blue-9"
                icon="domain"
                class="text-weight-bold q-ma-none"
              >
                {{ auth.userDetails.value?.department?.name || "Geral" }}
              </q-chip>
              {{ auth.userDetails.value?.department?.competencies }}
            </div>

          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 row items-center justify-between">
        <div class="text-h6">Explorar Outros Setores</div>
        <q-badge color="grey-7"
          >{{ departments?.length || 0 }} setores encontrados</q-badge
        >
      </div>

      <template v-if="pending">
        <div v-for="n in 4" :key="n" class="col-12 col-sm-6 col-md-3">
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
          :key="dept.id"
          class="col-12 col-sm-6 col-md-3"
        >
          <q-card
            flat
            bordered
            class="hover-card cursor-pointer"
            @click="navigateTo(`/departamento/${dept.id}`)"
          >
            <q-card-section class="row items-center no-wrap">
              <q-avatar
                icon="account_tree"
                color="blue-1"
                text-color="blue-8"
                size="md"
              />
              <div class="q-ml-md">
                <div class="text-weight-bold">{{ dept.name }}</div>
                <div class="text-caption text-grey-7">
                  Clique para ver detalhes
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup>
const auth = useAuth();

// Busca os setores usando o hook nativo do Nuxt
const { data: departments, pending } = await useFetch("/api/departments");
</script>

<style scoped>
.hover-card {
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  border-color: var(--q-primary);
}

.rounded-borders {
  border-radius: 12px;
}
.rounded-borders {
  border-radius: 12px;
}
.border-grey {
  border: 1px solid #e0e0e0;
}
.line-height-1 {
  line-height: 1.2;
}</style>

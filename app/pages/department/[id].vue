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
        <section class="q-mb-lg">
          <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-sm">
            Sobre o Setor
          </div>
          <q-card flat bordered class="rounded-borders bg-white">
            <q-card-section class="text-body1 text-grey-9">
              <div class="text-grey-8">
                {{
                  department.competencies ||
                  "Nenhuma competência técnica mapeada."
                }}
              </div>
            </q-card-section>
          </q-card>
        </section>

        <section class="q-mb-lg" v-if="department.members?.length">
          <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-sm">
            Equipe do Setor
          </div>
          <q-card flat bordered class="rounded-borders bg-white">
            <q-list separator>
              <q-item
                v-for="member in department.members"
                :key="member.id"
                class="q-py-md cursor-pointer hover-item"
                clickable
                @click="navigateTo(`/members/profile/${member.id}`)"
              >
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    <img v-if="member.photo_url" :src="member.photo_url" />
                    <template v-else>{{
                      member.full_name?.charAt(0).toUpperCase()
                    }}</template>
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-grey-9">{{
                    member.full_name
                  }}</q-item-label>
                  <q-item-label caption class="text-primary">{{
                    member.position?.name || "Membro"
                  }}</q-item-label>
                  <q-item-label caption v-if="member.phone">
                    <a
                      :href="'https://wa.me/' + member.phone.replace(/\D/g, '')"
                      target="_blank"
                      rel="noopener"
                      class="text-primary"
                      @click.stop
                    >
                      Telefone: {{ member.phone }}
                    </a>
                  </q-item-label>
                  <q-item-label caption v-if="member.mail">
                    <a
                      :href="'mailto:' + member.mail"
                      target="_blank"
                      rel="noopener"
                      class="text-primary"
                      @click.stop
                    >
                      E-mail: {{ member.mail }}
                    </a>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="arrow_forward" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </section>

        <section class="q-mb-lg" v-if="department.faq?.length">
           
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-subtitle1 text-weight-bold text-grey-8">
              Dúvidas Frequentes (FAQ)
            </div>
            <q-btn
              v-if="podeEditar"
              label="Nova Pergunta"
              icon="help_outline"
              color="secondary"
              flat
              dense
              @click="showFaqForm = !showFaqForm"
            />
          </div>

          <q-slide-transition>
            <q-card v-if="showFaqForm" flat bordered class="q-mb-md bg-amber-1">
              <q-card-section class="q-gutter-y-sm">
                <q-input
                  v-model="formFaq.pergunta"
                  label="Pergunta"
                  dense
                  filled
                  bg-color="white"
                />
                <q-input
                  v-model="formFaq.resposta"
                  label="Resposta"
                  type="textarea"
                  dense
                  filled
                  bg-color="white"
                />
                <div class="row justify-end q-gutter-x-md q-mt-sm">
                  <q-btn
                    label="Cancelar"
                    flat
                    color="grey-7"
                    @click="showFaqForm = false"
                  />
                  <q-btn
                    label="Salvar FAQ"
                    color="secondary"
                    :loading="savingFaq"
                    @click="handleSaveFaq"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-slide-transition>

          <q-list
            bordered
            class="rounded-borders bg-white shadow-1"
            :key="faqKey"
          >
            <template v-if="department.faq && department.faq.length > 0">
              <q-expansion-item
                v-for="(item, index) in department.faq"
                :key="'faq-item-' + index"
                group="faq_group"
                :label="item.pergunta"
                header-class="text-weight-bold text-grey-9"
                expand-separator
              >
                <q-card class="bg-grey-2">
                  <q-card-section class="text-grey-9" v-html="item.resposta" />
                  <q-card-actions align="right" v-if="podeEditar">
                    <q-btn
                      flat
                      dense
                      icon="delete"
                      color="negative"
                      label="Remover"
                      @click="handleRemoveFaq(index)"
                    />
                  </q-card-actions>
                </q-card>
              </q-expansion-item>
            </template>
            <q-item v-else class="text-grey-6 italic q-pa-lg text-center"
              >Nenhum FAQ cadastrado.</q-item
            >
          </q-list>
        </section>
      </div>

      <div class="col-12 col-md-5">
        <section class="q-mb-xl" v-if="department.documents?.length">
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-subtitle1 text-weight-bold text-grey-8">
              Documentos e Manuais
            </div>
            <q-btn
              v-if="podeEditar"
              label="Novo"
              icon="add"
              color="primary"
              flat
              dense
              @click="showDocForm = !showDocForm"
            />
          </div>

          <q-slide-transition>
            <q-card
              v-if="showDocForm"
              flat
              bordered
              class="q-mb-md bg-blue-grey-1"
            >
              <q-card-section class="q-gutter-y-sm">
                <q-input
                  v-model="formDoc.title"
                  label="Título"
                  dense
                  filled
                  bg-color="white"
                />
                <q-input
                  v-model="formDoc.url"
                  label="URL do Link"
                  dense
                  filled
                  bg-color="white"
                />
                <div class="row justify-end q-gutter-x-md q-mt-sm">
                  <q-btn label="Cancelar" flat @click="showDocForm = false" />
                  <q-btn
                    label="Salvar"
                    color="primary"
                    :loading="uploading"
                    @click="handleUploadDoc"
                  />
                </div>
              </q-card-section>
            </q-card>
          </q-slide-transition>

          <q-list
            bordered
            separator
            class="rounded-borders bg-white shadow-1"
            :key="docKey"
          >
            <template
              v-if="department.documents && department.documents.length > 0"
            >
              <q-item
                v-for="(doc, i) in department.documents"
                :key="'doc-' + i"
              >
                <q-item-section avatar>
                  <q-icon name="description" color="primary" />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{
                    doc.title
                  }}</q-item-label>
                  <q-item-label caption lines="1" class="text-blue">{{
                    doc.url
                  }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-gutter-xs">
                    <q-btn
                      flat
                      round
                      icon="open_in_new"
                      color="primary"
                      :href="doc.url"
                      target="_blank"
                    />
                    <q-btn
                      v-if="podeEditar"
                      flat
                      round
                      icon="delete"
                      color="negative"
                      @click="handleRemoveDoc(doc.url)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </template>
            <q-item v-else class="text-grey-6 italic q-pa-lg text-center"
              >Nenhum documento.</q-item
            >
          </q-list>
        </section>

        <section v-if="department.relatedWorkflows?.length">
          <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-sm">
            Fluxos de Processos
          </div>
          <q-list bordered separator class="rounded-borders bg-white shadow-1">
            <template v-if="department.relatedWorkflows?.length">
              <q-item
                v-for="workflow in department.relatedWorkflows"
                :key="workflow.id"
                clickable
                @click="router.push(`/workflow/${workflow.id}`)"
              >
                <q-item-section avatar>
                  <q-icon
                    :name="
                      workflow.department_id === department.uorg_code
                        ? 'account_tree'
                        : 'alt_route'
                    "
                    :color="
                      workflow.department_id === department.uorg_code
                        ? 'primary'
                        : 'orange'
                    "
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{
                    workflow.title
                  }}</q-item-label>
                  <q-item-label caption lines="1">{{
                    workflow.description
                  }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-badge
                    :color="
                      workflow.department_id === department.uorg_code
                        ? 'blue-2'
                        : 'orange-2'
                    "
                    :text-color="
                      workflow.department_id === department.uorg_code
                        ? 'blue-9'
                        : 'orange-9'
                    "
                  >
                    {{
                      workflow.department_id === department.uorg_code
                        ? "Dono"
                        : "Envolvido"
                    }}
                  </q-badge>
                </q-item-section>
              </q-item>
            </template>
            <q-item v-else class="text-grey-6 italic q-pa-lg text-center"
              >Nenhum processo vinculado.</q-item
            >
          </q-list>
        </section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { useQuasar } from "quasar";

const route = useRoute();
const router = useRouter();
const auth = useAuth();
const $q = useQuasar();

// 1. FETCH DE DADOS
const { data: department, pending } = await useFetch(
  `/api/department/${route.params.id}`,
);

// 2. CHAVES DE REATIVIDADE E ESTADOS
const faqKey = ref(0);
const docKey = ref(0);
const showDocForm = ref(false);
const showFaqForm = ref(false);
const uploading = ref(false);
const savingFaq = ref(false);

const formDoc = ref({ title: "", url: "" });
const formFaq = ref({ pergunta: "", resposta: "" });

const podeEditar = computed(
  () =>
    auth?.isAuthenticated?.value &&
    auth?.userDetails?.value?.department_id === department.value?.uorg_code,
);

// 3. FUNÇÃO DE CÓPIA PROFUNDA (FORÇA O VUE A NOTAR MUDANÇAS)
function syncState() {
  department.value = { ...department.value };
  faqKey.value++;
  docKey.value++;
}

// 4. MÉTODOS FAQ (COM DEEP COPY)
async function handleSaveFaq() {
  if (!formFaq.value.pergunta.trim()) return;
  savingFaq.value = true;
  try {
    const currentFaq = Array.isArray(department.value.faq)
      ? [...department.value.faq]
      : [];
    const novoFaq = [...currentFaq, { ...formFaq.value }];

    await $fetch(`/api/department/${route.params.id}/faq`, {
      method: "PUT",
      body: { faq: novoFaq },
      headers: { "x-user-department": auth.userDetails.value.department_id },
    });

    // Atualização do estado com Cópia Profunda
    department.value.faq = novoFaq;
    syncState();

    formFaq.value = { pergunta: "", resposta: "" };
    showFaqForm.value = false;
    $q.notify({ color: "positive", message: "FAQ atualizado!" });
  } catch (e) {
    $q.notify({ color: "negative", message: "Erro ao salvar FAQ." });
  } finally {
    savingFaq.value = false;
  }
}

async function handleRemoveFaq(index) {
  $q.dialog({
    title: "Confirmar",
    message: "Excluir esta pergunta?",
    cancel: true,
  }).onOk(async () => {
    try {
      const novoFaq = department.value.faq.filter((_, i) => i !== index);
      await $fetch(`/api/department/${route.params.id}/faq`, {
        method: "PUT",
        body: { faq: novoFaq },
      });

      department.value.faq = novoFaq;
      syncState();
      $q.notify({ color: "info", message: "Pergunta removida." });
    } catch (e) {
      $q.notify({ color: "negative", message: "Erro ao excluir." });
    }
  });
}

// 5. MÉTODOS DOCUMENTOS (COM DEEP COPY)
async function handleUploadDoc() {
  if (!formDoc.value.url) return;
  uploading.value = true;
  try {
    const res = await $fetch(`/api/department/${route.params.id}/upload`, {
      method: "POST",
      body: formDoc.value,
      headers: { "x-user-department": auth.userDetails.value.department_id },
    });

    const currentDocs = Array.isArray(department.value.documents)
      ? [...department.value.documents]
      : [];
    const novoDoc = { title: formDoc.value.title, url: res.url };

    // Atualiza o estado com o novo documento
    department.value.documents = [...currentDocs, novoDoc];
    syncState();

    formDoc.value = { title: "", url: "" };
    showDocForm.value = false;
    $q.notify({ color: "positive", message: "Documento enviado!" });
  } catch (e) {
    $q.notify({ color: "negative", message: "Erro ao enviar documento." });
  } finally {
    uploading.value = false;
  }
}

async function handleRemoveDoc(url) {
  $q.dialog({
    title: "Confirmar",
    message: "Excluir este documento?",
    cancel: true,
  }).onOk(async () => {
    try {
      const novoDocs = department.value.documents.filter(
        (doc) => doc.url !== url
      );
      await $fetch(`/api/department/${route.params.id}/documents`, {
        method: "PUT",
        body: { documents: novoDocs },
      });

      department.value.documents = novoDocs;
      syncState();
      $q.notify({ color: "info", message: "Documento removido." });
    } catch (e) {
      $q.notify({ color: "negative", message: "Erro ao excluir documento." });
    }
  });
}
</script>

<style scoped>
.hover-item {
  transition: background-color 0.2s ease;
}

.hover-item:hover {
  background-color: rgba(33, 150, 243, 0.05);
}
</style>

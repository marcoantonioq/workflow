<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-lg">
      <q-btn
        flat
        no-caps
        color="primary"
        icon="arrow_back"
        label="Voltar"
        @click="router.back()"
        class="border-radius-8"
      />
      <q-space />
      <q-badge v-if="member?.created_at" outline color="grey-7" class="q-pa-sm">
        Sincronizado em: {{ formatDateShort(member.created_at) }}
      </q-badge>
    </div>

    <div v-if="pending" class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-16">
          <q-skeleton type="rect" height="400px" class="border-radius-16" />
        </q-card>
      </div>
      <div class="col-12 col-md-8">
        <q-card flat class="q-pa-md border-radius-16">
          <q-skeleton type="text" class="q-mb-md" />
          <q-skeleton type="rect" height="300px" />
        </q-card>
      </div>
    </div>

    <div v-else-if="member" class="row q-col-gutter-md">
      <div class="col-12 col-md-4">
        <q-card flat class="border-radius-16 shadow-1 sticky-card">
          <q-card-section class="text-center q-pa-xl">
            <q-avatar size="140px" class="shadow-3 q-mb-md">
              <img v-if="member.photo_url" :src="member.photo_url">
              <div v-else :class="`bg-${getAvatarColor(member.id)} text-white full-width full-height flex flex-center text-h3`">
                {{ member.full_name?.charAt(0).toUpperCase() }}
              </div>
            </q-avatar>

            <div class="text-h5 text-weight-bold text-grey-9">{{ member.full_name }}</div>
            <div class="text-subtitle1 text-primary text-weight-medium q-mt-xs">
              {{ member.position?.name || member.position_id || "Cargo não definido" }}
            </div>
            
            <div class="row justify-center q-gutter-sm q-mt-md">
              <q-chip :color="member.is_active ? 'green-1' : 'red-1'" 
                      :text-color="member.is_active ? 'green-9' : 'red-9'"
                      size="sm" icon="fiber_manual_record" class="text-weight-bold">
                {{ member.is_active ? 'ATIVO' : 'INATIVO' }}
              </q-chip>
              <q-chip v-if="member.pgd && !member.pgd.includes('Não')" 
                      color="deep-purple-1" text-color="deep-purple-9" 
                      size="sm" icon="laptop_mac" class="text-weight-bold">
                {{ member.pgd }}
              </q-chip>
            </div>
          </q-card-section>

          <q-separator inset />

          <q-card-section class="q-pa-md">
            <div class="info-group q-mb-md">
              <div class="text-overline text-grey-6 q-mb-xs">
                <q-icon name="business" color="primary" size="20px" class="q-mr-md" />
                Lotação e Local</div>
              <div class="row items-center q-mb-sm">
                <div>
                  <div class="text-weight-bold text-grey-9">{{ member.department?.name || member.department_id }}</div>
                  <div class="text-caption text-grey-7">{{ member.workstation || 'Campus Cidade de Goiás' }}</div>
                </div>
              </div>
            </div>

            <div class="info-group q-mb-md">
              <div class="text-overline text-grey-6 q-mb-xs">
                <q-icon name="schedule" color="orange-8" size="20px" class="q-mr-md q-mt-xs" /> Expediente</div>
              <div class="row items-start q-mb-sm">
                <div>
                  <div class="text-body2 text-grey-9 text-weight-medium whitespace-pre-wrap line-height-1-4">
                    {{ member.service_hours || 'Horário institucional' }}
                  </div>
                </div>
              </div>
              
              <div v-if="member.dt_exercicio" class="row items-center">
                <q-icon name="event_available" color="green-7" size="20px" class="q-mr-md" />
                <div>
                  <div class="text-body2 text-grey-9 text-weight-medium">
                    {{ formatDate(member.dt_exercicio) }}
                  </div>
                  <div class="text-caption text-grey-6">Início em Exercício</div>
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat class="border-radius-16 shadow-1 q-mb-md">
          <q-card-section class="bg-white row items-center">
            <q-icon name="description" color="primary" size="sm" class="q-mr-sm" />
            <div class="text-h6 text-weight-bold text-grey-9">Principais Atribuições e Atividades</div>
          </q-card-section>
          
          <q-card-section class="q-pt-none">
            <div 
              v-if="member.main_activities" 
              class="activities-container text-grey-8 q-pa-sm"
              v-html="formatActivities(member.main_activities)"
            ></div>
            <div v-else class="text-italic text-grey-6 q-pa-lg text-center">
              Nenhuma atividade detalhada cadastrada para este membro.
            </div>
            
            <div v-if="member.role || member.access_rule" class="row q-gutter-sm q-mt-md q-px-sm">
              <q-badge v-if="member.role" color="blue-grey-1" text-color="blue-grey-9" class="q-pa-sm border-radius-8">
                <q-icon name="security" class="q-mr-xs" /> 
                <span class="text-weight-medium">Função:</span> {{ member.role }}
              </q-badge>
              <q-badge v-if="member.access_rule" color="orange-1" text-color="orange-10" class="q-pa-sm border-radius-8">
                <q-icon name="rule" class="q-mr-xs" /> 
                <span class="text-weight-medium">Regra:</span> {{ member.access_rule }}
              </q-badge>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat class="border-radius-16 shadow-1">
          <q-card-section class="q-pb-none">
            <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-sm">Canais de Contato</div>
          </q-card-section>
          
          <q-list class="q-px-sm q-pb-md">
            <q-item 
              v-if="member.email"
              clickable 
              @click="handleEmailClick(member.email)"
              class="q-py-md text-link border-radius-12 q-mb-sm"
            >
              <q-item-section avatar>
                <q-avatar color="blue-1" text-color="blue-9" icon="alternate_email" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>E-mail Institucional</q-item-label>
                <q-item-label class="text-weight-medium text-primary">{{ member.email }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round color="blue-3" icon="content_copy" size="sm" />
              </q-item-section>
            </q-item>

            <q-item 
              v-if="member.phone"
              clickable 
              @click="handlePhoneClick(member.phone)"
              class="q-py-md text-link border-radius-12"
            >
              <q-item-section avatar>
                <q-avatar color="green-1" text-color="green-9" icon="chat" />
              </q-item-section>
              <q-item-section>
                <q-item-label caption>WhatsApp / Telefone</q-item-label>
                <q-item-label class="text-weight-medium text-green-9">{{ member.phone }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round color="green-3" icon="content_copy" size="sm" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <div v-else class="column flex-center q-pa-xl">
      <q-icon name="person_search" size="100px" color="grey-4" />
      <div class="text-h5 text-grey-6 q-mt-md">Membro não localizado</div>
      <q-btn 
        outline 
        color="primary" 
        label="Retornar à listagem" 
        class="q-mt-lg border-radius-8" 
        @click="router.push('/members')" 
      />
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar, copyToClipboard } from 'quasar';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const memberId = route.params.id;

const { data: member, pending } = await useFetch(`/api/members/${memberId}`);

/**
 * Converte asteriscos em lista HTML
 */
const formatActivities = (text) => {
  if (!text) return '';
  if (text.includes('*')) {
    const items = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => `<li>${line.replace(/^\*\s?/, '')}</li>`)
      .join('');
    return `<ul class="custom-list">${items}</ul>`;
  }
  return text.replace(/\n/g, '<br>');
};

/**
 * Handlers de Contato (Copy + Open New Tab)
 */
const handleEmailClick = (email) => {
  copyToClipboard(email).then(() => {
    $q.notify({ message: 'E-mail copiado!', color: 'blue-8', icon: 'content_paste', position: 'bottom', timeout: 1500 });
    window.open(`mailto:${email}`, '_blank');
  });
};

const handlePhoneClick = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.length <= 11 ? `55${cleanPhone}` : cleanPhone;
  copyToClipboard(phone).then(() => {
    $q.notify({ message: 'Telefone copiado!', color: 'green-8', icon: 'whatsapp', position: 'bottom', timeout: 1500 });
    window.open(`https://api.whatsapp.com/send?phone=${phoneWithCountry}`, '_blank');
  });
};

/**
 * UI Helpers
 */
const getAvatarColor = (id) => {
  if (!id) return "grey-5";
  const palette = ["blue-7", "indigo-7", "teal-7", "deep-purple-7", "green-7", "orange-8", "cyan-8"];
  const index = String(id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return palette[index % palette.length];
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
};

const formatDateShort = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};
</script>

<style scoped>
.border-radius-16 { border-radius: 16px; }
.border-radius-12 { border-radius: 12px; }
.border-radius-8 { border-radius: 8px; }

.sticky-card {
  position: sticky;
  top: 24px;
}

.text-mono {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
}

.info-group {
  padding: 8px 4px;
}

.activities-container {
  line-height: 1.7;
  font-size: 1.05rem;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}

.line-height-1-4 {
  line-height: 1.4;
}

:deep(.custom-list) {
  margin: 0;
  padding-left: 1.2rem;
  list-style-type: disc;
}

:deep(.custom-list li) {
  margin-bottom: 10px;
  color: #424242;
}

.text-link {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.text-link:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
</style>
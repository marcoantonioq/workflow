<template>
  <q-btn
    flat
    no-caps
    :color="color"
    :icon="icon"
    :label="label"
    :size="size"
    :class="['border-radius-8 font-medium', customClass]"
    v-bind="$attrs"
    @click="handleClick"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  label: {
    type: String,
    default: 'Voltar'
  },
  icon: {
    type: String,
    default: 'arrow_back'
  },
  color: {
    type: String,
    default: 'primary'
  },
  // 'md' é o padrão do Quasar. '15px' ou '16px' dá um controle fino.
  size: {
    type: String,
    default: 'md' 
  },
  class: {
    type: String,
    default: ''
  },
  to: {
    type: [String, Object],
    default: null
  }
})

const customClass = props.class

const handleClick = () => {
  if (!props.to) {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }
}
</script>

<style scoped>
.border-radius-8 {
  border-radius: 8px;
}

/* Ajuste fino: 1.1rem (aprox 17.6px) fica entre o padrão (14px) 
  e o H6 (20px), ideal para botões com leitura clara.
*/
.font-medium {
  font-size: 1.1rem;
  font-weight: 500;
}
</style>
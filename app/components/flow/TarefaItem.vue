<template>
  <q-card flat bordered class="q-mb-sm bg-white shadow-1 task-card">
    <div 
      class="task-accent" 
      :class="modelValue.title ? 'bg-primary' : 'bg-grey-4'"
    ></div>

    <div class="row items-start no-wrap q-pa-sm">
      <div class="column items-center q-gutter-y-xs q-pr-sm border-right-light">
        <q-icon
          v-if="!readonly"
          name="drag_indicator"
          class="handle-tarefa cursor-pointer text-grey-5"
          size="sm"
        >
          <q-tooltip>Arraste para reordenar</q-tooltip>
        </q-icon>
        
        <q-btn
          flat round dense
          :icon="isMinimized ? 'expand_more' : 'expand_less'"
          :color="isMinimized ? 'grey-6' : 'primary'"
          size="xs"
          @click="patchValue('_minimized', !isMinimized)"
        >
          <q-tooltip>{{ isMinimized ? 'Expandir' : 'Recolher' }}</q-tooltip>
        </q-btn>
      </div>

      <div class="row q-col-gutter-md full-width items-start q-ml-xs">
        <div :class="isMinimized ? 'col-12' : 'col-12 col-md-5'">
          <q-input
            :model-value="modelValue.title"
            @update:model-value="val => patchValue('title', val)"
            label="Título da Tarefa"
            outlined dense bg-color="white"
            :readonly="readonly"
            :borderless="isMinimized"
            class="text-weight-bold"
            placeholder="Digite o título para iniciar..."
          >
            <template v-slot:prepend v-if="!isMinimized">
              <q-icon name="label" size="xs" color="primary" />
            </template>
            <template v-slot:append v-if="isMinimized">
               <q-badge color="grey-3" text-color="grey-8" label="Modo compacto" />
            </template>
          </q-input>

          <q-slide-transition>
            <div v-show="!isMinimized" class="q-mt-sm">
              <div class="row items-center q-mb-xs">
                <q-icon name="description" color="grey-7" size="xs" class="q-mr-xs" />
                <label class="text-weight-bold text-grey-8 uppercase text-caption tracking-wider">Instruções</label>
              </div>
              <q-editor
                v-model="descriptionSafe"
                min-height="6rem"
                flat bordered
                class="custom-editor rounded-borders"
                :readonly="readonly"
                :toolbar="[['bold', 'italic'], ['unordered', 'ordered', 'link'], ['fullscreen']]"
              />
            </div>
          </q-slide-transition>
        </div>

        <template v-if="(modelValue.title || readonly) && !isMinimized">
          <div class="col-12 col-md-5">
            <div class="row q-col-gutter-sm">
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-7 q-mb-xs">Setores</div>
                <q-select
                  :model-value="modelValue.setores"
                  @update:model-value="val => patchValue('setores', val)"
                  multiple use-chips dense outlined bg-color="white"
                  :options="optsSetores" :readonly="readonly"
                >
                  <template v-slot:prepend><q-icon name="groups" size="xs" /></template>
                </q-select>
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-caption text-grey-7 q-mb-xs">Sistemas</div>
                <q-select
                  :model-value="modelValue.sistemas"
                  @update:model-value="val => patchValue('sistemas', val)"
                  multiple use-chips dense outlined bg-color="white"
                  :options="optsSistemas" :readonly="readonly"
                >
                  <template v-slot:prepend><q-icon name="computer" size="xs" /></template>
                </q-select>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-2 self-center text-right" v-if="!readonly">
            <div class="inline-block bg-grey-2 q-pa-xs rounded-borders">
              <q-btn
                icon="tune" flat round dense size="sm"
                @click="patchValue('expand', !modelValue.expand)"
                :color="modelValue.expand ? 'primary' : 'grey-7'"
              />
              <q-btn
                icon="delete_outline" flat round dense size="sm" color="negative"
                @click="$emit('remove')"
              />
            </div>
          </div>
        </template>
      </div>
    </div>

    <q-slide-transition>
      <div v-if="modelValue.expand && modelValue.title && !isMinimized" class="q-pa-md bg-blue-grey-1 border-top">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-3">
            <q-input
              :model-value="modelValue.deadline_minutes"
              @update:model-value="val => patchValue('deadline_minutes', val)"
              type="number" label="Prazo" outlined dense bg-color="white" suffix="min"
              :readonly="readonly"
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-input 
              :model-value="modelValue.insumos" 
              @update:model-value="val => patchValue('insumos', val)"
              label="Insumos" outlined dense bg-color="white" autogrow :readonly="readonly" 
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-input 
              :model-value="modelValue.riscos" 
              @update:model-value="val => patchValue('riscos', val)"
              label="Riscos" outlined dense bg-color="white" autogrow :readonly="readonly" 
            />
          </div>
          <div class="col-12 col-sm-3">
            <q-input 
              :model-value="modelValue.solucoes" 
              @update:model-value="val => patchValue('solucoes', val)"
              label="Soluções" outlined dense bg-color="white" autogrow :readonly="readonly" 
            />
          </div>
        </div>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
  readonly: { type: Boolean, default: false },
  optsSetores: { type: Array, default: () => [] },
  optsSistemas: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "remove"]);

// Atualização de campos com preservação de imutabilidade
const patchValue = (field, value) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  });
};

// Computed para o editor evitar erros de valor nulo
const descriptionSafe = computed({
  get: () => props.modelValue.description ?? '',
  set: (val) => patchValue('description', val)
});

const isMinimized = computed(() => !!props.modelValue._minimized);
</script>

<style scoped>
.task-card { position: relative; transition: all 0.3s ease; overflow: hidden; }
.task-accent { position: absolute; left: 0; top: 0; bottom: 0; width: 4px; }
.border-right-light { border-right: 1px solid #f0f0f0; }
.custom-editor { border: 1px solid #ced4da !important; }
.border-top { border-top: 1px solid #e0e0e0; }
.handle-tarefa:hover { color: var(--q-primary) !important; }
:deep(.q-field--outlined .q-field__control) { border-radius: 8px; }
</style>
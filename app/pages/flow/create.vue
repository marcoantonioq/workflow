<template>
  <q-page padding class="row justify-center bg-grey-2">
    <div class="col-12 col-sm-11 col-md-10 col-lg-11">
      
      <q-card flat bordered class="q-mb-lg bg-white no-print shadow-1">
        <q-card-section class="row items-center q-col-gutter-sm">
          <div class="col-12 col-md-4">
            <div class="text-h6 text-primary text-weight-bolder uppercase">Mapeamento IFG</div>
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="filtroBusca" placeholder="Pesquisar em tudo..." dense outlined bg-color="white">
              <template v-slot:append><q-icon name="search" /></template>
            </q-input>
          </div>
          <div class="col-12 col-md-4 text-right q-gutter-xs">
            <q-btn :icon="isReadOnly ? 'edit' : 'visibility'" :color="isReadOnly ? 'orange' : 'secondary'" :label="isReadOnly ? 'Editar' : 'Visualizar'" @click="isReadOnly = !isReadOnly" unelevated />
            <q-btn color="primary" icon="download" @click="exportarTudo" unelevated />
          </div>
        </q-card-section>
      </q-card>

      <draggable 
        v-model="listaFluxos" 
        item-key="id" 
        handle=".handle-fluxo" 
        :disabled="isReadOnly" 
        :force-fallback="true"
        :scroll-sensitivity="150"
        ghost-class="ghost"
        @end="garantirItensEmBranco"
      >
        <template #item="{ element: fluxo, index: fIndex }">
          <q-card v-if="matchBusca(fluxo)" flat bordered class="q-mb-xl bg-white shadow-1 overflow-hidden">
            
            <q-toolbar class="bg-primary text-white">
              <q-icon v-if="!isReadOnly" name="drag_indicator" class="handle-fluxo cursor-pointer q-mr-sm" />
              <q-toolbar-title class="text-subtitle1 text-weight-bold">
                {{ isReadOnly ? (fluxo.identificacao || 'Fluxo sem título') : `FLUXO #${fIndex + 1}: ${fluxo.identificacao || 'Sem identificação'}` }}
              </q-toolbar-title>
              <q-btn v-if="!isReadOnly" flat round icon="content_copy" size="sm" @click="duplicarFluxo(fIndex)" />
              <q-btn v-if="!isReadOnly" flat round icon="delete" size="sm" @click="removerFluxo(fIndex)" />
            </q-toolbar>

            <q-card-section class="row q-col-gutter-md">
              <template v-if="!isReadOnly">
                <q-input v-model="fluxo.identificacao" label="IDENTIFICAÇÃO DO FLUXO" filled dense class="col-12" @update:model-value="garantirItensEmBranco" />
                <q-input v-model="fluxo.descricao" label="DESCRIÇÃO" filled dense autogrow class="col-12 col-md-4" />
                <q-input v-model="fluxo.objetivos" label="OBJETIVOS" filled dense autogrow class="col-12 col-md-4" />
                <q-input v-model="fluxo.documentos" label="DOCUMENTOS" filled dense autogrow class="col-12 col-md-4" />
              </template>
              <div v-else class="col-12 row q-col-gutter-sm">
                <div class="col-md-4 col-12"><b>Descrição:</b> {{ fluxo.descricao || '---' }}</div>
                <div class="col-md-4 col-12"><b>Objetivos:</b> {{ fluxo.objetivos || '---' }}</div>
                <div class="col-md-4 col-12"><b>Documentos:</b> {{ fluxo.documentos || '---' }}</div>
              </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <draggable v-model="fluxo.etapas" item-key="id" handle=".handle-etapa" :disabled="isReadOnly" :force-fallback="true" @end="garantirItensEmBranco">
                <template #item="{ element: etapa, index: eIndex }">
                  <div class="q-mb-lg q-pa-sm border-etapa">
                    <div class="row items-center q-mb-sm q-pa-sm bg-grey-3 rounded-borders">
                      <q-icon v-if="!isReadOnly" name="reorder" class="handle-etapa cursor-pointer q-mr-sm text-grey-6" />
                      <div class="text-subtitle2 text-weight-bolder text-secondary q-mr-md">ETAPA {{ eIndex + 1 }}</div>
                      <q-input v-if="!isReadOnly" v-model="etapa.nome_etapa" dense borderless class="col-grow text-weight-bold" placeholder="Nome da Etapa" @update:model-value="garantirItcheEmBranco" />
                      <div v-else class="text-subtitle2 text-weight-bold col-grow">{{ etapa.nome_etapa }}</div>
                      <q-btn v-if="!isReadOnly" icon="close" flat round size="xs" color="grey-7" @click="removerEtapa(fIndex, eIndex)" />
                    </div>

                    <div class="q-pl-md">
                      <draggable v-model="etapa.tarefas" item-key="id" handle=".handle-tarefa" :disabled="isReadOnly" :force-fallback="true" @end="garantirItensEmBranco">
                        <template #item="{ element: tarefa, index: tIndex }">
                          <q-card flat bordered class="q-mb-sm bg-grey-1">
                            <div class="row items-center q-pa-xs no-wrap">
                              <q-icon v-if="!isReadOnly" name="drag_handle" size="xs" class="handle-tarefa cursor-pointer q-px-xs text-grey-4" />
                              <div class="row q-col-gutter-sm full-width items-center">
                                <div class="col-12 col-md-4">
                                  <q-input v-if="!isReadOnly" v-model="tarefa.nome" label="Tarefa" dense filled @update:model-value="garantirItensEmBranco" />
                                  <div v-else class="text-weight-bold">{{ tarefa.nome }}</div>
                                </div>

                                <div class="col-12 col-md-3">
                                  <q-select
                                    v-if="!isReadOnly"
                                    filled dense multiple use-input use-chips
                                    v-model="tarefa.setores"
                                    label="Setores"
                                    :options="opcoesSetoresFiltradas"
                                    @filter="filterSetores"
                                    @new-value="(val, done) => createValue(val, done, fIndex, eIndex, tIndex, 'setores')"
                                    class="bg-white"
                                  />
                                  <div v-else><q-chip v-for="s in tarefa.setores" :key="s" color="blue-1" dense>{{s}}</q-chip></div>
                                </div>

                                <div class="col-12 col-md-3">
                                  <q-select
                                    v-if="!isReadOnly"
                                    filled dense multiple use-input use-chips
                                    v-model="tarefa.sistemas"
                                    label="Sistemas"
                                    :options="opcoesSistemasFiltradas"
                                    @filter="filterSistemas"
                                    @new-value="(val, done) => createValue(val, done, fIndex, eIndex, tIndex, 'sistemas')"
                                    class="bg-white"
                                  />
                                  <div v-else><q-chip v-for="s in tarefa.sistemas" :key="s" color="green-1" dense>{{s}}</q-chip></div>
                                </div>
                                
                                <div class="col-grow text-right" v-if="!isReadOnly">
                                  <q-btn icon="tune" flat round size="sm" :color="tarefa.expand ? 'primary' : 'grey-7'" @click="tarefa.expand = !tarefa.expand" />
                                  <q-btn icon="delete" flat round size="sm" color="negative" @click="removerTarefa(fIndex, eIndex, tIndex)" />
                                </div>
                              </div>
                            </div>

                            <q-slide-transition>
                              <div v-if="tarefa.expand || isReadOnly" class="q-pa-md bg-white border-top-dashed">
                                <div class="row q-col-gutter-md">
                                  <q-input v-model="tarefa.insumos" label="Insumos" filled dense class="col-12 col-md-4" autogrow :readonly="isReadOnly" />
                                  <q-input v-model="tarefa.problemas" label="Problemas" filled dense class="col-12 col-md-4" autogrow :readonly="isReadOnly" />
                                  <q-input v-model="tarefa.solucoes" label="Soluções" filled dense class="col-12 col-md-4" autogrow :readonly="isReadOnly" />
                                  <q-input v-model="tarefa.prazos" label="Prazos (horas)" filled dense class="col-12 col-md-6" :readonly="isReadOnly" />
                                  <q-input v-model="tarefa.base_legal" label="Base Legal" filled dense class="col-12 col-md-6" :readonly="isReadOnly" />
                                </div>
                              </div>
                            </q-slide-transition>
                          </q-card>
                        </template>
                      </draggable>
                    </div>
                  </div>
                </template>
              </draggable>
            </q-card-section>
          </q-card>
        </template>
      </draggable>

    </div>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import draggable from 'vuedraggable'
import { exportFile, useQuasar } from 'quasar'

const $q = useQuasar()
const isReadOnly = ref(false)
const filtroBusca = ref('')

// OPÇÕES ESTÁTICAS PARA O AUTOCOMPLETE
const opcoesSistemasBase = ['Whatsapp', 'E-mail', 'SUAP', 'SEI', 'Teams', 'Google Drive']
const opcoesSetoresBase = [
  'GOI-CIEEGOI-CCBA', 'GOI-CCBCIN', 'GOI-CCLAV', 
  'GOI-CCTIAG', 'GOI-CCTIAU', 'REITORIA-DAA', 'ADM-COORD'
]

const opcoesSistemasFiltradas = ref(opcoesSistemasBase)
const opcoesSetoresFiltradas = ref(opcoesSetoresBase)

const generateId = () => Math.random().toString(36).substring(2, 9)

const factoryTarefa = () => ({ 
  id: generateId(), nome: '', setores: [], sistemas: [], 
  insumos: '', problemas: '', solucoes: '', prazos: '', base_legal: '', expand: false 
})
const factoryEtapa = () => ({ id: generateId(), nome_etapa: '', tarefas: [factoryTarefa()] })
const factoryFluxo = () => ({ id: generateId(), identificacao: '', descricao: '', objetivos: '', documentos: '', etapas: [factoryEtapa()] })

const listaFluxos = ref([factoryFluxo()])

// --- FILTROS PARA O AUTOCOMPLETE ---
const filterSistemas = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    opcoesSistemasFiltradas.value = opcoesSistemasBase.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}

const filterSetores = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    opcoesSetoresFiltradas.value = opcoesSetoresBase.filter(v => v.toLowerCase().indexOf(needle) > -1)
  })
}

// --- CRIAR NOVOS VALORES (ENTER OU VÍRGULA) ---
const createValue = (val, done, fIdx, eIdx, tIdx, field) => {
  if (val.length > 0) {
    const modelValue = listaFluxos.value[fIdx].etapas[eIdx].tarefas[tIdx][field] || []
    const parts = val.split(/[,;|]+/).map(v => v.trim()).filter(v => v.length > 0)
    
    parts.forEach(part => {
      if (!modelValue.includes(part)) {
        modelValue.push(part)
      }
    })
    done(null)
    garantirItensEmBranco()
  }
}

const matchBusca = (fluxo) => {
  if (!filtroBusca.value) return true
  const s = filtroBusca.value.toLowerCase()
  return JSON.stringify(fluxo).toLowerCase().includes(s)
}

const garantirItensEmBranco = () => {
  if (isReadOnly.value) return
  const ultimoF = listaFluxos.value[listaFluxos.value.length - 1]
  if (ultimoF && ultimoF.identificacao.trim() !== '') {
    listaFluxos.value.push(factoryFluxo())
  }
  listaFluxos.value.forEach(f => {
    const ultimaE = f.etapas[f.etapas.length - 1]
    if (ultimaE && ultimaE.nome_etapa.trim() !== '') f.etapas.push(factoryEtapa())
    f.etapas.forEach(e => {
      const ultimaT = e.tarefas[e.tarefas.length - 1]
      if (ultimaT && ultimaT.nome.trim() !== '') e.tarefas.push(factoryTarefa())
    })
  })
}

const duplicarFluxo = (i) => {
  const clone = JSON.parse(JSON.stringify(listaFluxos.value[i]))
  clone.id = generateId()
  listaFluxos.value.splice(i + 1, 0, clone)
}

const removerEtapa = (fi, ei) => {
  listaFluxos.value[fi].etapas.splice(ei, 1)
  if (!listaFluxos.value[fi].etapas.length) listaFluxos.value[fi].etapas.push(factoryEtapa())
  garantirItensEmBranco()
}

const removerTarefa = (fi, ei, ti) => {
  listaFluxos.value[fi].etapas[ei].tarefas.splice(ti, 1)
  if (!listaFluxos.value[fi].etapas[ei].tarefas.length) listaFluxos.value[fi].etapas[ei].tarefas.push(factoryTarefa())
  garantirItensEmBranco()
}

const exportarTudo = () => {
  const clean = JSON.parse(JSON.stringify(listaFluxos.value))
    .filter(f => f.identificacao.trim() !== '')
    .map(f => ({
      ...f, etapas: f.etapas.filter(e => e.nome_etapa.trim() !== '').map(e => ({
        ...e, tarefas: e.tarefas.filter(t => t.nome.trim() !== '')
      }))
    }))
  exportFile('mapeamento_ifg.json', JSON.stringify(clean, null, 2), 'application/json')
}

onMounted(() => {
  const saved = localStorage.getItem('maper_v9_setores')
  if (saved) { listaFluxos.value = JSON.parse(saved); nextTick(() => garantirItensEmBranco()) }
})
watch(listaFluxos, (v) => localStorage.setItem('maper_v9_setores', JSON.stringify(v)), { deep: true })
</script>

<style scoped>
.border-etapa { border-left: 5px solid #1976D2; }
.border-top-dashed { border-top: 1px dashed #ccc; }
.ghost { opacity: 0.3; background: #c8e6c9; }
.cursor-pointer { cursor: grab; }
</style>
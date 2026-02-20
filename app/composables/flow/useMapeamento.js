import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

export function useMapeamento() {
  const $q = useQuasar();
  const listaFluxos = ref([]);
  const estaSalvando = ref(false);
  const estaCarregando = ref(false);

  /*
    Centralizamos aqui os nomes de campos e as estruturas padrão.
    Se no futuro a estrutura mudar, atualize apenas esses defaults / mappers.
  */
  const DEFAULTS = {
    tarefa: {
      title: '',
      description: '',
      setores: [],
      sistemas: [],
      expand: false,
      _minimized: false,
      deadline_minutes: 0,
      insumos: '',
      riscos: '',
      solucoes: '',
    },
    etapa: {
      nome_etapa: '',
      isExpanded: true,
      tarefas: null, // será inicializado pela factory
    },
    fluxo: {
      identificacao: '',
      department_id: null,
      descricao: '',
      objetivos: '',
      documentos: '',
      etapas: null, // será inicializado pela factory
      isExpanded: true,
    },
  };

  // Gera IDs únicos mais robustos; usa crypto.randomUUID quando disponível
  const generateId = (prefix = '') => {
    const base = (typeof globalThis !== 'undefined' && globalThis.crypto && crypto.randomUUID)
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    return prefix ? `${prefix}_${base}` : base;
  };

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  // Factories usam DEFAULTS para facilitar alteração futura
  const factory = (type) => {
    const id = generateId(type);
    if (type === 'tarefa')
      return {
        id,
        ...deepClone(DEFAULTS.tarefa),
      };
    if (type === 'etapa')
      return {
        id,
        ...deepClone(DEFAULTS.etapa),
        tarefas: [factory('tarefa')],
      };
    // fluxo
    return {
      id,
      ...deepClone(DEFAULTS.fluxo),
      etapas: [factory('etapa')],
    };
  };

  // Garantir que todos os itens tenham um id único — util quando componentes criam objetos sem id
  const ensureIds = (fluxosList) => {
    if (!fluxosList || !Array.isArray(fluxosList)) return;
    fluxosList.forEach((f) => {
      if (!f.id) f.id = generateId('fluxo');
      if (!f.etapas || !Array.isArray(f.etapas) || f.etapas.length === 0) f.etapas = [factory('etapa')];
      f.etapas.forEach((e) => {
        if (!e.id) e.id = generateId('etapa');
        if (!e.tarefas || !Array.isArray(e.tarefas) || e.tarefas.length === 0) e.tarefas = [factory('tarefa')];
        e.tarefas.forEach((t) => {
          if (!t.id) t.id = generateId('tarefa');
        });
      });
    });
  };

  // Normalizadores e mapeadores entre backend e UI
  const normalizeBackendWorkflow = (w) => {
    // Mantemos backward-compatibility: aceita tanto 'title' como 'identificacao'
    const title = w.title ?? w.identificacao ?? '';
    const department_id = w.department_id ?? w.UORG ?? null;

    // Se a estrutura já existe use-a, senão crie uma estrutura padrão
    const etapas = (w.structure && Array.isArray(w.structure.etapas))
      ? w.structure.etapas.map((e) => ({
          id: e.id ?? generateId('etapa'),
          nome_etapa: e.nome_etapa ?? e.name ?? '',
          isExpanded: e.isExpanded ?? true,
          tarefas: (Array.isArray(e.tarefas) && e.tarefas.length > 0)
            ? e.tarefas.map((t) => ({
                id: t.id ?? generateId('tarefa'),
                title: t.title ?? t.nome ?? '',
                description: t.description ?? t.instructions ?? '',
                setores: t.setores ?? [],
                sistemas: t.sistemas ?? [],
                expand: t.expand ?? false,
                _minimized: t._minimized ?? false,
                deadline_minutes: t.deadline_minutes ?? 0,
                insumos: t.insumos ?? '',
                riscos: t.riscos ?? '',
                solucoes: t.solucoes ?? '',
              }))
            : [factory('tarefa')],
        }))
      : [factory('etapa')];

    return {
      id: w.id ?? generateId('fluxo'),
      identificacao: title,
      department_id,
      descricao: w.descricao ?? w.description ?? '',
      objetivos: w.objetivos ?? w.objectives ?? '',
      documentos: w.documentos ?? w.documents ?? '',
      etapas,
      isExpanded: w.isExpanded ?? true,
      // mantém referência ao backend raw caso necessário
      _raw: w,
    };
  };

  const mapUiToBackend = (fluxos) => {
    // Converte a estrutura UI para o formato esperado pelo backend
    return fluxos
      .filter((f) => f.identificacao && f.department_id)
      .map((f) => {
        const etapasArr = (f.etapas || []).map((e) => ({
          id: e.id,
          nome_etapa: e.nome_etapa ?? '',
          isExpanded: e.isExpanded ?? true,
          tarefas: (e.tarefas || []).map((t) => ({
            id: t.id,
            title: t.title ?? '',
            description: t.description ?? '',
            setores: t.setores ?? [],
            sistemas: t.sistemas ?? [],
            expand: t.expand ?? false,
            _minimized: t._minimized ?? false,
            deadline_minutes: t.deadline_minutes ?? 0,
            insumos: t.insumos ?? '',
            riscos: t.riscos ?? '',
            solucoes: t.solucoes ?? '',
          })),
        }));

        return {
          id: f.id,
          identificacao: f.identificacao,
          title: f.identificacao,
          department_id: f.department_id,
          descricao: f.descricao ?? '',
          objetivos: f.objetivos ?? '',
          documentos: f.documentos ?? '',
          // enviar também no nível superior porque o endpoint atual usa fluxo.etapas
          etapas: etapasArr,
          structure: {
            etapas: etapasArr,
            isExpanded: f.isExpanded ?? true,
          },
        };
      });
  };

  /* Helpers para manipular elementos sem expor detalhes de implementação
     Estes helpers facilitam alteração da forma como itens são armazenados
     sem precisar modificar os componentes que consomem a lista. */
  const findFluxoIndex = (fluxoId) => listaFluxos.value.findIndex((f) => f.id === fluxoId);
  const findEtapaIndex = (fluxo, etapaId) => fluxo.etapas.findIndex((e) => e.id === etapaId);
  const findTarefaIndex = (etapa, tarefaId) => etapa.tarefas.findIndex((t) => t.id === tarefaId);

  const addFluxo = (afterIndex = null) => {
    const novo = factory('fluxo');
    if (afterIndex === null || afterIndex >= listaFluxos.value.length) listaFluxos.value.push(novo);
    else listaFluxos.value.splice(afterIndex + 1, 0, novo);
    return novo;
  };

  const removeFluxo = async (id, index = null) => {
    // Se index não informado tenta encontrar
    const idx = index ?? findFluxoIndex(id);
    if (idx === -1) return;

    try {
      // Tenta remover no backend, mas remove localmente mesmo se falhar (UX amigável)
      await $fetch(`/api/workflows/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Erro ao remover no backend:', err);
    }

    listaFluxos.value.splice(idx, 1);
    if (listaFluxos.value.length === 0) listaFluxos.value.push(factory('fluxo'));
  };

  const addEtapa = (fluxoId, afterIndex = null) => {
    const fIdx = findFluxoIndex(fluxoId);
    if (fIdx === -1) return null;
    const novo = factory('etapa');
    const etapas = listaFluxos.value[fIdx].etapas;
    if (afterIndex === null || afterIndex >= etapas.length) etapas.push(novo);
    else etapas.splice(afterIndex + 1, 0, novo);
    return novo;
  };

  const removeEtapa = (fluxoId, etapaId) => {
    const fIdx = findFluxoIndex(fluxoId);
    if (fIdx === -1) return;
    const fluxo = listaFluxos.value[fIdx];
    const eIdx = findEtapaIndex(fluxo, etapaId);
    if (eIdx === -1) return;
    fluxo.etapas.splice(eIdx, 1);
    if (fluxo.etapas.length === 0) fluxo.etapas.push(factory('etapa'));
  };

  const addTarefa = (fluxoId, etapaId, afterIndex = null) => {
    const fIdx = findFluxoIndex(fluxoId);
    if (fIdx === -1) return null;
    const fluxo = listaFluxos.value[fIdx];
    const eIdx = findEtapaIndex(fluxo, etapaId);
    if (eIdx === -1) return null;
    const tarefas = fluxo.etapas[eIdx].tarefas;
    const novo = factory('tarefa');
    if (afterIndex === null || afterIndex >= tarefas.length) tarefas.push(novo);
    else tarefas.splice(afterIndex + 1, 0, novo);
    return novo;
  };

  const removeTarefa = (fluxoId, etapaId, tarefaId) => {
    const fIdx = findFluxoIndex(fluxoId);
    if (fIdx === -1) return;
    const fluxo = listaFluxos.value[fIdx];
    const eIdx = findEtapaIndex(fluxo, etapaId);
    if (eIdx === -1) return;
    const tarefas = fluxo.etapas[eIdx].tarefas;
    const tIdx = findTarefaIndex(fluxo.etapas[eIdx], tarefaId);
    if (tIdx === -1) return;
    tarefas.splice(tIdx, 1);
    if (tarefas.length === 0) fluxo.etapas[eIdx].tarefas.push(factory('tarefa'));
  };

  // Atualiza um campo qualquer buscando por ids. Útil para centralizar lógica de patches.
  const updateField = ({ fluxoId, etapaId = null, tarefaId = null, field, value }) => {
    const fIdx = findFluxoIndex(fluxoId);
    if (fIdx === -1) return false;
    const fluxo = listaFluxos.value[fIdx];
    if (!etapaId) {
      fluxo[field] = value;
      return true;
    }
    const eIdx = findEtapaIndex(fluxo, etapaId);
    if (eIdx === -1) return false;
    const etapa = fluxo.etapas[eIdx];
    if (!tarefaId) {
      etapa[field] = value;
      return true;
    }
    const tIdx = findTarefaIndex(etapa, tarefaId);
    if (tIdx === -1) return false;
    etapa.tarefas[tIdx][field] = value;
    return true;
  };

  // Verificações automáticas para manter sempre um item 'em branco' ao final
  const autoCheck = () => {
    // 1. Verificar Fluxos: se último fluxo tiver identificacao + department_id adicione outro
    const lastF = listaFluxos.value[listaFluxos.value.length - 1];
    if (lastF && lastF.identificacao?.trim() && lastF.department_id) {
      listaFluxos.value.push(factory('fluxo'));
    }

    listaFluxos.value.forEach((f) => {
      // 2. Verificar Etapas
      const lastE = f.etapas[f.etapas.length - 1];
      if (lastE?.nome_etapa?.trim()) {
        f.etapas.push(factory('etapa'));
      }

      f.etapas.forEach((e) => {
        // 3. Verificar Tarefas
        const lastT = e.tarefas[e.tarefas.length - 1];
        if (lastT?.title?.trim()) {
          e.tarefas.push(factory('tarefa'));
        }
      });
    });
  };

  const carregarDados = async () => {
    estaCarregando.value = true;
    try {
      const data = await $fetch('/api/workflows', { method: 'GET' });
      console.log("Workflows carregados:", data);
      if (data && Array.isArray(data) && data.length > 0) {
        listaFluxos.value = data.map((w) => normalizeBackendWorkflow(w));
        // garante ids únicos para itens que venham sem id
        ensureIds(listaFluxos.value);
      } else {
        listaFluxos.value = [factory('fluxo')];
      }
    } catch (e) {
      console.error('Erro ao carregar workflows:', e);
      listaFluxos.value = [factory('fluxo')];
    } finally {
      estaCarregando.value = false;
    }
  };

  const persistirNoBanco = async (fluxos) => {
    // garante ids antes de persistir
    ensureIds(fluxos);
    const validos = mapUiToBackend(fluxos);
    if (!validos || validos.length === 0) return;
    estaSalvando.value = true;
    try {
      await $fetch('/api/workflows', {
        method: 'POST',
        body: { workflows: validos },
      });
    } catch (err) {
      // Log mais detalhado para depuração: payload e erro
      try {
        console.error('Erro ao persistir workflows:', err, '\nPayload:', JSON.stringify(validos));
      } catch (e) {
        console.error('Erro ao persistir workflows (sem payload):', err);
      }
      throw err; // rethrow para permitir tratamento externo se necessário
    } finally {
      estaSalvando.value = false;
    }
  };

  let timer = null;
  watch(
    listaFluxos,
    (val) => {
      autoCheck();
      // assegura ids caso alguma mutação direta tenha criado objetos sem id
      ensureIds(val);
      clearTimeout(timer);
      timer = setTimeout(() => persistirNoBanco(val), 2000);
    },
    { deep: true }
  );

  return {
    listaFluxos,
    estaCarregando,
    estaSalvando,
    carregarDados,
    persistirNoBanco,
    // helpers explícitos exportados para uso em componentes
    factory,
    addFluxo,
    removeFluxo,
    removerFluxo: removeFluxo, // alias compat (API antiga em PT-BR)
    addEtapa,
    removeEtapa,
    addTarefa,
    removeTarefa,
    updateField,
    // mappers (úteis para testes ou integrações externas)
    normalizeBackendWorkflow,
    mapUiToBackend,
  };
}
<template>
  <div>
    <b class="text-h6">Lista de Servidores</b>
    
    <div v-if="pending">Carregando...</div>
    
    <ul v-else>
      <li v-for="s in listaServidores" :key="s.id">
        {{ s.full_name }} - {{ s.position?.name || 'Cargo não definido' }}
      </li>
    </ul>
    
    <div v-if="error" class="text-red">
      Erro ao carregar dados: {{ error.message }}
    </div>
  </div>
</template>

<script setup>
// useFetch já retorna refs reativos e lida com SSR automaticamente.
// Não usamos await aqui para evitar problemas de inicialização durante o build/dev.
const { data: listaServidores, pending, error } = useFetch("/api/users");
</script>
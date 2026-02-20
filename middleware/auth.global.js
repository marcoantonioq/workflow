export default defineNuxtRouteMiddleware((to) => {
  const userId = useCookie('user_id')

  // Se não houver cookie e não estiver na página de login, redireciona
  if (!userId.value && to.path !== '/login') {
    return navigateTo('/login')
  }

  // Se já estiver logado e tentar ir para o login, manda para a home
  if (userId.value && to.path === '/login') {
    return navigateTo('/')
  }
})
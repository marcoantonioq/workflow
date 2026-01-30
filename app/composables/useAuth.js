export const useAuth = () => {
  // O cookie "user_id" será acessível tanto no cliente quanto no servidor
  const userId = useCookie('user_id', { maxAge: 60 * 60 * 24 * 7 }) // 7 dias
  const userDetails = useState('user_details', () => null)

  const login = async (idDaMatricula) => {
    // Salvamos apenas o ID no cookie
    userId.value = idDaMatricula
    // Buscamos os dados completos do Prisma imediatamente
    await fetchUserDetails()
    return navigateTo('/')
  }

  const fetchUserDetails = async () => {
    if (userId.value) {
      try {
        const data = await $fetch(`/api/user/${userId.value}`)
        userDetails.value = data
      } catch (e) {
        logout()
      }
    }
  }

  const logout = () => {
    userId.value = null
    userDetails.value = null
    return navigateTo('/login')
  }

  return {
    userId,
    userDetails,
    login,
    logout,
    isAuthenticated: computed(() => !!userId.value)
  }
}
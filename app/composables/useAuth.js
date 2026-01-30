export const useAuth = () => {
  const userId = useCookie('user_id')
  const userDetails = useState('user_details', () => null)

  const fetchUserDetails = async () => {
    if (!userId.value) return
    try {
      const data = await $fetch(`/api/user/${userId.value}`)
      userDetails.value = data
    } catch (e) {
      console.error("Erro ao buscar usuário:", e)
      logout() 
    }
  }

  const login = async (id) => {
    userId.value = id
    await fetchUserDetails()
    return navigateTo('/')
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
    fetchUserDetails, 
    isAuthenticated: computed(() => !!userId.value)
  }
}
import { execSync } from 'child_process'

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST')

  try {
    console.log('--- Iniciando Setup do Sistema ---')

    // 1. Prisma DB Push
    execSync('npx prisma db push', { 
      stdio: 'pipe', 
      encoding: 'utf-8' 
    })
    console.log('✅ Tabelas sincronizadas.')

    // 2. Prisma Generate
    execSync('npx prisma generate', { 
      stdio: 'pipe',
      encoding: 'utf-8'
    })
    console.log('✅ Cliente Prisma atualizado.')

    // 3. Prisma Seed (Novo!)
    const result = execSync('npm run db:seed', { 
      stdio: 'pipe',
      encoding: 'utf-8'
    })
    console.log('✅ Seeds carregadas com sucesso: ', result)

    return { 
      success: true, 
      message: 'Configuração completa: Banco sincronizado, Client gerado e Seeds aplicadas!' 
    }

  } catch (error) {
    // Captura logs detalhados do erro que ocorreu dentro do container
    const errorMessage = error.stderr || error.stdout || error.message
    console.error('❌ Falha na configuração:', errorMessage)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro durante o processo de configuração inicial',
      data: errorMessage
    })
  }
})
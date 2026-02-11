import { runImport } from '../../utils/csv-importer';

export default defineEventHandler(async (event) => {
  try {
    const results = await runImport();
    return { success: true, results };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});

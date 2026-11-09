export const createViewingController = (service) => ({
  list: async (_request, response, next) => { try { response.json({ items: await service.listViewingPreviews() }); } catch (error) { next(error); } },
});

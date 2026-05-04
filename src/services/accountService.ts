export const accountService = {
  getAll: () => fetch('/api/accounts').then(r => r.json()),
  getById: (id: string) => fetch(`/api/accounts/${id}`).then(r => r.json()),
  getMovements: (accountId: string) => 
    fetch(`/api/movements?accountId=${accountId}`).then(r => r.json()),
};
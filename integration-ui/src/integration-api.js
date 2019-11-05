const workerUrl = '/api/worker';
const serverUrl = '/api/server';

const api = {
  command: async ({ from, to, plugin }) => {
    const response = await fetch(`${workerUrl}/command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({
        data: {
          from,
          to,
        },
        plugin,
      }),
    });
    if (!response.ok) {
      throw Error(`${response.status}: ${response.text()}`);
    }
    return response.json();
  },
  listPlugins: async () => {
    const response = await fetch(`${serverUrl}/plugins`);
    if (!response.ok) {
      throw Error(`${response.status}: ${response.text()}`);
    }
    return response.json();
  },
  uploadPlugin: async (name, file) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('plugin', file);

    const response = await fetch(`${serverUrl}/plugins`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      throw Error(`${response.status}: ${response.text()}`);
    }
    return response.text();
  },
};

export default api;

require('ts-node').register({ transpileOnly: true });
const handler = require('./api/index.ts').default;

const req = { method: 'GET', url: '/api/subjects?t=123', query: {} };
const res = {
  status: (code) => ({
    json: (data) => {
      console.log('Status:', code);
      console.log('Data:', data);
    }
  }),
  setHeader: () => {}
};

handler(req, res).catch(err => console.error("Unhandled:", err));

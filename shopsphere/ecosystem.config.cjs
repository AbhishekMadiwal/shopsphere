module.exports = {
  apps: [
    {
      name: 'shopsphere-api',
      script: 'server.js',
      cwd: '/home/user/shopsphere/server',
      env: { NODE_ENV: 'development', PORT: 5000 },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    },
    {
      name: 'shopsphere-client',
      script: 'npx',
      args: 'vite preview --port 5173 --host 0.0.0.0',
      cwd: '/home/user/shopsphere/client',
      watch: false,
      instances: 1,
      exec_mode: 'fork',
    },
  ],
}

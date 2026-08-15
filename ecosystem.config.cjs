module.exports = {
  apps: [
    {
      name: 'fun-with-learn',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      time: true,
    },
  ],
};

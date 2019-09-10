module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "./frontend",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "development",
      }
    },
    {
      name: "backend",
      script: "./backend/index.js",
      env: {
        NODE_ENV: "development",
      },
      watch: true
    }
  ]
}
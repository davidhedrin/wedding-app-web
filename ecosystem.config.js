module.exports = {
  apps: [
    {
      name: "build-next",
      script: "npm",
      args: "run build",
      interpreter: "none",

      env: {
        NODE_OPTIONS: "--max-old-space-size=768"
      },

      autorestart: false,
      watch: false
    }
  ]
}
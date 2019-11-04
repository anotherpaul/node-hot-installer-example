const instanceCount = parseInt(process.env.SERVER_INSTANCE_COUNT, 10) || 2;

module.exports = {
  apps: [
    {
      name: "package-loader",
      script: "/package-loader/src/index.js",
      exec_mode: "fork"
    },
    {
      name: "worker",
      script: "/worker/src/index.js",
      instances: instanceCount,
      exec_mode: "cluster"
    }
  ]
};

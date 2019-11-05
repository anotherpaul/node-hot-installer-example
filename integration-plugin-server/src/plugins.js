function createPluginsStorage({ mongoose }) {
  const schema = new mongoose.Schema(
    {
      packageUrl: { type: String, required: true },
      name: { type: String, required: true, unique: true },
    },
    { timestamps: true },
  );
  const Plugin = mongoose.model('plugins', schema);

  async function create(payload) {
    const existingPlugin = await Plugin.findOne({ name: payload.name }).exec();
    if (!existingPlugin) {
      const plugin = new Plugin(payload);
      return plugin.save();
    }
    existingPlugin.packageUrl = payload.packageUrl;
    return existingPlugin.save();    
  }

  function getByName(name) {
    return Plugin.findOne({ name })
      .lean()
      .exec();
  }

  function getAll() {
    return Plugin.find()
      .lean()
      .exec();
  }

  return {
    create,
    getByName,
    getAll,
  };
}

module.exports = createPluginsStorage;

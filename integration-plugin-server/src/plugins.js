function createPluginsStorage({ mongoose }) {
  const schema = new mongoose.Schema(
    {
      packageUrl: { type: String, required: true },
      name: { type: String, required: true, unique: true },
    },
    { timestamps: true },
  );
  const Plugin = mongoose.model('plugins', schema);

  function create(payload) {
    const plugin = new Plugin(payload);
    return plugin.save();
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

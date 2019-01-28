const chance = new require('chance')();

const specialRandomDocument = (fieldName, schema) => {
  if (schema._exists && !chance.bool({ likelihood: schema._exists }) ) {
    return {};
  }
  if (schema._type === 'enum') {
    return { [fieldName]: chance.pickone(schema.options) };
  }
  if (chance[schema._type] && schema.args) {
    return { [fieldName]: chance[schema._type](schema.args) };
  }
  throw new Error(`Unsupported special type: ${schema._type}`);
};

const randomDocument = (fieldSchema) => Object.entries(fieldSchema).reduce((record, [fieldName, type]) => {
  if (Array.isArray(type)) {
    return Object.assign({}, record, { [fieldName]: [].concat(type.map(randomDocument)) });
  }
  if (typeof type === 'object' && type !== null) {
    return (type._type)
      ? Object.assign({}, record, specialRandomDocument(fieldName, type))
      : Object.assign({}, record, { [fieldName]: randomDocument(type) });
  }
  if (chance[type]) {
    return Object.assign({}, record, { [fieldName]: chance[type]() });
  }
  console.log(`No Chance.js generator found for field ${fieldName} of type ${type}. Using string instead`);
  return Object.assign({}, record, { [fieldName]: chance.string() });
}, {});

const randomDocuments = (schema, n) => [...Array(n)].map(() => randomDocument(schema));

module.exports = {
  randomDocument,
  randomDocuments,
};

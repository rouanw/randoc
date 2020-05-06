const chance = new require('chance')();

const getChance = ({ fieldName, type, args, array }) => {
  if (!chance[type]) {
    console.log(`No Chance.js generator found for field ${fieldName} of type ${type}. Using string instead`);
    return array ? chance.string() : { [fieldName]: chance.string() };
  }
  return array ? chance[type](args) : { [fieldName]: chance[type](args) };
}

const arrayField = ({ _type, _array, args }, fieldName) => {
  if (_array.empty && chance.bool({ likelihood: _array.empty }) ) {
    return { [fieldName]: [] }
  }
  return { [fieldName]: [...new Array(_array.length || 1)].map(_ => getChance({ fieldName, type: _type, args, array: true })) };
}

const specialRandomDocument = (fieldName, schema) => {
  if (schema._exists && !chance.bool({ likelihood: schema._exists }) ) {
    return {};
  }
  if (schema._array) {
    return arrayField(schema, fieldName);
  }
  if (schema._type === 'enum') {
    return { [fieldName]: chance.pickone(schema.options) };
  }
  return getChance({ fieldName, type: schema._type, args: schema.args });
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
  return Object.assign({}, record, getChance({ fieldName, type }));
}, {});

const randomDocuments = (schema, n) => [...Array(n)].map(() => randomDocument(schema));

module.exports = {
  randomDocument,
  randomDocuments,
};

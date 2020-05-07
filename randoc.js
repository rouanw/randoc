const chance = new require('chance')();

const getChance = ({ type, args }) => chance[type] ? chance[type](args) : chance.string();

const arrayField = ({ _type, _array, args }, fieldName) => {
  if (_array.empty && chance.bool({ likelihood: _array.empty }) ) {
    return { [fieldName]: [] }
  }
  return { [fieldName]: [...new Array(_array.length || 1)].map(_ => getChance({ type: _type, args })) };
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
  return { [fieldName]: getChance({ type: schema._type, args: schema.args }) };
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
  return Object.assign({}, record, { [fieldName]: getChance({ fieldName, type }) });
}, {});

const randomDocuments = (schema, n) => [...Array(n)].map(() => randomDocument(schema));

module.exports = {
  randomDocument,
  randomDocuments,
};

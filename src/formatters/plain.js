import _ from 'lodash';

const stringify = (value) => {
  if (_.isObject(value)) {
    return '[complex value]';
  }
  if (typeof value === 'string') {
    return `'${value}'`;
  }

  return value;
};

const plain = (diff, path = []) => {
  const filteredDiff = diff.filter((item) => item.type !== 'unchanged');
  const result = filteredDiff.map((item) => {
    const newPath = path.concat(item.key);
    const node = newPath.join('.');

    if (item.type === 'added') {
      const value = stringify(item.value);
      return `Property '${node}' was added with value: ${value}`;
    }
    if (item.type === 'deleted') {
      return `Property '${node}' was removed`;
    }
    if (item.type === 'changed') {
      const firstValue = stringify(item.value.firstValue);
      const secondValue = stringify(item.value.secondValue);
      return `Property '${node}' was updated. From ${firstValue} to ${secondValue}`;
    }

    return plain(item.children, newPath);
  }).join('\n');

  return result;
};

export default plain;

import { forEach, isArray, isObject } from "lodash";
export function findAll(data, searchKey) {
    let result = [];

    const search = (obj, path = "") => {
        if (isArray(obj) || isObject(obj)) {
            forEach(obj, (value, key) => {
                const newPath = isArray(obj) ? `${path}[${key}]` : `${path}.${key}`.replace(/^\./, "");
                if (key === searchKey) result.push({ path: newPath, value });
                search(value, newPath);
            });
        }
    };

    search(data);
    return result.length ? result : null;
};

export function findOne(data, searchKey) {
    let result = null;

    const search = (obj, path = "") => {
        if (isArray(obj) || isObject(obj)) {
            forEach(obj, (value, key) => {
                const newPath = isArray(obj) ? `${path}[${key}]` : `${path}.${key}`.replace(/^\./, "");
                if (key === searchKey) result = { path: newPath, value };
                search(value, newPath);
            });
        }
    };

    search(data)
    if (result) return result.value;
    return null;
};

export function setState(state, action) {
    // console.log("setter function",state, action.payload);
    const { keys, value, only } = action.payload;
    if (!keys) return state;
    const recursiveUpdate = (obj, path, newValue, onlyFlag) => {
        const [currentKey, ...remainingPath] = path.split('.');

        if (!remainingPath.length) {
            return { ...obj, [currentKey]: newValue };
        }

        const currentValue = obj[currentKey];

        if (Array.isArray(currentValue)) {
            const itemId = remainingPath[0];
            const itemIndex = currentValue.findIndex(item => item.id === itemId);
            if (itemIndex === -1) return obj;

            const updatedItem = remainingPath.length === 1
                ? onlyFlag
                    ? { ...currentValue[itemIndex], [Object.keys(newValue)[0]]: Object.values(newValue)[0] }
                    : { ...currentValue[itemIndex], ...newValue }
                : recursiveUpdate(currentValue[itemIndex], remainingPath.slice(1).join('.'), newValue, onlyFlag);

            return {
                ...obj,
                [currentKey]: [
                    ...currentValue.slice(0, itemIndex),
                    updatedItem,
                    ...currentValue.slice(itemIndex + 1)
                ]
            };
        }

        if (currentValue && typeof currentValue === 'object') {
            return {
                ...obj,
                [currentKey]: recursiveUpdate(currentValue, remainingPath.join('.'), newValue, onlyFlag)
            };
        }

        return obj;
    };

    const updatedState = keys.includes('.')
        ? recursiveUpdate({ ...state }, keys, value, only)
        : { ...state, [keys]: value };

    return {
        ...state,
        ...updatedState,
        refresh: performance.now() // Integración de performance.now()
    };
}


class Cache {
  constructor() {
    this.cache = {};
  }

  /**
   * Guarda o actualiza un dato en la caché.
   * @param {Object} options - Objeto de opciones.
   * @param {string} options.key - Clave identificadora del dato.
   * @param {*} options.value - Valor a almacenar.
   * @param {number} [options.expiration] - Tiempo de expiración en milisegundos (opcional).
   */
  set({ key, value, expiration }) {
    const item = {
      value,
      timestamp: Date.now(),
      expiration: expiration || null
    };
    this.cache[key] = item;
  }

  /**
   * Obtiene el dato almacenado asociado a la clave, comprobando si ha expirado.
   * @param {Object} options - Objeto de opciones.
   * @param {string} options.key - Clave del dato a obtener.
   * @returns {*} El dato almacenado o null si no existe o ha expirado.
   */
  get({ key }) {
    const item = this.cache[key];
    if (!item) return null;

    if (item.expiration && (Date.now() - item.timestamp > item.expiration)) {
      this.remove({ key });
      return null;
    }
    return item.value;
  }

  /**
   * Elimina un dato del caché.
   * @param {Object} options - Objeto de opciones.
   * @param {string} options.key - Clave del dato a eliminar.
   */
  remove({ key }) {
    delete this.cache[key];
  }

  /**
   * Limpia todo el caché.
   */
  clear() {
    this.cache = {};
  }
}

// Creamos una instancia única para usar en toda la aplicación.
const cache = new Cache();
export default cache;

/**
 * Toggles an item in an array (adds if not present, removes if present)
 * Used by: post form skill/role tag toggles, skill selector
 * @param {Array} arr - The array to toggle in
 * @param {*} item - The item to toggle
 * @returns {Array} - New array with item toggled
 */
export function toggleArr(arr, item) {
  if (arr.includes(item)) {
    return arr.filter(x => x !== item);
  } else {
    return [...arr, item];
  }
}

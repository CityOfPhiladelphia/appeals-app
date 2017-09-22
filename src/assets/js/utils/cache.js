export const data = {};

function slugify(text) {
  const a = 'àáäâèéëêìíïîòóöôùúüûñçßÿœæŕśńṕẃǵǹḿǘẍźḧ·/_,:;';
  const b = 'aaaaeeeeiiiioooouuuuncsyoarsnpwgnmuxzh------';
  const p = new RegExp(a.split('').join('|'), 'g');

  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(p, c =>
        b.charAt(a.indexOf(c)))     // Replace special chars
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');             // Trim - from end of text
}

export function get(el, page, pageSize) {
  const element = slugify(el);
  if (typeof data[element] !== 'undefined') {
    if (typeof page === 'number' && typeof pageSize === 'number') {
      return Array.from(data[element].slice((page * pageSize), ((page + 1) * pageSize)));
    }
    if (data[element].length >= 0) {
      return data[element].slice(0, data[element].length);
    }
    return data[element];
  }
  return null;
}
export function set(el, val) {
  const element = slugify(el);
  data[element] = val;
}

export var data = {};

function slugify(el) {
	return el.toString().toLowerCase()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w\-]+/g, '') // Remove all non-word chars
		.replace(/\-\-+/g, '-') // Replace multiple - with single -
		.replace(/^-+/, '') // Trim - from start of text
		.replace(/-+$/, ''); // Trim - from end of text
}
export function get(el, page, page_size) {
	el = slugify(el);
	if (typeof data[el] != 'undefined') {
		if( typeof page == 'number' && typeof page_size == 'number') {
			return Array.from(data[el].slice( (page*page_size), ((page+1)*page_size) ));
		} else {
			if( data[el].length >= 0 ) {
				return data[el].slice(0, data[el].length);
			}
			return data[el];
		}
	}
	return null;
}
export function set(el, val) {
	el = slugify(el);
	data[el] = val;
}
export function clean() {
	data = new Object();
}
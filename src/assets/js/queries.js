import axios from 'axios';
var vsprintf = require('sprintf-js').vsprintf;

export const CARTO_URL = 'https://data.phila.gov/carto/api/v2/sql?q=';
export const strings = {
	rco: 'http://gis.phila.gov/arcgis/rest/services/PhilaGov/RCO/MapServer/0/query?where=1%3D1&outFields=ORGANIZATION_NAME&returnGeometry=false&returnIdsOnly=false&returnCountOnly=false&orderByFields=ORGANIZATION_NAME&returnZ=false&returnM=false&returnDistinctValues=false&f=pjson',
	appealsByDate: 'SELECT date_scheduled, address, appealno, applictype FROM LI_APPEALS WHERE applictype = \'RB_ZBA\' AND DATE(date_scheduled) >= \'%s\' AND DATE(date_scheduled) < \'%s\' ORDER BY date_scheduled ASC',
	appealById: 'SELECT * FROM LI_APPEALS WHERE appealno = \'%s\'',
	courtHistory: 'SELECT * FROM LI_COURT_APPEALS WHERE appealnumber = \'%s\' ORDER BY courtactiondate DESC',
	deicisionHistory: 'SELECT * FROM LI_BOARD_DECISIONS WHERE appealnumber = \'%s\' ORDER BY decisiondate DESC'
};

export function prepare() {
	if (!arguments || arguments.length == 0) {
		return '';
	}
	var a = Array.from(arguments);
	var q = a.shift();
	return encodeURIComponent(vsprintf(q, a));
}

export function query(query, data) {
	return axios.get(query, data);
}
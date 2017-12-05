import axios from 'axios';

const qs = require('qs');

const vsprintf = require('sprintf-js').vsprintf;

const gisCommonData = {
  where: null,
  text: null,
  objectIds: null,
  time: null,
  geometry: null,
  geometryType: 'esriGeometryPolygon',
  inSR: null,
  spatialRel: 'esriSpatialRelIntersects',
  relationParam: null,
  outFields: null,
  returnGeometry: true,
  returnTrueCurves: false,
  maxAllowableOffset: null,
  geometryPrecision: null,
  outSR: null,
  returnIdsOnly: false,
  returnCountOnly: false,
  orderByFields: null,
  groupByFieldsForStatistics: null,
  outStatistics: null,
  returnZ: false,
  returnM: false,
  gdbVersion: null,
  returnDistinctValues: false,
  resultOffset: null,
  resultRecordCount: null,
  f: 'pjson',
};

export const CARTO_URL = '//phl.carto.com/api/v2/sql';
export const CD_URL = '//gis.phila.gov/arcgis/rest/services/PhilaGov/ServiceAreas/MapServer/2/query';
export const PD_URL = '//gis.phila.gov/arcgis/rest/services/PhilaGov/ServiceAreas/MapServer/20/query';
export const RCO_URL = '//gis.phila.gov/arcgis/rest/services/PhilaGov/RCO/MapServer/0/query';

const BASE_APPEALS_LIST = 'SELECT date_scheduled, address, appealno, applictype FROM LI_APPEALS WHERE applictype = \'RB_ZBA\' AND DATE(date_scheduled) >= \'%s\' AND DATE(date_scheduled) <= \'%s\'';
export const strings = {
  councilDistrictGeo: 'DISTRICT=\'%s\'',
  planinDistrictGeo: 'DIST_NAME=\'%s\'',
  rcoGeo: 'ORGANIZATION_NAME=\'%s\'',
  appealsByDate: `${BASE_APPEALS_LIST} ORDER BY date_scheduled ASC`,
  appealsByDateAndRegion: `${BASE_APPEALS_LIST} AND ST_intersects(st_transform(the_geom,2272),st_geomfromgeojson('{"type":"Polygon","coordinates":%s,"crs":{"type":"name","properties":{"name":"EPSG:2272"}}}')) ORDER BY date_scheduled ASC`,
  appealById: 'SELECT *, st_astext(the_geom) AS latlng FROM LI_APPEALS WHERE appealno = \'%s\'',
  courtHistory: 'SELECT * FROM LI_COURT_APPEALS WHERE appealnumber = \'%s\' ORDER BY courtactiondate DESC',
  deicisionHistory: 'SELECT * FROM LI_BOARD_DECISIONS WHERE appealnumber = \'%s\' ORDER BY decisiondate DESC',
};

export function replace(...args) {
  if (!args || args.length === 0) {
    return '';
  }
  const a = Array.from(args);
  const q = a.shift();
  return vsprintf(q, a);
}

export function prepare(...args) {
  if (!args || args.length === 0) {
    return '';
  }
  const a = Array.from(args);
  const q = a.shift();
  return encodeURIComponent(vsprintf(q, a));
}

export function post(q, data) {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  };
  return axios({
    method: 'post',
    url: q,
    headers,
    timeout: 10000,
    data: qs.stringify(data),
  });
}

export function get(q, data) {
  const instance = axios.create();
  const parameters = data;
  return instance.get(q, { params: parameters });
}

export function getRCOs() {
  const rcoParams = {
    where: '1=1',
    outFields: 'ORGANIZATION_NAME',
    returnGeometry: false,
    returnIdsOnly: false,
    returnCountOnly: false,
    orderByFields: 'ORGANIZATION_NAME',
    returnZ: false,
    returnM: false,
    returnDistinctValues: false,
    f: 'pjson',
  };

  return get(RCO_URL, rcoParams);
}

function getCouncilAppealsGeography(id) {
  gisCommonData.where = replace(strings.councilDistrictGeo, id);
  return get(CD_URL, gisCommonData);
}

function getPlanningDistrictGeography(id) {
  gisCommonData.where = replace(strings.planinDistrictGeo, id);
  return get(PD_URL, gisCommonData);
}

function getRCOGeography(id) {
  gisCommonData.where = replace(strings.rcoGeo, id);
  return get(RCO_URL, gisCommonData);
}

export function getGeographyData(region, id) {
  if (region === 'cd') {
    return getCouncilAppealsGeography(id);
  }

  if (region === 'planning') {
    return getPlanningDistrictGeography(id);
  }

  if (region === 'rco') {
    return getRCOGeography(id);
  }

  return null;
}

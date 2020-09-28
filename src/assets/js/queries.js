import axios from 'axios';

const qs = require('qs');

const vsprintf = require('sprintf-js').vsprintf;

const gisCommonData = {
  geometryType: 'esriGeometryPolygon',
  spatialRel: 'esriSpatialRelIntersects',
  returnGeometry: true,
  outSR: '2272',
  f: 'pjson',
};

export const CARTO_URL = '//phl.carto.com/api/v2/sql';
export const CD_URL = '//services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/Council_Districts_2016/FeatureServer/0/query';
export const PD_URL = '//services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/Planning_Districts/FeatureServer/0/query';
export const RCO_URL = '//services.arcgis.com/fLeGjb7u4uXqeF9q/ArcGIS/rest/services/Zoning_RCO/FeatureServer/0/query';


const applicationtypeFilters = Object.keys(window.appealsAppConfig.types).join("','");
const BASE_APPEALS_LIST = `SELECT scheduleddate,  address, meetingnumber, appealnumber, applicationtype, appealgrounds FROM appeals WHERE applicationtype IN ('${applicationtypeFilters}') AND DATE(scheduleddate) >= '%s' AND DATE(scheduleddate) < '%s'`;
const END_APPEALS_LIST = 'GROUP BY scheduleddate, address, appealnumber, applicationtype, appealgrounds, meetingnumber';

export const strings = {
  councilDistrictGeo: 'DISTRICT=\'%s\'',
  planinDistrictGeo: 'DIST_NAME=\'%s\'',
  rcoGeo: 'ORGANIZATION_NAME=\'%s\'',
  appealsByDate: `${BASE_APPEALS_LIST} ${END_APPEALS_LIST} ORDER BY scheduleddate ASC`,
  appealsByDateAndRegion: `${BASE_APPEALS_LIST} AND ST_intersects(st_transform(the_geom,2272),st_geomfromgeojson('{"type":"Polygon","coordinates":%s,"crs":{"type":"name","properties":{"name":"EPSG:2272"}}}')) ${END_APPEALS_LIST} ORDER BY scheduleddate ASC`,
  appealById: 'SELECT *, st_astext(the_geom) AS latlng FROM appeals WHERE appealnumber = \'%s\' ORDER BY scheduleddate DESC LIMIT 1 OFFSET 0',
  appealByIdDate: 'SELECT *, st_astext(the_geom) AS latlng FROM appeals WHERE appealnumber = \'%s\' AND scheduleddate = \'%s\'',
  appealTypes: 'SELECT appealtype FROM appeals WHERE appealnumber =  \'%s\'',
  courtHistory: 'SELECT * FROM court_appeals WHERE appealnumber = \'%s\' ORDER BY courtactiondate DESC',
  deicisionHistory: 'SELECT * FROM board_decisions WHERE appealnumber = \'%s\' ORDER BY decisiondate DESC',
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
  return instance.get(q, {
    params: parameters,
  });
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

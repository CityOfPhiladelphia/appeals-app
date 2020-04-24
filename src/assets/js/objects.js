import * as moment from 'moment';

export function getFilterResultsCollection(data) {
  const myData = data;
  if (typeof data === 'object' && data.length > 0) {
    for (let i = 0; i < data.length; i += 1) {
      const temp = moment(data[i].scheduleddate, moment.ISO_8601).utc();
      myData[i].date = temp.format('MM/DD/YYYY');
      if (temp.format('HH:mm:ss') === '00:00:00') {
        myData[i].time = '';
      } else {
        myData[i].time = temp.format('hh:mm A');
      }
    }

    return myData;
  }
  return [];
}

export function getAppealsDataObject(data) {
  if (typeof data === 'object') {
    const tempObj = {};

    tempObj.address = data.address;
    tempObj.type = data.applicationtype;
    tempObj.appealnumber = data.appealnumber;
    tempObj.permitNo = data.relatedpermit;
    tempObj.description = data.appealgrounds;
    tempObj.primaryappellant = data.primaryappellant;
    tempObj.latLng = data.latlng;

    const tempDate = moment(data.scheduleddate, moment.ISO_8601).utc();
    if (tempDate.format('HH:mm:ss') === '00:00:00') {
      tempObj.time = '-';
    } else {
      tempObj.time = tempDate.format('hh:mm A');
    }
    tempObj.date = tempDate.format('MM/DD/YYYY');

    return tempObj;
  }
  return {};
}

export function getCourtHistoryCollection(data) {
  if (typeof data === 'object' && data.length > 0) {
    const tempArr = [];
    for (let i = 0; i < data.length; i += 1) {
      const tempObj = {};
      const tempDate = moment(data[i].courtactiondate, moment.ISO_8601).utc();
      if (tempDate.format('HH:mm:ss') === '00:00:00') {
        tempObj.courtactiondate = tempDate.format('MM/DD/YYYY');
      } else {
        tempObj.courtactiondate = tempDate.format('MM/DD/YYYY hh:mm A');
      }
      tempObj.court = data[i].court;
      tempObj.courtcasenumber = data[i].courtcasenumber;
      tempObj.courtaction = data[i].courtaction;
      tempObj.courtresult = data[i].courtresult;
      tempObj.courtproviso = data[i].courtproviso;
      tempArr.push(tempObj);
    }
    return tempArr;
  }
  return [];
}


export function getDecisionHistoryCollection(data) {
  if (typeof data === 'object' && data.length > 0) {
    const tempArr = [];
    for (let i = 0; i < data.length; i += 1) {
      const tempObj = {};
      const tempDate = moment(data[i].decisiondate, moment.ISO_8601).utc();
      if (tempDate.format('HH:mm:ss') === '00:00:00') {
        tempObj.decisiondate = tempDate.format('MM/DD/YYYY');
      } else {
        tempObj.decisiondate = tempDate.format('MM/DD/YYYY hh:mm A');
      }
      tempObj.decision = data[i].decision;
      tempObj.meetingremarks = data[i].meetingremarks;
      tempArr.push(tempObj);
    }
    return tempArr;
  }
  return [];
}

export function getAppealTypes(data) {
  if (typeof data === 'object' && data.length > 0) {
    const tempArr = [];
    const done = [];
    for (let i = 0; i < data.length; i += 1) {
      if (data[i].scheduleddate) {
        const id = String(data[i].scheduleddate).substring(0, 10);
        if (!done[id]) done[id] = {};
        if (!done[id][data[i].applicationtype]) {
          const date = moment(id, 'YYYY-MM-DD').utc();
          tempArr.push({
            className: [`event-${data[i].applicationtype.toString().replace('_', '-')}`],
            applicationtype: data[i].applicationtype,

            title: data[i].applicationtype.toString().replace('RB_', '').replace('Zoning Board of Adjustment', 'ZBA'),
            start: date,
            editable: false,
            date: date.format('MM/DD/YYYY'),
          });
          done[id][data[i].applicationtype] = true;
        }
      }
    }
    return tempArr;
  }
  return [];
}

import * as moment from 'moment';

/**
 * Construct filtered data results collection
 * @param Array data 
 */
export function getFilterResultsCollection(data) {
	if (typeof data == 'object' && data.length > 0) {
		for ( let i = 0; i < data.length; i ++ ) {
			let temp = moment( data[i].date_scheduled );
			data[i].date = temp.format( 'MM/DD/YYYY' );
			data[i].time = temp.format( 'hh:mm A' );
		}

		return data;
	}
	return [];
}

/**
 * Construct Appeals Data Object
 * @param Object data 
 */
export function getAppealsDataObject(data) {
	if (typeof data == 'object') {
		let tempObj = new Object();

		tempObj.address = data.address;
		tempObj.type = data.applictype;
		tempObj.appealNo = data.appealno;
		tempObj.permitNo = data.descriptionofproject;
		tempObj.description = data.appealgrounds;
		tempObj.primaryApplicant = data.primaryapplicant;

		let tempDate = moment(data.date_scheduled);
		tempObj.date = tempDate.format('MM/DD/YYYY');
		tempObj.time = tempDate.format('hh:mm A');

		return tempObj;
	}
	return {};
}

/**
 * Construct Court History Collection
 * @param Array data 
 */
export function getCourtHistoryCollection(data) {
	if (typeof data == 'object' && data.length > 0) {
		let tempArr = new Array();
		for (let i = 0; i < data.length; i++) {
			let tempObj = new Object();
			tempObj.courtactiondate = moment(data[i].courtactiondate).format('MM/DD/YYYY hh:mm A');
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


/**
 * Construct Decision History Collection
 * @param Array data 
 */
export function getDecisionHistoryCollection(data) {
	if (typeof data == 'object' && data.length > 0) {
		let tempArr = new Array();
		for (let i = 0; i < data.length; i++) {
			let tempObj = new Object();
			tempObj.decisiondate = moment(data[i].decisiondate).format('MM/DD/YYYY hh:mm A');
			tempObj.decision = data[i].decision;
			tempObj.proviso = data[i].proviso;
			tempArr.push(tempObj);
		}
		return tempArr;
	}
	return [];
}
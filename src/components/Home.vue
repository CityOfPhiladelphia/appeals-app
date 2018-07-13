<template>
  <div class="container">
    <div class="row">
      <div class="columns medium-9">
        <div class="card">
          <div class="card-section">
            <form>
              <h3 v-if="!hideSelect"><i class="fi-marker"></i> Regions</h3>
              <p>Select a region below to filter the table data.</p>
              <select v-if="!hideSelect" class="selectpicker region-picker" title="Select a region..." v-model="regionSelect" v-on:change="changeURL(true)">
                <option value="all">All regions</option>
                <optgroup label="Council District">
                  <option value="cd:1">Council District 1</option>
                  <option value="cd:2">Council District 2</option>
                  <option value="cd:3">Council District 3</option>
                  <option value="cd:4">Council District 4</option>
                  <option value="cd:5">Council District 5</option>
                  <option value="cd:6">Council District 6</option>
                  <option value="cd:7">Council District 7</option>
                  <option value="cd:8">Council District 8</option>
                  <option value="cd:9">Council District 9</option>
                  <option value="cd:10">Council District 10</option>
                </optgroup>
                <optgroup label="Planning District">
                  <option value="planning:Central">Central</option>
                  <option value="planning:Central Northeast">Central Northeast</option>
                  <option value="planning:Lower Far Northeast">Lower Far Northeast</option>
                  <option value="planning:Lower North">Lower North</option>
                  <option value="planning:Lower Northeast">Lower Northeast</option>
                  <option value="planning:Lower Northwest">Lower Northwest</option>
                  <option value="planning:Lower South">Lower South</option>
                  <option value="planning:Lower Southwest">Lower Southwest</option>
                  <option value="planning:North">North</option>
                  <option value="planning:North Delaware">North Delaware</option>
                  <option value="planning:River Wards">River Wards</option>
                  <option value="planning:South">South</option>
                  <option value="planning:University/Southwest">University/Southwest</option>
                  <option value="planning:Upper Far Northeast">Upper Far Northeast</option>
                  <option value="planning:Upper North">Upper North</option>
                  <option value="planning:Upper Northwest">Upper Northwest</option>
                  <option value="planning:West">West</option>
                  <option value="planning:West Park">West Park</option>
                </optgroup>
                <optgroup label="RCO">
                  <option v-for="option in rcoArray" :key="option.attributes.ORGANIZATION_NAME" :value="`rco:${option.attributes.ORGANIZATION_NAME}`">
                    {{ option.attributes.ORGANIZATION_NAME }}
                  </option>
                </optgroup>
              </select>
              <hr>
              <div>
                <p>Use the calendar to filter by Appeals Type and Date</p>
              </div>
              <div>
                <full-calendar ref="calendar" :events="events" :config="config" @event-selected="filterTable"></full-calendar>
              </div>
              <div class="Legend">
                <p class=""><strong>LIBR:</strong> L&amp;I Review Board of Appeal</p>
                <p class=""><strong>ZBA:</strong> Zoning Board of Appeal</p>
                <p class=""><strong>BBS:</strong> Board of Building Standards</p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="columns medium-15 text-center">
        <div class="card">
          <div class="card-divider selected-filter">
            <h3 v-if="!loading && this.selectedEvent">Listing <strong>{{ this.selectedEvent.title | typeName }}</strong> for <strong>{{ this.selectedEvent.date | readableDate }}</strong></h3>
            <h3 v-else-if="!loading && !this.selectedEvent">
              Listing Appeals from <strong>{{ this.date1 | readableDate}}</strong> to <strong>{{ this.date2 | substractOneDay }}</strong>
              <small>The current list of Appeals are limited by the first and last dates on the calendar</small>
            </h3>
            <h3 v-else-if="loading">Fetching data...</h3>
          </div>
          <div class="card-section nopadding-xs">
            <v-client-table :data="localRows" :columns="['date', 'time', 'address', 'applictype', 'appealno']" @row-click="goToDetail"></v-client-table>
          </div>
        </div>
      </div>
    </div>
    <modal v-if="showModal" @close="showModal = false" :message="modalMessage"></modal>
  </div>
</template>
<script type="text/javsacript">
  /**
   * Import Helpers
   */
  import * as moment from 'moment';
  import axios from 'axios';
  import { ClientTable, Event } from 'vue-tables-2';
  import Vue from 'vue';
  import * as objects from '../assets/js/objects';
  import * as queries from '../assets/js/queries';

  /**
   * Import components
   */
  import Modal from './Modal.vue';
  global.$ = global.jQuery = require('jquery');

  import FullCalendar from 'vue-full-calendar'
  Vue.use(FullCalendar)

  Vue.use(ClientTable, {
    headings: {
      applictype: 'Type',
      appealno: 'Appeals #',
    },
    replaceHeadingWithFilter: true,
    perPage: 50,
    sortIcon: { base:'fa', up:'fa-sort-up', down:'fa-sort-down', is:'fa-sort' },
    filterByColumn: true,
    perPageValues: [],
    sortable: ['date', 'time'],
    filterable:["address", 'appealno', 'applictype'],
    customFilters: [{
        name:'byevent',
        callback: function(row, query) {
          if ( query === false ) return true;
          return row.applictype === query.applictype && row.date === query.date;
        }
    }],
    listColumns: {
      applictype: [
        { id: 'RB_ZBA', text: 'ZBA' },
        { id: 'RB_BBS', text: 'BBS' },
        { id: 'RB_LIRB', text: 'LIRB' },
      ],
    },
    texts:{
      noResults:"No matching records",
      filterBy:"Filter by {column}",
      defaultOption:'All {column}s',
    },
  });

  const serviceURL = "https://data.phila.gov/carto/api/v2/sql?q=";
  const VALIDATE_URL_DATE_FORMAT = 'YYYY-M-D';
  const DATE_FORMAT = 'YYYY-MM-DD';
  const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';

  export default {
    name: 'Home',
    data() {
      return {
        legacy: false,
        date1: null,
        date2: null,
        rcoArray: [],
        localRows: [],
        regionSelect: 'all',
        showModal: false,
        modalMessage: "",
        loading: true,
        hideSelect: false,
        selectedEvent: null,
        config: {
          defaultDate: moment(),
          displayEventTime: false,
          header: {
            left: 'prev',
            center: 'title',
            right: 'next'
          },
          defaultView: 'month',
          height: 'auto',
          contentHeight: 'auto',
          aspectRatio: 1.35,
          themeSystem: 'standard',
          viewRender: this.changedMonth,
        },
        events: [],
      };
    },
    components: {
      'modal': Modal,
    },
    created() {
      this.validateRoute();
    },
    beforeMount() {
      this.hideSelect = (document.documentElement.className === 'lt-ie10');
      if (this.$store.state.rcos.rcos.length > 0) {
        this.rcoArray = this.$store.state.rcos.rcos;
      } else {
        let promise = queries.getRCOs();
        promise.then(
          response => {
          try {
            if (response.data.features.length > 0) {
              this.$store.commit('rcos/setRcos', response.data.features);
              this.rcoArray = response.data.features;
            }
          } catch (err) {
            this.displayModal('getting the RCO data (CODE 006)', err);
          }
        });
      }
    },
    computed: {
      region: function() {
        let arr = this.regionSelect.split(':');
        return (arr[0]) ? arr[0] : '';
      },
      regionId: function() {
        let arr = this.regionSelect.split(':');
        return (arr[1]) ? arr[1] : '';
      }
    },
    filters: {
      typeName(type) {
        switch (type) {
          case 'LIRB':
            return 'L&I Review Board of Appeal';
          case 'ZBA':
            return 'Zoning Board of Appeal';
          case 'BBS':
            return 'Board of Building Standards';
        }
        return '';
      },
      substractOneDay(value) {
        return moment(value, 'MM/DD/YYYY').subtract(1, 'day').format('ll');
      },
      readableDate(value) {
        return moment(value, 'MM/DD/YYYY').format('ll');
      },
    },
    methods: {
      filterTable(event, jsEvent, view) {
        if (this.selectedEvent && event) {
          if (this.selectedEvent.date === event.date && this.selectedEvent.applictype === event.applictype) {
            event = false;
          }
        }
        
        if (this.selectedEvent) {
          this.selectedEvent.className.pop();
          this.$refs.calendar.fireMethod('updateEvent', this.selectedEvent);
        }

        if (event) {
          event.className.push('highlight');
          this.$refs.calendar.fireMethod('updateEvent', event);
        }
        
        this.selectedEvent = event;
        if (this.localRows.length > 0) {
          Event.$emit('vue-tables.filter::byevent', event);
        }
      },
      refreshEvents() {
        this.$refs.calendar.$emit('refetch-events')
      },
      changedMonth() {
        const view = this.$refs.calendar.fireMethod('getView');
        this.selectedYear = view.calendar.currentDate.utc().format('YYYY');
        this.selectedMonth = view.calendar.currentDate.utc().format('MM');

        if (this.selectedMonth !== this.$route.params.month || 
          this.selectedYear !== this.$route.params.year) {
            this.changeURL();
        }

        this.getAppeals();
      },
      changeURL(get) {
        let URL = `/${this.selectedYear}/${this.selectedMonth}`;
        if (this.region && this.regionId) {
          URL += `/${this.region}/${this.regionId}`;
        }

        this.$router.replace(URL);

        if(get) this.getAppeals();
      },
      validateRoute(changeCalendar) {
        if ( this.$route.path.indexOf('filter') !== -1 ) {
          // Legacy Stuff!
          alert("legacy");
        } else {
          let forceURL = false;
          if (Object.keys(this.$route.params).length !== 0 ) {
            // Lets validate
            const dateString = `${this.$route.params.year}-${this.$route.params.month}-01`;
            if (!moment(dateString, VALIDATE_URL_DATE_FORMAT, true).isValid()) {
                  forceURL = true;
            } else {
              this.selectedYear = this.$route.params.year;
              this.selectedMonth = this.$route.params.month;
              this.config.defaultDate = moment(`${this.$route.params.year}-${this.$route.params.month}-01`, 'YYYY-MM-DD');
            }

            if (this.$route.params.region && this.$route.params.regionId) {
              this.regionSelect = `${this.$route.params.region}:${this.$route.params.regionId}`;
            }

            if (forceURL) {
              this.selectedYear = moment().format('YYYY');
              this.selectedMonth = moment().format('MM');
              let URL = `/${this.selectedYear}/${this.selectedMonth}`;

              if (this.region && this.regionId) {
                URL += `/${this.region}/${this.regionId}`;
              }
              if (Object.keys(this.$route.params).length !== 0 ) {
                this.displayCustomErrorModal(`The URL parameters provided are invalid. 
                Please used the elements provided to get the Appeals.`);
              }
              this.$router.push(URL);
            }

            if( changeCalendar) {
              const view = this.$refs.calendar.fireMethod('getView');
              if ( view.calendar.currentDate.utc().format('MM') !== this.$route.params.month 
                || view.calendar.currentDate.utc().format('YYYY') !== this.$route.params.year ) {
                  this.$refs.calendar.fireMethod('gotoDate', `${this.$route.params.year}-${this.$route.params.month}-01`);
              }
            }
          }

          return true;
        }

        return false;
      },
      getAppeals() {
        this.filterTable(false);

        //Update dates on table title
        const view = this.$refs.calendar.fireMethod('getView');
        this.date1 = view.start.clone().utc().format('MM/DD/YYYY');
        this.date2 = view.end.clone().utc().format('MM/DD/YYYY');
        this.loading = true;
        this.localRows = [];
        const appealsTableBySlug = this.$store.getters.getAppealsTableBySlug(this.$route.path);
        if (appealsTableBySlug) {
          this.localRows = appealsTableBySlug;
          this.events = objects.getAppealTypes(this.localRows);
          this.loading = false;
        } else {
          let sql = "";
          if (!this.region || !this.regionId) {
            queries.get(
                queries.CARTO_URL,
                {
                  q:queries.replace(
                    queries.strings.appealsByDate,
                    `${this.date1}T00:00:00Z`, // Please do not ask, it just works =/
                    `${this.date2}T00:00:00Z` // Please do not ask, it just works =/
                  )
                }
              )
              .then((response) => {
                let filterDataCollection = objects.getFilterResultsCollection(response.data.rows);
                this.$store.dispatch('setAppealsHome', { slug: this.$route.path, data: filterDataCollection });
                this.localRows = filterDataCollection;
                this.events = objects.getAppealTypes(this.localRows);
                this.loading = false;
              })
              .catch(err => {
                this.displayModal('filtering by date (CODE 005)', err);
              });
          } else {
            try {
              queries.getGeographyData(this.region, this.regionId)
                .then((response) => {
                  if(!response.data.error) {
                    const geometry = response.data.features[0].geometry.rings;
                    queries.post(
                        queries.CARTO_URL,
                        {
                          q: queries.replace(
                            queries.strings.appealsByDateAndRegion,
                            `${this.date1}T00:00:00Z`, // Please do not ask, it just works =/
                            `${this.date2}T00:00:00Z`, // Please do not ask, it just works =/
                            JSON.stringify(geometry)
                          )
                        }
                      )
                      .then((cartoResponse) => {
                        let dataRows = cartoResponse.data.rows;
                        let filterDataCollection = objects.getFilterResultsCollection(dataRows);
                        this.$store.dispatch('setAppealsHome', { slug: this.$route.path, data: filterDataCollection });
                        this.localRows = filterDataCollection;
                        this.events = objects.getAppealTypes(this.localRows);
                        this.loading = false;
                      })
                      .catch(err => {
                        this.displayModal('filtering by region (CODE: 001)', err);
                      });
                  }else{
                    this.displayModal('filtering by region (CODE: 002)', err);
                  }
                })
                .catch((err) => {
                  this.displayModal('filtering by region (CODE: 003)', err);
                });
            } catch (err) {
              this.displayModal('filtering by region (CODE: 004)', err);
            }
          }
        }
      },
      goToDetail(object) {
        this.$emit('setZoningLink', this.$route.path);
        const rowObject = object.row;
        this.$router.push(`/appeals/${rowObject.appealno}/${encodeURIComponent(rowObject.date_scheduled)}`);
      },
      displayModal(text, err) {
        console.log(err);
        this.localRows = [];
        this.modalMessage = `The application has encountered an unknown error ${text},
                            please try again, if the problem persists,
                            contact your system administrator.`;
        this.showModal=true;
      },
      displayCustomErrorModal(text) {
        this.modalMessage = text;
        this.showModal=true;
      },
    },
    watch: {
      '$route' (to, from) {
        this.validateRoute(true);
      }
    }
  }
</script>
<style lang="scss">
  .table-responsive {
    overflow: hidden;
    overflow-x: auto;
  }
  .selected-filter {
    h3 {
      font-size: 16px;
    }
    small {
      color: inherit;
      display: block;
      font-size: 13px;
      // margin: 1rem 0;
      line-height: 1.3;
    }
  }
  p {
    font-size: 14px;
    line-height: 1.3;
  }
  table {
    input,
    select {
      margin-bottom: 0px !important;
    }
    tr:nth-child(even) {
      background: none;
    }
  }

  .fc {
    .fc-toolbar {
      button {
        border: none;
        background: none;
        box-shadow: none;
        margin-top: 3px;
      }
      button:hover, button:focus, button:active {
        color: initial;
      }
    }
  }

  #calendar {
    color: #444;
    background-color: #fff;
    table {
      margin: auto;
    }
    .fc-day-number {
      font-size: 10px;
      font-weight: 300;
    }
    .fc-event,
    .fc-event-dot {
      // margin-top: 3px;
      margin-bottom: 10px;
      font-size: 11px;
      // border: 2px solid #c0e1ff;
      border-radius: 0px;
      font-weight: 400;
      // transition: all 250ms linear;
      color: #444;
      background: none !important;
      border-left: 0;
      border-right: 0;
      border-top: 0;

      opacity: 0.85;
    }
    .fc-event:hover {
      opacity: 1;
    }
    .fc-event.highlight {
      font-weight: bold;
      opacity: 1;
      // border-top: 1px solid #CCCCCC;
      // border-right: 1px solid #777777;
      border-bottom: 2px solid #3a87ad;
      // border-left: 1px solid #CCCCCC;
      // box-shadow: 0px 2px 3px #888888;
      // border: 1px solid #fff;
    }
    .fc-head {
      background: #0f4d90;
      th {
        color: #fff;
      }
    }
    .event-RB-LIRB {
      background: #DAEDFE;
      // border-color: #DAEDFE;
      // color: #0f4d90;
    }
    .event-RB-ZBA {
      background: #b9f2b1;
      // border-color: #b9f2b1;
      // color: #58c04d;
    }
    .event-RB-BBS {
      background: #fed0d0;
      // border-color: #fed0d0;
      // color: #f99300;
    }
    thead,
    tbody {
      border: initial;
      background-color: initial;
      color: #333;
    }
    
    .fc-scroller {
      overflow-y: hidden !important;
    }

    .fc-highlight {
      background-color: #25cef7;
      background: none !important;
    }
  }

  .VueTables {
    tr  {
      td {
        cursor: pointer;
      }
    }
    tbody {
      tr:nth-child(even) {
        background-color: #dfdfdf;
      }
      tr:hover {
        background-color: #ece8e8;
      }
    }
    input {
      font-size: 13px;
      line-height: 100%;
      padding: 3px;
      height: auto;
      color: #444;
      height: 24px;
      // &:focus {
      //   border: none;
      // }
    }
    select {
      font-size: 13px;
      line-height: 100%;
      height: auto;
      color: #444;
      background-color: #F0F0F9;
      border: none;
      padding-left: 4px;
      height: 24px;
      padding-bottom: 0;
      padding-top: 0;
      background-position: right -11px center;
      min-width: 75px;
      padding-right: 15px;
    }
  }
  
  table {
    ::-webkit-input-placeholder { /* Chrome/Opera/Safari */
      color: #444;
    }
    ::-moz-placeholder { /* Firefox 19+ */
      color: #444;
    }
    :-ms-input-placeholder { /* IE 10+ */
      color: #444;
    }
    :-moz-placeholder { /* Firefox 18- */
      color: #444;
    }
  }

  .pagination {
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    display: inline-block;
    padding-left: 0;
    margin: 20px 0;
    border-radius: 4px;
  }

  .pagination>li {
    display: inline;
  }

  .pagination>li>a,
  .pagination>li>span {
    position: relative;
    float: left;
    margin-left: -1px;
    line-height: 1.42857143;
    text-decoration: none;
    padding: 2px 5px;
  }

  .pagination>li:first-child>a,
  .pagination>li:first-child>span {
    margin-left: 0;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  .pagination>li:last-child>a,
  .pagination>li:last-child>span {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .pagination>li>a:hover,
  .pagination>li>span:hover,
  .pagination>li>a:focus,
  .pagination>li>span:focus {
    z-index: 3;
    color: #23527c;
  }

  .pagination>.active>a,
  .pagination>.active>span,
  .pagination>.active>a:hover,
  .pagination>.active>span:hover,
  .pagination>.active>a:focus,
  .pagination>.active>span:focus {
    z-index: 2;
    color: #000;
    cursor: default;
  }

  .pagination>.disabled>span,
  .pagination>.disabled>span:hover,
  .pagination>.disabled>span:focus,
  .pagination>.disabled>a,
  .pagination>.disabled>a:hover,
  .pagination>.disabled>a:focus {
    color: #777;
    cursor: not-allowed;
  }


  .Legend {
    margin: 1rem 0;
    h4 {
      margin: 1rem 0;
      font-weight: bold;
    }
    p {
      margin: 0;
    }
  }
</style>

<template>
  <div class="container">
    <div class="row">
      <div class="columns">
        <div class="awkward">
          <h3><strong>Unsupported Version!</strong></h3>
          <p>The version of the application on this page is no longer supported.<br>There is a new version <router-link v-bind:to="'/'">available here</router-link>.</p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="columns text-center">
        <div class="card">
          <div class="card-divider">
            <h3 v-show="!loading">There are {{ rowsCount }} appeals from {{ displayDate1 | readableDate }} to {{ displayDate2 | readableDate }}</h3>
            <h3 v-show="loading">Fetching data...</h3>
          </div>
          <div class="card-section nopadding-xs">
            <custom-table v-on:rowClick="goToDetail" v-bind:enableRowClick="true" v-bind:allowLoadMore="true" v-bind:rows="localRows"
                v-bind:fields="['date', 'time', 'address', 'applictype', 'appealno']">
              <thead slot="head">
                <tr>
                  <th class="text-center">Date</th>
                  <th class="text-center">Time (EST)</th>
                  <th class="text-center">Address</th>
                  <th class="text-center">Type</th>
                  <th class="text-center">Appeal #</th>
                </tr>
              </thead>
            </custom-table>
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
  import * as objects from '@/assets/js/objects';
  import * as queries from '@/assets/js/queries';
  import Table from '@/components/legacy/Table';
  import Modal from '@/components/Modal';

  global.$ = global.jQuery = require('jquery');

  const VALIDATE_URL_DATE_FORMAT = 'YYYY-M-D';
  const DATE_FORMAT = 'YYYY-MM-DD';
  const ISO_FORMAT = 'YYYY-MM-DDTHH:mm:ssZ';
  const homeStore = {
    date1: null,
    displayDate1: '',
    date2: null,
    displayDate2: '',
    localRows: [],
    rowsCount: 0,
    regionSelect: 'all',
    showModal: false,
    modalMessage: "",
    loading: true,
    hideSelect: false,
  };

  export default {
    name: 'Home',
    data() {
      return homeStore;
    },
    components: {
      'custom-table': Table,
      'modal': Modal
    },
    beforeMount() {
      this.validateURL();
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
    methods: {
      validateURL() {
        this.hideSelect = (document.documentElement.className === 'lt-ie10');
        let forceURL = false;
        if (moment(this.$route.params.date1, VALIDATE_URL_DATE_FORMAT, true).isValid()) {
          this.date1 = moment(this.$route.params.date1, VALIDATE_URL_DATE_FORMAT).format(DATE_FORMAT);
        } else {
          // Wrong URL
          forceURL = true;
        }

        if (moment(this.$route.params.date2, VALIDATE_URL_DATE_FORMAT, true).isValid()) {
          this.date2 = moment(this.$route.params.date2, VALIDATE_URL_DATE_FORMAT).format(DATE_FORMAT);
        } else {
          // Wrong URL
          forceURL = true;
        }

        if (forceURL) {
          this.$router.push('/');
          return false;
        }

        if (this.$route.params.region && this.$route.params.regionId) {
          this.regionSelect = `${this.$route.params.region}:${this.$route.params.regionId}`;
        }

        this.filter();
      },
      filter() {
        //Update dates on table title
        this.displayDate1 = moment(this.date1).format('MM/DD/YYYY');
        this.displayDate2 = moment(this.date2).format('MM/DD/YYYY');
        this.loading = true;
        this.localRows = [];

        let sql = "";
        if (!this.region || !this.regionId) {
          queries.get(
              queries.CARTO_URL,
              {
                q:queries.replace(
                  queries.strings.appealsByDate,
                  `${this.date1}T00:00:00Z`, // Please do not ask, it just works =/
                  `${this.date2}T23:59:59Z` // Please do not ask, it just works =/
                )
              }
            )
            .then((response) => {
              let filterDataCollection = objects.getFilterResultsCollection(response.data.rows);
              this.rowsCount = filterDataCollection.length;
              this.localRows = filterDataCollection;
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
                          `${this.date2}T23:59:59Z`, // Please do not ask, it just works =/
                          JSON.stringify(geometry)
                        )
                      }
                    )
                    .then((cartoResponse) => {
                      let dataRows = cartoResponse.data.rows;
                      let filterDataCollection = objects.getFilterResultsCollection(dataRows);
                      this.rowsCount = filterDataCollection.length;
                      this.localRows = filterDataCollection;
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
      },
      goToDetail(rowObject) {
        this.$emit('setZoningLink', this.$route.path);
        this.$router.push(`/appeals/${rowObject.appealno}`);
      },
      displayModal(text, err) {
        this.rowsCount = 0;
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
        this.validateURL();
      }
    }
  }
</script>
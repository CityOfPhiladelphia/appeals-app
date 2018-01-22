<template>
  <div class="container">
    <div class="row">
      <div class="columns">
        <h3 v-show="!loading">{{ appealData.address }} <small># {{ appealData.appealNo }}</small></h3>
        <h3 v-show="loading">Fetching data...</small></h3>
      </div>
    </div>
    <div class="row">
      <div class="columns medium-16">
        <div class="card">
          <div class="card-divider">
            <h3><i class="fi-mail"></i> Appeal</h3>
          </div>
          <div class="card-section">
            <div class="row">
              <div class="medium-12 columns">
                <ul class="no-bullet">
                  <li>
                    <h4>ADDRESS</h4>
                    <p>{{ appealData.address }}</p>
                  </li>
                  <li>
                    <h4>TYPE</h4>
                    <p>{{ appealData.type | humanReadableAppealType }}</p>
                  </li>
                  <li>
                    <h4>APPLICATION TYPE</h4>
                    <p v-for="(at, key) in localAppealsTypes" :key="key">
                      {{ at }}
                    </p>
                  </li>
                </ul>
              </div>
              <div class="medium-12 columns">
                <ul class="no-bullet">
                  <li>
                    <h4>APPEAL #</h4>
                    <p>{{ appealData.appealNo }}</p>
                  </li>
                  <li>
                    <h4>PERMIT APPLICATION #</h4>
                    <p>{{ appealData.permitNo }}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="row">
              <div class="columns">
                <h4>APPLICATION DESCRIPTION</h4>
                <p>{{ appealData.description }}</p>
              </div>
              <div class="columns">
                <h4>PRIMARY APPLICANT</h4>
                <p>{{ appealData.primaryApplicant }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-divider">
            <h3><i class="fi-book"></i> History</h3>
          </div>
          <div class="card-section h4-cursor">
            <a href="#" v-on:click.prevent="initDecisionHistory">DECISION HISTORY</a>
            <custom-table-decision
              v-show="showHideDecisionHistory"
              v-bind:rows="localDecisionHistoryRows">
              <thead slot="head">
                <tr>
                  <th>Date</th>
                  <th>Decision</th>
                  <th>Notes</th>
                </tr>
              </thead>
            </custom-table-decision>

            <hr>

            <a href="" v-on:click.prevent="initCourtHistory">COURT HISTORY</a>
            <custom-table-court
              v-show="showHideCourtHistory"
              v-bind:rows="localCourtHistoryRows">
              <thead slot="head">
                <tr>
                  <th>Date</th>
                  <th>Court Type</th>
                  <th>Case #</th>
                  <th>Action</th>
                  <th>Result</th>
                  <th>Proviso</th>
                </tr>
              </thead>
            </custom-table-court>
          </div>
        </div>
      </div>
      <div class="columns medium-8">
        <div class="card">
          <div class="card-divider">
            <h3><i class="fi-calendar"></i> Hearing</h3>
          </div>
          <div class="card-section">
            <ul class="no-bullet">
              <li>
                <h4>DATE</h4>
                <p>{{ appealData.date }}</p>
              </li>
              <li>
                <h4>TIME</h4>
                <p>{{ appealData.time }}</p>
              </li>
              <li>
                <h4>ZONING BOARD OF ADJUSTMENT</h4>
                <p>1515 Arch Street, 18th Floor<br />215-686-2429 or 215-686-2430</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="card">
          <div class="card-divider">
            <a v-bind:href="'http://li.phila.gov/#summary?address=' + encodeURI(appealData.address)" target="_blank" ref="liLink"><strong>LOCATION HISTORY: </strong>{{ appealData.address }} <i class="fi-arrow-right"></i></a>
          </div>
        </div>
        <div class="card">
          <div class="card-section">
            <div class="map-container">
              <!-- <gmap-map :center="centerPoint" :zoom="16" style="width: 100%; height: 100%">
                <gmap-marker :position="markerPoint"></gmap-marker>
              </gmap-map> -->
              <city-map v-if="localLocation !== null" :location="localLocation" style="width: 100%; height: 100%"></city-map>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  /**
  * Import Helpers
  */
  import Table from '@/components/legacy/Table';
  import * as objects from '../assets/js/objects';
  import * as queries from '../assets/js/queries';
  import Map from '../components/Map';

  export default {
    name: 'Detail',
    data() {
      return {
        appealNo: '',
        appealData: {},
        localDecisionHistoryRows: [],
        localCourtHistoryRows: [],
        showHideDecisionHistory: false,
        showHideCourtHistory: false,
        loading: true,
        localLocation: null,
        localAppealsTypes: null,
      };
    },
    components: {
      'city-map': Map,
      'custom-table-decision': Table,
      'custom-table-court': Table,
    },
    beforeMount() {
      this.loadData();
    },
    watch: {
      // eslint-disable-next-line
      '$route'(to, from) {
        this.loadData();
      },
    },
    filters: {
      humanReadableAppealType(type) {
        switch (type) {
          case 'RB_BBS':
            return 'Board of Building Standards';
          case 'RB_LIRB':
            return 'L&I Review Board of Appeal';
          case 'RB_ZBA':
            return 'Zoning Board of Appeal';
          default:
            return '';
        }
      },
    },
    methods: {
      renderLocalLocation() {
        // Get Latitude and Longitude Array
        if (typeof this.appealData.latLng === 'string') {
          let point = '';
          point = this.appealData.latLng.replace('POINT(', '');
          point = point.replace(')', '');
          const pointArr = point.split(' ');
          if (pointArr.length === 2) {
            this.localLocation = [parseFloat(pointArr[1]), parseFloat(pointArr[0])];
          }
        }
      },
      loadData: function loadData() {
        if (typeof this.$route.params.appealId === 'undefined') {
          // Wrong URL go to not found
          this.$router.push('/not-found');
        } else {
          const appealPath = `${this.$route.path}/appealData`;
          try {
            const appealId = parseInt(this.$route.params.appealId, 10);
            this.appealNo = appealId;
            const appealData = this.$store.getters.getAppealDetailBySlug(appealPath);
            if (appealData) {
              this.appealData = appealData;
              this.renderLocalLocation();
              this.renderAppealTypes();
              this.loading = false;
            } else {
              let subQuery = '';
              if (this.$route.params.date) {
                subQuery = queries.replace(
                  queries.strings.appealByIdDate,
                  appealId,
                  this.$route.params.date);
              } else {
                subQuery = queries.replace(
                  queries.strings.appealById,
                  appealId);
              }
              queries.get(queries.CARTO_URL, { q: subQuery })
                .then((response) => {
                  if (response.data.rows.length > 0) {
                    const appealsDataObject = objects.getAppealsDataObject(response.data.rows[0]);
                    this.$store.commit('setAppealDetailBySlug', { slug: appealPath, data: appealsDataObject });
                    this.appealData = appealsDataObject;
                    this.renderLocalLocation();
                    this.renderAppealTypes();
                    this.loading = false;
                  } else {
                    // Not results go to not found
                    this.$router.push('/not-found');
                  }
                })
                .catch(() => {
                  // Something went wrong, go to not found
                  this.$router.push('/not-found');
                });
            }
          } catch (err) {
            // Wrong URL go to not found
            this.$router.push('/not-found');
          }
        }
      },
      renderAppealTypes() {
        const appealsTypes = this.$store.getters.getAppealsTypesByID(this.appealNo);
        if (appealsTypes) {
          this.localAppealsTypes = appealsTypes;
        } else {
          const subQuery = queries.replace(queries.strings.appealTypes, this.appealNo);
          queries.get(queries.CARTO_URL, { q: subQuery })
            .then((response) => {
              const dataRows = response.data.rows;
              if (dataRows.length > 0) {
                const maped = dataRows.map(obj => obj.appealtype);
                this.$store.commit('setAppealTypeByID', {
                  appealNo: this.appealNo,
                  types: maped });
                this.localAppealsTypes = maped;
              } else {
                this.$store.commit('decisions/setDecisionBySlug', { appealNo: this.appealNo, types: [] });
                this.localAppealsTypes = [];
              }
            })
            .catch(() => {
              // Something went wrong, go to not found
              this.$store.commit('decisions/setDecisionBySlug', { appealNo: this.appealNo, types: [] });
              this.localAppealsTypes = [];
            });
        }
      },
      initDecisionHistory() {
        this.showHideDecisionHistory = true;
        const decisionPath = `${this.$route.path}/decision`;
        const decisionData = this.$store.getters['decisions/getDecisionBySlug'](decisionPath);
        if (decisionData) {
          this.localDecisionHistoryRows = decisionData;
        } else {
          const subQuery = queries.replace(queries.strings.deicisionHistory, this.appealNo);
          queries.get(queries.CARTO_URL, { q: subQuery })
            .then((response) => {
              const dataRows = response.data.rows;
              const decisionHistoryCollection = objects.getDecisionHistoryCollection(dataRows);
              this.$store.commit('decisions/setDecisionBySlug', { slug: decisionPath, data: decisionHistoryCollection });
              this.localDecisionHistoryRows = decisionHistoryCollection;
            })
            .catch(() => {
              // Something went wrong, go to not found
              this.$store.commit('decisions/setDecisionBySlug', { slug: decisionPath, data: [] });
              this.localDecisionHistoryRows = [];
            });
        }
      },
      initCourtHistory() {
        this.showHideCourtHistory = true;
        const courtPath = `${this.$route.path}/court`;
        const historyData = this.$store.getters['history/getHistoryBySlug'](courtPath);
        if (historyData) {
          this.localCourtHistoryRows = historyData;
        } else {
          const subQuery = queries.replace(queries.strings.courtHistory, this.appealNo);
          queries.get(queries.CARTO_URL, { q: subQuery })
            .then((response) => {
              const courtHistoryColletion = objects.getCourtHistoryCollection(response.data.rows);
              this.$store.commit('history/setHistoryBySlug', { slug: courtPath, data: courtHistoryColletion });
              this.localCourtHistoryRows = courtHistoryColletion;
            })
            .catch(() => {
              // Something went wrong, go to not found
              this.$store.commit('history/setHistoryBySlug', { slug: courtPath, data: [] });
              this.localCourtHistoryRows = [];
            });
        }
      },
    },
  };
</script>
<style scoped>
  #application .app-footer.anchor{
    z-index: 1000;
  }
  h4 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
  }
  p {
    font-size: 0.9375rem;
  }
  ul li {
    margin: 15px 0;
  }
</style>

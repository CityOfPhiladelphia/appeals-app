<template>
	<div class="container">
		<div class="row">
			<div class="columns">
				<h3>{{ appealData.address }} <small># {{ appealData.appealNo }}</small></h3>
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
										<p>{{ appealData.type }}</p>
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
						<!-- <table class="hover" v-show="courtHistory.length>0">
							<thead>
								<tr>
									<th>Date</th>
									<th>Court Type</th>
									<th>Case #</th>
									<th>Action</th>
									<th>Result</th>
									<th>Proviso</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="ch in courtHistory">
									<td>{{ ch.courtactiondate }}</td>
									<td>{{ ch.court }}</td>
									<td>{{ ch.courtcasenumber }}</td>
									<td>{{ ch.courtaction }}</td>
									<td>{{ ch.courtresult }}</td>
									<td>{{ ch.courtproviso }}</td>
								</tr>
							</tbody>
						</table> -->
						
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
			</div>
		</div>
	</div>
</template>

<script>
	/**
	* Import Helpers
	*/
	import * as moment from 'moment';
	import * as objects from '../assets/js/objects';
	import * as cache from '../assets/js/utils/cache';
	import * as queries from '../assets/js/queries';

	/**
	* Import components
	*/
	import Table from './Table.vue'

	export default {
		name: 'details',
		data() {
			return {
				appealNo: '',
				appealData: {},
				localDecisionHistoryRows: [],
				localCourtHistoryRows: [],
				showHideDecisionHistory: false,
				showHideCourtHistory: false,
			}
		},
		components: {
			'custom-table-decision': Table,
			'custom-table-court': Table,
		},
		beforeMount: function () {
			this.loadData();
		},
		watch: {
			'$route' (to, from) {
				this.loadData();
			}
		},
		methods: {
			loadData: function () {
				if ('undefined' == typeof this.$route.params.appealId) {
					// Wrong URL go to not found
					this.$router.push(`/not-found`);
				} else {
					const appealPath = `${this.$route.path}/appealData`;
					try {
						let appealId = parseInt(this.$route.params.appealId);
						this.appealNo = appealId;
						if (cache.get(appealPath)) {
							this.appealData = cache.get(appealPath);
						} else {
							queries.query(queries.CARTO_URL + queries.prepare(queries.strings.appealById, appealId))
								.then(response => {
									if (response.data.rows.length > 0) {
										let appealsDataObject = objects.getAppealsDataObject(response.data.rows[0]);
										cache.set(appealPath, appealsDataObject);
										this.appealData = appealsDataObject;
									} else {
										// Not results go to not found
										this.$router.push(`/not-found`);
									}
								})
								.catch(err => {
									// Something went wrong, go to not found
									this.$router.push(`/not-found`);
								});
						}
					} catch (err) {
						// Wrong URL go to not found
						this.$router.push(`/not-found`);
					}
				}
			},
			initDecisionHistory: function () {
				this.showHideDecisionHistory = true;
				const decisionPath = `${this.$route.path}/decision`;

				if (cache.get(decisionPath)) {
					this.localDecisionHistoryRows = cache.get(decisionPath);
				} else {
					queries.query(queries.CARTO_URL + queries.prepare(queries.strings.deicisionHistory, this.appealNo))
						.then(response => {
							let decisionHistoryCollection = objects.getDecisionHistoryCollection(response.data.rows);
							cache.set(decisionPath, decisionHistoryCollection);
							this.localDecisionHistoryRows = decisionHistoryCollection;
						})
						.catch(err => {
							// Something went wrong, go to not found
							cache.set(decisionPath, []);
							this.localDecisionHistoryRows = [];
						});
				}
			},
			initCourtHistory: function () {
				this.showHideCourtHistory = true;
				const courtPath = `${this.$route.path}/court`;

				if (cache.get(courtPath)) {
					this.localCourtHistoryRows = cache.get(courtPath);
				} else {
					queries.query(queries.CARTO_URL + queries.prepare(queries.strings.courtHistory, this.appealNo))
						.then(response => {
							let courtHistoryColletion = objects.getCourtHistoryCollection(response.data.rows);
							cache.set(courtPath, courtHistoryColletion);
							this.localCourtHistoryRows = courtHistoryColletion;
						})
						.catch(err => {
							// Something went wrong, go to not found
							cache.set(courtPath, []);
							this.localCourtHistoryRows = [];
						});
				}
			}
		}
	}
</script>
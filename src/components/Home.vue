<template>
	<div class="container">
		<div class="row">
			<div class="columns medium-8">
				<div class="card">
					<div class="card-section">
						<form>
							<h3><i class="fi-marker"></i> Regions</h3>
							<select class="selectpicker region-picker" title="Select a region..." ref="select" v-on:change="changeURL">
								<option value="all" selected="selected">All regions</option>
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
									<option v-for="option in rcoArray" v-bind:value="`rco:${option.attributes.ORGANIZATION_NAME}`">
										{{ option.attributes.ORGANIZATION_NAME }}
									</option>
								</optgroup>
							</select>
							<div>
								<h3><i class="fi-calendar"></i> Date</h3>
								<div class="input-group">
									<input class="input-group-field" id="dpd1" type="text" ref="refDate1">
									<span class="input-group-label">to</span>
									<input class="input-group-field" id="dpd2" type="text" ref="refDate2">
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
			<div class="columns medium-16 text-center">
				<div class="card">
					<div class="card-divider">
						<h3>There are {{ rowsCount }} appeals from {{ displayDate1 }} to {{ displayDate2 }}</h3>
					</div>
					<div class="card-section nopadding-xs">
						<custom-table v-on:rowClick="goToDetail" v-bind:enableRowClick="true" v-bind:allowLoadMore="true" v-bind:rows="localRows"
						    v-bind:fields="['date', 'time', 'address', 'appealno']">
							<thead slot="head">
								<tr>
									<th class="text-center">Date</th>
									<th class="text-center">Time (EST)</th>
									<th class="text-center">Address</th>
									<th class="text-center">Appeal #</th>
								</tr>
							</thead>
						</custom-table>
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
	import $ from 'jquery';
	import * as moment from 'moment';
	import * as objects from '../assets/js/objects';
	import * as cache from '../assets/js/utils/cache';
	import * as queries from '../assets/js/queries';

	/**
	 * Import components
	 */
	import Table from './Table.vue'


	require('../assets/js/utils/foundation-datepicker.min.js');

	const homeStore = {
		date1: null,
		displayDate1: '',
		date2: null,
		displayDate2: '',
		region: null,
		regionId: null,
		rcoArray: [],
		datepicker1: null,
		datepicker2: null,
		localRows: [],
		rowsCount: 0
	};

	export default {
		name: 'Home',
		data() {
			return homeStore;
		},
		components: {
			'custom-table': Table
		},
		beforeMount: function () {
			let forceURL = false;

			if (moment(this.$route.params.date1, 'YYYY-MM-DD', true).isValid()) {
				this.date1 = moment(this.$route.params.date1);
			} else {
				// Wrong URL
				forceURL = true;
			}

			if (moment(this.$route.params.date2, 'YYYY-MM-DD', true).isValid()) {
				this.date2 = moment(this.$route.params.date2);
			} else {
				// Wrong URL
				forceURL = true;
			}

			if (!this.date1) {
				this.date1 = moment();
			}

			if (!this.date2) {
				this.date2 = moment().add(6, 'months');
			}

			if (this.$route.params.region) {
				this.region = this.$route.params.region;
			}

			if (this.$route.params.regionId) {
				this.regionId = this.$route.params.regionId;
			}

			if (forceURL) {
				let URL = `/filter/${this.date1.format('YYYY-MM-DD')}/${this.date2.format('YYYY-MM-DD')}`;
				if (this.region && this.regionId) {
					URL += `/${this.region}/${this.regionId}`;
				}
				this.$router.push(URL);
			}

			if (cache.get('rco')) {
				this.rcoArray = cache.get('rco');
			} else {
				let promise = queries.query(queries.strings.rco);
				promise.then(response => {
					try {
						if (response.data.features.length > 0) {
							cache.set('rco', response.data.features);
							this.rcoArray = response.data.features;
						}
					} catch (err) {

					}
				});
			}
		},
		mounted: function () {
			this.datepicker1 = $(this.$refs.refDate1).fdatepicker({
					initialDate: this.date1.toDate(),
					format: 'yyyy-mm-dd'
				})
				.on('changeDate', this.changeDate1)
				.data('datepicker');

			this.datepicker2 = $(this.$refs.refDate2).fdatepicker({
					initialDate: this.date2.toDate(),
					format: 'yyyy-mm-dd',
					onRender: function (date) {
						return date.valueOf() <= homeStore.datepicker1.date.valueOf() ? 'disabled' : '';
					}
				})
				.on('changeDate', this.changeDate2)
				.data('datepicker');

			this.filter();
		},
		methods: {
			changeDate1: function (ev) {
				if (ev.date.valueOf() > this.datepicker2.date.valueOf()) {
					var newDate = new Date(ev.date)
					newDate.setDate(newDate.getDate() + 1);
					homeStore.datepicker2.update(newDate);
				}
				this.datepicker1.hide();
				this.changeURL();
			},
			changeDate2: function (ev) {
				this.datepicker2.hide();
				this.changeURL();
			},
			filterParams: function () {
				const select = this.$refs.select.value;
				const date1 = this.$refs.refDate1.value;
				const date2 = this.$refs.refDate2.value;

				let region = "";
				let regionId = "";

				if (select) {
					let selectArr = select.split(':');
					region = selectArr[0];
					regionId = selectArr[1];
				}

				return {
					date1: date1,
					date2: date2,
					region: region,
					regionId: regionId
				};
			},
			changeURL: function () {
				const params = this.filterParams();

				let URL = `/filter/${params.date1}/${params.date2}`;
				if (params.region && params.regionId) {
					URL += `/${params.region}/${params.regionId}`;
				}

				this.$router.replace(URL);
			},
			filter: function () {
				const params = this.filterParams();
				this.date1 = moment(params.date1, "YYYY-MM-DD");
				this.date2 = moment(params.date2, "YYYY-MM-DD");

				//Update dates on table title
				this.displayDate1 = this.date1.format('MM/DD/YYYY');
				this.displayDate2 = this.date2.format('MM/DD/YYYY');

				if (cache.get(this.$route.path)) {
					this.rowsCount = cache.get(this.$route.path).length;
					this.localRows = cache.get(this.$route.path);
				} else {
					let sql = "";

					if (!params.region || !params.regionId) {
						sql = queries.CARTO_URL + queries.prepare(
							queries.strings.appealsByDate,
							this.date1.toISOString(),
							this.date2.toISOString()
						);
					}

					if (sql != "") {
						queries.query(sql)
							.then(response => {
								let filterDataCollection = objects.getFilterResultsCollection(response.data.rows);
								cache.set(this.$route.path, filterDataCollection);
								this.rowsCount = filterDataCollection.length;
								this.localRows = filterDataCollection;
							})
							.catch(err => {

							});
					}
				}
			},
			goToDetail: function (rowObject) {
				this.$emit('setZoningLink', this.$route.path);
				this.$router.push(`/appeals/${rowObject.appealno}`);
			}
		},
		watch: {
			'$route' (to, from) {
				this.filter();
			}
		}
	}
</script>
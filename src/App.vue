<template>
	<div id="app">
		<div class="app-nav">
			<div class="row expanded">
				<div class="columns">
					<nav>
						<ul>
							<li>
								<a href="http://www.phila.gov/">Phila</a>
							</li>
							<li>
								<a href="http://www.phila.gov/li/Pages/default.aspx">L &amp; I</a>
							</li>
							<li>
								<router-link v-bind:to="zoningLink">Zoning Appeals</router-link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
		<main>
			<div id="app">
				<router-view v-on:setZoningLink="setZoningLink"></router-view>
			</div>
		</main>
		<div class="app-footer anchor">
			<footer>
				<div class="row expanded">
					<div class="columns">
						<nav>
							<ul class="inline-list">
								<li>
									<a href="https://beta.phila.gov/feedback/">Feedback</a>
								</li>
								<li>
									<a href="#">More links</a>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</footer>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				zoningLink: "/"
			}
		},
		methods: {
			setZoningLink: function ( link ) {
				this.zoningLink = link;
			}
		},
		created: function () {
			this.zoningLink = '/';
		}
	}
</script>
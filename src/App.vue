<template>
  <div id="app">
    <div class="app-nav">
      <nav>
        <ul>
          <li v-if="displayGoBack">
            <router-link v-bind:to="zoningLink">Go Back</router-link>
          </li>
        </ul>
      </nav>
    </div>
    <main>
      <div id="app">
        <div class="row" v-if="ie9">
          <div class="columns">
            <div class="awkward">
              <h3>Ok, this is awkward =/</h3>
              <p>Hmmm, could you please upgrade your Internet Browser? This is an unsupported one. <strong>Some features may be disabled.</strong></p>
            </div>
          </div>
        </div>
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
                  <a href="https://beta.phila.gov/feedback/" class="philly-feedback-button">Feedback</a>
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
        zoningLink: '/',
        ie9: false,
      };
    },
    methods: {
      setZoningLink(link) {
        this.zoningLink = link;
      },
    },
    created() {
      this.zoningLink = '/';
    },
    computed: {
      displayGoBack() {
        return (this.$route.name === 'appealDetail');
      },
    },
    beforeMount() {
      this.ie9 = (document.documentElement.className === 'lt-ie10');
    },
  };
</script>
<style>
#application .app-nav {
  text-align: left !important;
  min-height: 10px;
  padding: 0;
}
select {
  -moz-appearance: none;
  -ms-appearance: none;
  appearance: none;
}
</style>


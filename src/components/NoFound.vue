<template>
<div class="container">
    <div class="row">
        <div class="columns">
            <h2>Appeal Not Found</h2>
            <h4>Sorry, we couldn't find the details for that appeal. Please check your appeal number and try again. If your appeal number is correct, the hearing occurred over a year ago and is no longer available to this application.</h4>
            <a v-on:click.prevent="goToZoningAppealsList" ref="goToZoningAppeals">Go to Zoning Appeals List</a>
        </div>
    </div>
</div>
</template>

<script>
import * as moment from 'moment';

export default {
  name: 'NoFound',
  data() {
    return {};
  },
  methods: {
    goToZoningAppealsList() {
      const date = moment().format('YYYY/MM');
      this.$router.push(`/${date}`);
    },
  },
};
</script>
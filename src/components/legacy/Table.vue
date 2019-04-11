<template>
  <div>
    <table v-bind:class="{ 'hover': enableRowClick }">
      <slot name="head"></slot>
      <tbody>
        <tr v-for="(row, key) in rowsList" v-bind:key="key" v-on:click="doRowClick(row)">
          <template v-if="fields.length">
            <td v-for="field in fields" v-bind:key="field">{{ row[field] | readableDate }}</td>
          </template>
          <template v-else>
            <td v-for="(f, ck) in row" v-bind:key="ck">{{ f | readableDate }}</td>
          </template>
        </tr>
      </tbody>
      <slot name="footer"></slot>
    </table>
    <p class="no-results" v-show="rowsList.length<=0">{{ noFoundText }}</p>
    <div class="text-center">
      <a v-show="toggleLoadMore && rows.length > 0 && allowLoadMore" v-on:click.prevent="loadMore">Load More...</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Table',
    data() {
      return {
        rowsList: [],
        toggleLoadMore: false,
        page: -1,
      };
    },
    props: {
      fields: {
        type: Array,
        default() {
          return [];
        },
      },
      rows: {
        type: [Array],
        default() {
          return [];
        },
      },
      enableRowClick: {
        type: Boolean,
        default: false,
      },
      allowLoadMore: {
        type: Boolean,
        default: false,
      },
      loadMorePageSize: {
        type: Number,
        default: 50,
      },
      noFoundText: {
        type: String,
        default: 'No results found',
      },
    },
    beforeMount() {

    },
    methods: {
      doRowClick(el) {
        if (this.enableRowClick) {
          this.$emit('rowClick', el);
        }
      },
      loadMore() {
        if (this.rows.length === 0) {
          this.rowsList = [];
        }

        this.page += 1;
        try {
          const count = (this.page * this.loadMorePageSize);
          const param2 = ((this.page + 1) * this.loadMorePageSize);
          const slicedArray = Array.from(this.rows.slice(count, param2));
          if (slicedArray.length > 0) {
            this.rowsList = this.rowsList.concat(slicedArray);
            if (this.rowsList.length >= this.rows.length) {
              this.toggleLoadMore = false;
            }
          } else {
            this.toggleLoadMore = false;
          }
        } catch (err) {
          throw (err);
        }
      },
    },
    watch: {
      rows() {
        this.rowsList = [];
        if (this.allowLoadMore) {
          this.page = -1;
          this.toggleLoadMore = true;
          this.loadMore();
        } else {
          this.toggleLoadMore = false;
          this.rowsList = this.rows;
        }
      },
    },
  };

</script>

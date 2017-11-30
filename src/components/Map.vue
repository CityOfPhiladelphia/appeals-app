
<template></template>

<script>
import L from 'leaflet';
import esri from 'esri-leaflet';
// eslint-disable-next-line
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  // eslint-disable-next-line
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  // eslint-disable-next-line
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  // eslint-disable-next-line
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  props: [
    'location',
  ],
  data() {
    return {
      defaultLocation: [39.9523893, -75.1636291],
      marker: null,
      map: null,
    };
  },
  mounted() {
    this.map = this.initMap();
    this.addBasemap();
    this.placeMarker();
  },
  methods: {
    getLocation() {
      return this.location || this.defaultLocation;
    },
    initMap() {
      return L.map(this.$el).setView(this.getLocation(), 18);
    },
    addBasemap() {
      esri.tiledMapLayer({
        url: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap/MapServer',
        maxZoom: 20,
      }).addTo(this.map);
      esri.tiledMapLayer({
        url: 'https://tiles.arcgis.com/tiles/fLeGjb7u4uXqeF9q/arcgis/rest/services/CityBasemap_Labels/MapServer',
        maxZoom: 20,
      }).addTo(this.map);
    },
    placeMarker() {
      const location = this.getLocation();
      this.marker = L.marker(location).addTo(this.map);
      this.map.panTo(location);
    },
  },
  watch: {
    location() {
      this.placeMarker();
    },
  },
};
</script>

<style lang="sass">
@import '~leaflet/dist/leaflet.css'
</style>
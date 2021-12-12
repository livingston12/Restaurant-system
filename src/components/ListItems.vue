<template>
  <v-list-item class="pl-0">
    <v-list-item-content class="pl-0">
      <div v-for="(item, index) in data" :key="index">
        <v-list-item-title v-for="subItem in item" :key="subItem" class="item">
          <span v-html="subItem"></span>
          <v-divider />
        </v-list-item-title>
      </div>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
.item {
  padding-top: 8px;
  display: list-item;
  list-style-type: disc;
  list-style-position: inside;
  padding-left: 0;
}
</style>
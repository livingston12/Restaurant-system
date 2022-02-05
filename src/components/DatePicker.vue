<template>
  <v-menu
    v-model="menuIsOpen"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="date"
        :label="title"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        v-on="on"
        dense
      />
    </template>
    <v-date-picker :value="date" @input="onCloseDatePicker"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      menuIsOpen: null
    };
  },
  props: {
    title: {
      type: String,
      required: false,
      default: () => ""
    },
    date: {
      type: String,
      required: false,
      default: () => ""
    }
  },
  methods: {
    onCloseDatePicker(date) {
      this.menuIsOpen = false;
      this.$emit("onCloseDatePicker", date);
    }
  }
};
</script>

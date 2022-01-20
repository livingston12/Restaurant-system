<template>
  <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog
        transition="dialog-bottom-transition"
        max-width="600"
        v-model="isOpen"
        persistent
        
      >
        <template>
          <v-card shaped>
            <v-toolbar :color="color" class="text-h5">
              {{ title }}</v-toolbar
            >
            <v-card-text>
              <ul v-if="type === 'error' || type === ''" class="pt-2 ul-no-decoration">
                <li class="text-h6" v-for="error in errors" :key="error">
                  <span v-html="error"></span>
                </li>
              </ul>
              <listItem v-else-if="type === 'list'" :data="errors"></listItem>
            </v-card-text>

            <v-card-actions class="text-right">
              <v-btn  @click="closeModal" :color="color" class="white--text">Close </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import listItem from "./ListItems";

export default {
  components: { listItem },
  props: {
    errors: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    color: {
      type: String,
      required: false,
      default: () => "red",
    },
    type: {
      type: String,
      required: false,
      default: () => "error",
    },
  },
  methods: {
    closeModal() {
      this.$emit("onCloseModal", this.isOpen);
    },
  },
};
</script>
<style >
 .ul-no-decoration {
   list-style-type: none;
 }
</style>


<template>
  <v-card class="mx-auto text-center pb-3" color="teal" max-width="800">
    <v-card-text class="pt-0 pb-2">
      <div class="text-h4 font-weight-bold ">
        {{ title }}
      </div>
    </v-card-text>

      <v-hover v-slot="{ hover }" open-delay="100" >
        <v-sheet  color="teal" :elevation="hover ? 10 : 0" >
          <v-sparkline
            :value="data.totals"
            :labels="data.labels"
            :type="CurrentType"
            :auto-draw="true"
            :auto-line-width="IsBar"
            height="40"
            padding="40"
            smooth
            color="white"
          >
            <template v-slot:label="item">
              {{ getLabels(item.value) }}
            </template>
          </v-sparkline>
        </v-sheet>
      </v-hover>
  </v-card>
</template>

<script>
import { maxArray, numberFormat } from "../utils/core";

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: () => ""
    },
    type: {
      type: String,
      required: false,
      default: () => "bar"
    }
  },
  methods: {
    maxArray: maxArray,
    numberFormat: numberFormat,
    getLabels(label) {
      const data = this.data;
      const index = data.labels.findIndex(x => x == label);
      const total = numberFormat(data.totals[index], 2);

      return label + " - $" + total;
    }
  },
  computed: {
    IsBar() {
      return this.type == "" || this.type == "bar";
    },
    CurrentType() {
      return this.IsBar ? "bar" : "trend";
    }
  }
};
</script>

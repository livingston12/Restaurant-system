<template>
  <v-row justify="center">
    <v-dialog v-model="isOpen" persistent max-width="500">
      <v-card>
        <v-card-title class="text-h5 primary">
          {{ title }}
        </v-card-title>
        <v-card-text class="text-h6" v-html="text" style="padding-top: 10px;">
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red" @click="approval(false)">
            No
          </v-btn>
          <v-btn color="green" @click="approval(true)" class="float-right">
            Si
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: () => false
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    typeApproval: {
      type: String,
      required: false,
      default: () => ''
    }
  },
  methods: {
    approval(isApproval) {
      const data = {
        isApproval,
        typeApproval: this.typeApproval
      }
      
      this.$emit("onApproval", data);
    }
  }
};
</script>

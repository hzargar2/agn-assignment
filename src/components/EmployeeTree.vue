<script setup>

import {create_graph_at_element_id} from "@/assets/tree.js";
import {onMounted} from "vue";

let props = defineProps({
    employees_json: {
        type: Object,
        required: true
    },
    graph_dom_id: {
        type: String,
        required: true
    }
})

onMounted(() => {
    create_graph_at_element_id("#" + props.graph_dom_id, props.employees_json);
})

</script>

<template>
  <div v-bind:id="props.graph_dom_id"></div>
</template>

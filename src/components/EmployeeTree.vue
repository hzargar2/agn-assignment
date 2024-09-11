<script setup>

import {create_graph_at_element_id} from "@/assets/tree.js";
import {onMounted} from "vue";

let props = defineProps({
    employees_json: {
        type: Object,
        required: true
    }
})

onMounted(() => {
    create_graph_at_element_id("#tree-graph", props.employees_json);
})

</script>

<template>
  <div id="tree-graph"></div>
</template>

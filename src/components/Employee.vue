<script setup>
import {onBeforeMount, onMounted, ref} from "vue";

let props = defineProps({
    employee: {
        type: Object,
        required: true
    }
})

let expanded = ref(false);
let background_color = ref('');
let background_text = ref('');

onBeforeMount(() => {
    if (props.employee.data["Department"].toLowerCase().includes("operations")){
        background_color.value = "bg-lime-50 group-hover:bg-lime-100";
        background_text.value = "bg-lime-200";
    }else if (props.employee.data["Department"].toLowerCase().includes("sales")) {
        background_color.value = "bg-emerald-50 group-hover:bg-emerald-100";
        background_text.value = "bg-emerald-200";
    }else if (props.employee.data["Department"].toLowerCase().includes("data analytics")) {
        background_color.value = "bg-teal-50 group-hover:bg-teal-100";
        background_text.value = "bg-teal-200";
    }
    else if (props.employee.data["Department"].toLowerCase().includes("customer support")) {
        background_color.value = "bg-cyan-50 group-hover:bg-cyan-100";
        background_text.value = "bg-cyan-200";
    }
    else if (props.employee.data["Department"].toLowerCase().includes("system")) {
        background_color.value = "bg-indigo-50 group-hover:bg-indigo-100";
        background_text.value = "bg-indigo-200";
    }
    else if (props.employee.data["Department"].toLowerCase().includes("project")) {
        background_color.value = "bg-purple-50 group-hover:bg-purple-100";
        background_text.value = "bg-purple-200";
    }
    else if (props.employee.data["Department"].toLowerCase().includes("human resources")) {
        background_color.value = "bg-rose-50 group-hover:bg-rose-100";
        background_text.value = "bg-rose-200";
    }
    else if (props.employee.data["Department"].toLowerCase().includes("software")) {
        background_color.value = "bg-amber-50 group-hover:bg-amber-100";
        background_text.value = "bg-amber-200";
    }
    else{
        background_color.value = "bg-stone-50 group-hover:bg-stone-100";
        background_text.value = "bg-stone-200";
    }
})

</script>

<template>

    <div :class="`w-60 h-80 m-auto justify-center flex flex-col p-4 gap-y-2 rounded-lg shadow-md group-hover:cursor-pointer ${background_color}`">
        <div class="flex flex-col gap-y-1 mt-0 m-auto">
            <span class="flex font-medium mx-auto text-lg">{{props.employee.data["Name"]}}</span>
            <span class="flex text-center mx-auto text-gray-600 text-lg">{{props.employee.data["Job Title"]}}</span>
        </div>

        <div class="flex flex-col gap-1 mb-0 m-auto text-sm">
            <!--                Calculate numeric values for styling inline-->
            <span :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto border-2 border-gray-800 border-opacity-60 ${background_text}`">{{props.employee.data["Department"]}}</span>
            <span :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">Level {{props.employee.data["level"]}}</span>
            <span v-if="props.employee.data['descendant_count'] > 0" :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">Management cost: ${{props.employee.data["management_cost"] > 1000000000 ? (Math.round((props.employee.data["management_cost"] + Number.EPSILON) / 1000000000 * 100) / 100) + "B" : props.employee.data["management_cost"] > 1000000 ? (Math.round((props.employee.data["management_cost"] + Number.EPSILON) / 1000000 * 100) / 100) + "M" : (Math.round((props.employee.data["management_cost"] / 1000 + Number.EPSILON) * 100) / 100) + "K"}}</span>
            <span :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">IC cost: ${{props.employee.data["ic_cost"] > 1000000000 ? (Math.round((props.employee.data["ic_cost"] + Number.EPSILON) / 1000000000 * 100) / 100) + "B" : props.employee.data["ic_cost"] > 1000000 ? (Math.round((props.employee.data["ic_cost"] + Number.EPSILON) / 1000000 * 100) / 100) + "M" : (Math.round((props.employee.data["ic_cost"] / 1000 + Number.EPSILON) * 100) / 100) + "K"}}</span>
            <span v-if="props.employee.data['descendant_count'] > 0" :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">Total cost: ${{props.employee.data["total_cost"] > 1000000000 ? (Math.round((props.employee.data["total_cost"] + Number.EPSILON) / 1000000000 * 100) / 100) + "B" :props.employee.data["total_cost"] > 1000000 ? (Math.round((props.employee.data["total_cost"] + Number.EPSILON) / 1000000 * 100) / 100) + "M" : (Math.round((props.employee.data["total_cost"] / 1000 + Number.EPSILON) * 100) / 100) + "K"}}</span>
            <span v-if="props.employee.data['descendant_count'] > 0" :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">Management cost ratio: {{Math.round((props.employee.data["management_cost_ratio"] + Number.EPSILON) * 100) / 100}}</span>
            <span :class="`flex flex-row px-2 py-0.5 gap-x-1 rounded-2xl m-auto ${background_text}`">
<!--                Need to store svg as file and import using html img attribute, rending an svg inside an svg in the d3 chart doesn't work since it is xml, d3.xml() might also work, use this method instead-->
                <img class="h-3 w-3 m-auto" src="@/assets/location_pin.svg" alt="location pin"/>
                <span class="flex text-center">{{props.employee.data["Location"]}}</span>
            </span>
        </div>
<!--        <div v-if="children.length > 0" class="bg-slate-700 rounded-3xl text-white w-fit px-2 py-0.5 m-auto">-->
<!--            <span class="text-center">{{children.length}}/{{props.employee.data["descendant_count"]}}</span>-->
<!--        </div>-->
    </div>


</template>
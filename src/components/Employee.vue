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
    if (props.employee["Department"].toLowerCase().includes("operations")){
        background_color.value = "bg-lime-50 hover:bg-lime-100";
        background_text.value = "bg-lime-200";
    }else if (props.employee["Department"].toLowerCase().includes("sales")) {
        background_color.value = "bg-emerald-50 hover:bg-emerald-100";
        background_text.value = "bg-emerald-200";
    }else if (props.employee["Department"].toLowerCase().includes("data analytics")) {
        background_color.value = "bg-teal-50 hover:bg-teal-100";
        background_text.value = "bg-teal-200";
    }
    else if (props.employee["Department"].toLowerCase().includes("customer support")) {
        background_color.value = "bg-cyan-50 hover:bg-cyan-100";
        background_text.value = "bg-cyan-200";
    }
    else if (props.employee["Department"].toLowerCase().includes("system")) {
        background_color.value = "bg-indigo-50 hover:bg-indigo-100";
        background_text.value = "bg-indigo-200";
    }
    else if (props.employee["Department"].toLowerCase().includes("project")) {
        background_color.value = "bg-purple-50 hover:bg-purple-100";
        background_text.value = "bg-purple-200";
    }
    else if (props.employee["Department"].toLowerCase().includes("human resources")) {
        background_color.value = "bg-rose-50 hover:bg-rose-100";
        background_text.value = "bg-rose-200";
    }
    else if (props.employee["Department"].toLowerCase().includes("software")) {
        background_color.value = "bg-amber-50 hover:bg-amber-100";
        background_text.value = "bg-amber-200";
    }
    else{
        background_color.value = "bg-stone-50 hover:bg-stone-100";
        background_text.value = "bg-stone-200";
    }
})

</script>

<template>

    <div :class="`flex flex-col w-60 h-80 p-4 gap-y-2 bg-white border border-gray-200 rounded-lg shadow hover:cursor-pointer ${background_color}`">

        <div class="flex flex-col gap-y-1 mt-0 m-auto">
            <span class="flex font-medium mx-auto">{{props.employee["Name"]}}</span>
            <span class="flex text-center mx-auto text-gray-600 {{background_text}}">{{props.employee["Job Title"]}}</span>
        </div>

        <div class="flex flex-col gap-1 mb-0 m-auto text-sm">
            <!--                Calculate numeric values for styling inline-->
            <span :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto border-2 border-gray-800 border-opacity-60 ${background_text}`">{{props.employee["Department"]}}</span>
            <span :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">Level {{props.employee["level"]}}</span>
            <span :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">Management cost: ${{ props.employee["management_cost"] > 1000000 ? (Math.round((props.employee["management_cost"] + Number.EPSILON)/1000000 * 100) / 100) + "M" : (Math.round((props.employee["management_cost"]/1000 + Number.EPSILON) * 100) / 100) + "K" }}</span>
            <span :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">IC cost: ${{ props.employee["ic_cost"] > 1000000 ? (Math.round((props.employee["ic_cost"] + Number.EPSILON)/1000000 * 100) / 100) + "M" : (Math.round((props.employee["ic_cost"]/1000 + Number.EPSILON) * 100) / 100) + "K" }}</span>
            <span :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">Total cost: ${{ props.employee["total_cost"] > 1000000 ? (Math.round((props.employee["total_cost"] + Number.EPSILON)/1000000 * 100) / 100) + "M" : (Math.round((props.employee["total_cost"]/1000 + Number.EPSILON) * 100) / 100) + "K" }}</span>
            <span :class="`flex text-center px-2 py-0.5 rounded-2xl m-auto ${background_text}`">Management cost ratio: {{Math.round((props.employee["management_cost_ratio"] + Number.EPSILON) * 100) / 100}}</span>
            <div :class="`flex flex-row px-2 py-0.5 gap-x-1 rounded-2xl m-auto ${background_text}`">
                <svg class="h-3 w-3 m-auto" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" fill="#000000"></path> </g></svg>
                <span class="flex text-center">{{props.employee["Location"]}}</span>
            </div>
        </div>
    </div>


</template>
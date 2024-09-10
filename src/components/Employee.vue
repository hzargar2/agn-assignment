<script setup>
import {onBeforeMount, onMounted, ref} from "vue";

let props = defineProps({
    employee: {
        type: Object,
        required: true
    },
    employees_with_children: {
        type: Object,
        required: true
    }
})

let expanded = ref(false);

let background_color = ref('');
let background_text = ref('');

onBeforeMount(() => {
    if (props.employee.current["Department"] === "Operations and Logistics"){
        background_color.value = "bg-[#32cd32] bg-opacity-20 hover:bg-opacity-35";
        background_text.value = "bg-green-300";
    }else{
        background_color.value = "bg-white hover:bg-gray-100";
        background_text.value = "bg-gray-200";
    }
})

</script>

<template>
    <div class="flex flex-col gap-y-16 justify-center m-auto">

        <div :class="`justify-center m-auto flex flex-col w-48 h-56 p-4 gap-y-1 bg-white border border-gray-200 rounded-lg shadow hover:cursor-pointer ${background_color}`" @click="expanded = !expanded">
            <span class="flex font-medium text-center mx-auto">{{props.employee.current["Name"]}}</span>
            <span class="flex text-center mx-auto text-gray-600 {{background_text}}">{{props.employee.current["Job Title"]}}</span>
            <div class="flex flex-row flex-wrap gap-1 justify-center text-sm">
                <span :class="`flex text-center px-1.5 rounded-2xl border-2 border-gray-800 border-opacity-60 ${background_text}`">{{props.employee.current["Department"]}}</span>
                <span :class="`flex text-center px-1.5 rounded-2xl border-2 ${background_text}`">Level {{props.employee.current["level"]}}</span>
                <div :class="`flex flex-row px-1.5 gap-x-1 rounded-2xl border-2 ${background_text}`">
                    <svg class="h-3 w-3 m-auto" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.37892 10.2236L8 16L12.6211 10.2236C13.5137 9.10788 14 7.72154 14 6.29266V6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6V6.29266C2 7.72154 2.4863 9.10788 3.37892 10.2236ZM8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4C6.89543 4 6 4.89543 6 6C6 7.10457 6.89543 8 8 8Z" fill="#000000"></path> </g></svg>
                    <span class="flex text-center">{{props.employee.current["Location"]}}</span>
                </div>
            </div>
        </div>

        <div v-if="expanded === true" class="justify-center m-auto flex flex-row gap-x-3 px-4">
            <div v-for="child in props.employee.children">
                <Employee :key="child['Employee Id']" :employee="employees_with_children[child['Employee Id']]" :employees_with_children="employees_with_children"/>
            </div>
        </div>

    </div>



</template>

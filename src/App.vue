<script setup>
import Employee from "@/components/Employee.vue";
import {onBeforeMount, ref} from "vue";

let employees = ref(null);
let attempted_to_load_file = ref(false);
let employees_with_children = {};

const calculate_descendant_count = (root_employee) => {

    let count = root_employee.children.length;

    for (const [key, child] of Object.entries(root_employee.children)){
        count = count + calculate_descendant_count(employees_with_children[child["Employee Id"]]);
    }

    root_employee.current["descendant_count"] = count;
    return count;
}

const calculate_management_cost = (root_employee) => {

    let salary_sum = 0;

    for (const [key, child] of Object.entries(root_employee.children)){
        salary_sum = salary_sum + child["Salary"] + calculate_management_cost(employees_with_children[child["Employee Id"]]);
    }

    root_employee.current["management_cost"] = salary_sum;
    return salary_sum;
}

const calculate_ic_cost = (root_employee) => {

    let salary_sum = 0;

    if (root_employee.children.length === 0){
        salary_sum = root_employee.current["Salary"]
    }

    for (const [key, child] of Object.entries(root_employee.children)){
        salary_sum = salary_sum + calculate_ic_cost(employees_with_children[child["Employee Id"]]);
    }

    root_employee.current["ic_cost"] = salary_sum;
    return salary_sum;
}

const calculate_total_cost = (root_employee) => {

    let salary_sum = root_employee.current["Salary"];

    for (const [key, child] of Object.entries(root_employee.children)){
        salary_sum = salary_sum + child["Salary"] + calculate_total_cost(employees_with_children[child["Employee Id"]]);
    }

    root_employee.current["total_cost"] = salary_sum;
    return salary_sum;
}

// assume this is ratio of ic salaries to manager salaries and not the ration of their counts. If counts, comment this and uncomment bottom instead.
const calculate_management_cost_ratio = (root_employee) => {

    for (const [key, child] of Object.entries(root_employee.children)){
        calculate_management_cost_ratio(employees_with_children[child["Employee Id"]]);
    }

    root_employee.current["management_cost_ratio"] = root_employee.current["ic_cost"]/root_employee.current["management_cost"];
}

// const calculate_management_cost_ratio = (root_employee) => {
//
//     let manager = 0;
//
//     if (root_employee.children.length > 0){
//         manager++;
//     }
//
//     let ic = 0;
//
//     if (root_employee.children.length === 0){
//         ic++;
//     }
//
//     for (const [key, child] of Object.entries(root_employee.children)){
//         let counts = calculate_management_cost_ratio(employees_with_children[child["Employee Id"]]);
//         manager = manager + counts[0];
//         ic = ic + counts[1];
//     }
//
//     root_employee.current["manager_count"] = manager;
//     root_employee.current["ic_count"] = ic;
//     root_employee.current["management_cost_ratio"] = ic/manager;
//     return [manager, ic];
// }







onBeforeMount(async () => {

    // get csv data from API
    let res = await fetch("http://localhost:3000/employees").then(async (res) => {
        return await res.json();
    }).catch((e) => {
        alert("Failed to load csv file.");
    });

    // get first 100 for now, optimize for large graph later
    employees.value = res.data.slice(0,100);
    attempted_to_load_file.value = true;

    // uses memoization to generate parent child relationships map in linear time
    for (const [key, employee] of Object.entries(employees.value)){

        // if employee doesn't exist in the new map add it to it with empty children
        if (employee["Employee Id"] !== null && !(employee["Employee Id"] in employees_with_children)){
            employee["Salary"] = Number(employee["Salary"].replace(/[^0-9.-]+/g,""));
            employees_with_children[employee["Employee Id"]] = {
                current: employee,
                children: []
            }
        }

        // if the manager of the current node exists add the current employee to the children of that manager
        if (employee["Manager"] !== null && employee["Manager"] in employees_with_children){
            employees_with_children[employee["Manager"]].children.push(employee);
        }
    }


    // uses DFS to calculate descendant count so does it in linear time
    calculate_descendant_count(employees_with_children[0]);
    calculate_management_cost(employees_with_children[0]);
    calculate_ic_cost(employees_with_children[0]);
    calculate_total_cost(employees_with_children[0]);
    calculate_management_cost_ratio(employees_with_children[0]);


    console.log(employees_with_children);


})

</script>

<template>
    <main>
        <div class="flex w-screen h-screen" v-if="attempted_to_load_file === true && employees_with_children == null">
            <span class="flex gap-y-4 flex-col w-fit h-fit m-auto text-center p-4 bg-red-500 bg-opacity-90 text-slate-100 rounded-xl">
                <span class="text-4xl">Failed to load CSV file</span>
                <span class="text-2xl">Go to http://localhost:3000/employees to see if there is a response.</span>
            </span>
        </div>

<!--        Add root element in chart-->
        <div class="flex min-h-screen" v-else-if="attempted_to_load_file === true && employees_with_children !== null">
            <div class="flex mt-32 m-auto w-fit h-fit">
                <Employee :key="employees_with_children[0]['Employee Id']" :employee="employees_with_children[0]" :all_employees="employees_with_children" />
            </div>
        </div>
    </main>
</template>
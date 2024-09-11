export const calculate_descendant_count = (root_employee, employees_with_children) => {

    let count = root_employee.children.length;

    for (const [key, child] of Object.entries(root_employee.children)){
        count = count + calculate_descendant_count(employees_with_children[child["Employee Id"]], employees_with_children);
    }

    root_employee.current["descendant_count"] = count;
    return count;
}

export const calculate_management_cost = (root_employee, employees_with_children) => {

    let salary_sum = 0;

    for (const [key, child] of Object.entries(root_employee.children)){
        salary_sum = salary_sum + child["Salary"] + calculate_management_cost(employees_with_children[child["Employee Id"]], employees_with_children);
    }

    root_employee.current["management_cost"] = salary_sum;
    return salary_sum;
}

export const calculate_ic_cost = (root_employee, employees_with_children) => {

    let salary_sum = 0;

    if (root_employee.children.length === 0){
        salary_sum = root_employee.current["Salary"]
    }

    for (const [key, child] of Object.entries(root_employee.children)){
        salary_sum = salary_sum + calculate_ic_cost(employees_with_children[child["Employee Id"]], employees_with_children);
    }

    root_employee.current["ic_cost"] = salary_sum;
    return salary_sum;
}

export const calculate_total_cost = (root_employee, employees_with_children) => {

    let salary_sum = root_employee.current["Salary"];

    for (const [key, child] of Object.entries(root_employee.children)){
        salary_sum = salary_sum + child["Salary"] + calculate_total_cost(employees_with_children[child["Employee Id"]], employees_with_children);
    }

    root_employee.current["total_cost"] = salary_sum;
    return salary_sum;
}

// assume this is ratio of ic salaries to manager salaries and not the ration of their counts. If counts, comment this and uncomment bottom instead.
export const calculate_management_cost_ratio = (root_employee, employees_with_children) => {

    for (const [key, child] of Object.entries(root_employee.children)){
        calculate_management_cost_ratio(employees_with_children[child["Employee Id"]], employees_with_children);
    }

    root_employee.current["management_cost_ratio"] = root_employee.current["ic_cost"]/root_employee.current["management_cost"];
}

// export const calculate_management_cost_ratio = (root_employee, employees_with_children) => {
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
//         let counts = calculate_management_cost_ratio(employees_with_children[child["Employee Id"]], employees_with_children);
//         manager = manager + counts[0];
//         ic = ic + counts[1];
//     }
//
//     root_employee.current["manager_count"] = manager;
//     root_employee.current["ic_count"] = ic;
//     root_employee.current["management_cost_ratio"] = ic/manager;
//     return [manager, ic];
// }

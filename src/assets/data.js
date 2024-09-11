
export const create_employee_and_children_map = (employees) => {

    let employees_with_children= {}

    // uses memoization to generate parent child relationships map in linear time
    for (const [key, employee] of Object.entries(employees)){

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

    return employees_with_children;

}
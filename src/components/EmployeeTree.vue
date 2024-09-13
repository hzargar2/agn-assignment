<script setup>

import {onMounted} from "vue";
import * as d3 from "d3";
import {createApp} from "vue";
import Employee from "@/components/Employee.vue";


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

    // Specify the charts’ dimensions. The height is variable, depending on the layout.
    const marginLeft = 10;
    const marginBottom = 10;
    const marginRight = 10;
    const marginTop = 40;
    const radius = 5.5;

    // Rows are separated by dx pixels, columns by dy pixels. These names can be counter-intuitive
    // (dx is a height, and dy a width). This because the tree must be viewed with the root at the
    // “bottom”, in the data domain. The width of a column is based on the tree’s height.
    const root = d3.stratify()
        .id((node) => node["Employee Id"])
        .parentId((node) => node["Manager"])
        (props.employees_json);

    // this is the size of each individual node
    const dx = 240;
    const dy = 340;

    // Define the tree layout and the shape for links.
    const tree = d3.tree().nodeSize([dx, dy])
        .separation(function(a, b) { return (a.parent == b.parent ? 1.1 : 1.5); });
    // create vertical paths from parents to children
    const diagonal = d3.linkVertical().y(node => node.y).x(node => node.x);

    // Create the SVG container, a layer for the links and a layer for the nodes. Set initialize size to the size of 1 node
    const svg = d3.select("#" + props.graph_dom_id)
        .append("svg")
        .attr("width", dx)
        .attr("height", dy)
        .classed("mt-20", true)
        .attr("viewBox", [0, 0, dx + marginLeft + marginRight, dy + marginTop + marginBottom])
        .attr("style", "min-width: 100%;");

    const gLink = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#555")
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 1.5);

    const gNode = svg.append("g")
        .attr("cursor", "pointer")
        .attr("pointer-events", "all");

    // Collapse the node and all it's children
    function collapse(node) {
        if (node.children) {
            node._children = node.children;
            node._children.forEach(collapse);
            node.children = null;
        }
    }

    // function diagonal(node, i) {
    //     return     "M" + (node.source.x) + "," + (node.source.y)
    //         + "V" + (((node.source.y + dy) + (node.target.y + dy))/7)
    //         + "H" + (node.target.x)
    //         + "V" + (node.target.y);
    // };


    function dragstarted(event, node) {
        d3.select(this).raise().attr("stroke", "black");
    }

    function dragged(event, node) {
        node.x = event.x;
        node.y = event.y;
        d3.select(this).attr("cx", (node) => node.x).attr("cy", (node) => node.y);
    }

    function dragended(event, node) {
        d3.select(this).attr("stroke", null);
    }

    let drag = d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);

    // run every time we want to update tree state
    function update(event, source) {

        const duration = 250; // hold the alt key to slow down the transition
        const nodes = root.descendants().reverse();
        const links = root.links();

        // Compute the new tree layout.
        tree(root);

        // Normalize for fixed-depth.
        nodes.forEach(function(node) {
            node.y = node.depth * 400;
        });

        // find the top most node, the bottom most node, the most right node, and the most left node
        let top = root;
        let bottom = root;
        let left = root;
        let right = root;
        root.eachBefore(node => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
            if (node.y < top.y) top = node;
            if (node.y > bottom.y) bottom = node;
        });

        // height is the difference between top most and bottom most nodes plus their added margins, essentially giving the height of our tree
        let height = bottom.y - top.y + dy;
        // height is the horizontal difference between right most and left most nodes plus their added margins, essentially giving the width of our tree
        let width = right.x - left.x + dx;

        console.log(bottom.y - top.y + dy)
        console.log(right.x, left.x, right.x - left.x)
        console.log(width)

        const transition = svg.transition()
            .duration(duration)
            .attr("width", d3.max([width, dx]))
            .attr("height",  d3.max([height, dy]))
            .attr("viewBox", [-d3.max([width, dx])/2, 0, d3.max([width, dx]), d3.max([height, dy])])
            .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

        // Update the nodes…
        const node = gNode.selectAll("g")
            .data(nodes, node => node.id);

        // Enter any new nodes at the parent's previous position.
        const nodeEnter = node.enter().append("g")
            .attr("transform", node => `translate(${source.x0},${source.y0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (event, node) => {
                node.children = node.children ? null : node._children;
                update(event, node);
            })
            .call(drag);

        // construct employee html using a foreignObject element and append it to the node since can;t append
        // div directly as a child of SVG element
        nodeEnter.html((node) => {
            let elm = document.createElement('foreignObject');
            elm.setAttribute("x", -120);
            elm.setAttribute("y", 0);
            elm.setAttribute("width", dx);
            elm.setAttribute("height", dy);

            createApp(Employee, {employee: node}).mount(elm);
            return elm.outerHTML;
        });

        // // sets the color of the node circle
        // nodeEnter.append("circle")
        //     .attr("r", 5.5)
        //     .attr("fill", node => node._children ? "#555" : "#999");

        // sets the text beside the nodes
        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", node => node._children ? -8 : 8)
            .attr("text-anchor", node => node._children ? "end" : "start")
            .text(node => node.data["Employee Id"]);

        // Transition nodes to their new position.
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", node => `translate(${node.x},${node.y})`)
            .attr("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        const nodeExit = node.exit().transition(transition).remove()
            .attr("transform", node => `translate(${source.x},${source.y})`)
            .attr("fill-opacity", 0);

        // Update the links…
        const link = gLink.selectAll("path")
            .data(links, node => node.target.id);

        // Enter any new links at the parent's previous position.
        const linkEnter = link.enter().append("path")
            .attr("d", node => {
                const o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition(transition).remove()
            .attr("d", node => {
                const o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            });

        // Stash the old positions for transition.
        root.eachBefore(node => {
            node.x0 = node.x;
            node.y0 = node.y;
        });
    }

    // Do the first update to the initial configuration of the tree — where a number of nodes
    // are open (arbitrarily selected as the root, plus nodes with 7 letters).
    root.y0 = dy / 2;
    root.x0 = 0;
    root.descendants().forEach((node, i) => {
        node.id = i;
        node._children = node.children;
        if (node.depth) node.children = null;
    });

    collapse(root)
    update(null, root);
})

</script>

<template>
  <div v-bind:id="props.graph_dom_id"></div>
</template>

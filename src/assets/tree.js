import * as d3 from "d3";

export const create_graph_at_element_id = (root_id, raw_json) => {

    // Set the dimensions and margins of the diagram
    let margin = {
            top: 170,
            right: 0,
            bottom: 0,
            left: 0,
        },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    let svg = d3
        .select(root_id)
        .append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let i = 0, duration = 300, root;

    // declares a tree layout and assigns the size
    let treemap = d3.tree().size([width, height]);

    root = d3.stratify()
        .id((d) => d["Employee Id"])
        .parentId((d) => d["Manager"])
        (raw_json);

    root.x0 = height / 2;
    root.y0 = 0;

    collapse(root);
    update(root);

    // Collapse the node and all it's children
    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    function update(source) {




        // compute the new height
        var levelWidth = [1];
        var childCount = function(level, n) {
            if(n.children && n.children.length > 0) {
                if(levelWidth.length <= level + 1) levelWidth.push(0);
                levelWidth[level+1] += n.children.length;
                n.children.forEach(function(d) {
                    childCount(level + 1, d);
                });
            }
        };

        childCount(0, root);

        let newHeight = d3.max(levelWidth) * 100; // 20 pixels per line
        let newWidth = d3.max(levelWidth) * 200; // 20 pixels per line

        treemap = treemap.size([newWidth, newHeight]);

        d3.select("svg").remove();//TO REMOVE THE ALREADY SVG CONTENTS AND RELOAD ON EVERY UPDATE

        svg = d3
            .select(root_id)
            .append("svg")
            .attr("width", newWidth + margin.right + margin.left)
            .attr("height", newHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");






        // Assigns the x and y position for the nodes
        treemap(root);

        // Compute the new tree layout.
        let nodes = root.descendants(),
            links = root.descendants().slice(1);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) {
            d.y = d.depth * 180;
        });

        // ****************** Nodes section ***************************

        // Update the nodes...
        let node = svg.selectAll("g.node").data(nodes, function(d) {
            return d.id || (d.id = ++i);
        });

        // Enter any new modes at the parent's previous position.
        let nodeEnter = node
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(e, d) {
                return "translate(" + source.x0 + "," + source.y0 + ")";
            })
            .on("click", click);

        // Add Circle for the nodes
        nodeEnter
            .append("circle")
            .attr("class", "node")
            .attr("r", 1e-6)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });

        // Add labels for the nodes
        nodeEnter
            .append("text")
            .attr("dy", ".35em")
            .attr("x", function(d) {
                return d.children || d._children ? -13 : 13;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) {
                return d.data["Employee Id"];
            });

        // UPDATE
        let nodeUpdate = nodeEnter.merge(node);

        // Transition to the proper position for the node
        nodeUpdate
            .transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        // Update the node attributes and style
        nodeUpdate
            .select("circle.node")
            .attr("r", 10)
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            })
            .attr("cursor", "pointer");

        // Remove any exiting nodes
        let nodeExit = node
            .exit()
            .transition()
            .duration(duration)
            .attr("transform", function(d) {
                return "translate(" + source.x + "," + source.y + ")";
            })
            .remove();

        // On exit reduce the node circles size to 0
        nodeExit.select("circle").attr("r", 1e-6);

        // On exit reduce the opacity of text labels
        nodeExit.select("text").style("fill-opacity", 1e-6);

        // ****************** links section ***************************

        // Update the links...
        let link = svg.selectAll("path.link").data(links, function(d) {
            return d.id;
        });

        // Enter any new links at the parent's previous position.
        let linkEnter = link
            .enter()
            .insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                let o = {
                    x: source.x0,
                    y: source.y0,
                };
                return diagonal(o, o);
            });

        // UPDATE
        let linkUpdate = linkEnter.merge(link);

        // Transition back to the parent element position
        linkUpdate
            .transition()
            .duration(duration)
            .attr("d", function(d) {
                return diagonal(d, d.parent);
            });

        // Remove any exiting links
        let linkExit = link
            .exit()
            .transition()
            .duration(duration)
            .attr("d", function(d) {
                let o = {
                    x: source.x,
                    y: source.y,
                };
                return diagonal(o, o);
            })
            .remove();

        // Store the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
            let path = `M ${s.x} ${s.y}
    C ${(s.x + d.x) / 2} ${s.y},
      ${(s.x + d.x) / 2} ${d.y},
      ${d.x} ${d.y}`;

            return path;
        }

        // Toggle children on click.
        function click(e, d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }
    }

}
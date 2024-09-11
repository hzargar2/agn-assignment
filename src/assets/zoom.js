export const zoom = (zoom, zoom_step, zoom_in_button_id, zoom_out_button_id, id_of_element_to_zoom) => {

    document.getElementById(zoom_in_button_id).addEventListener("click", function() {
        zoom += zoom_step;
        document.getElementById(id_of_element_to_zoom).style.transform = "scale(" + zoom + ")";
    });
    document.getElementById(zoom_out_button_id).addEventListener("click", function() {
        if (zoom > zoom_step) {
            zoom -= zoom_step;
            document.getElementById(id_of_element_to_zoom).style.transform = "scale(" + zoom + ")";
        }
    });
}
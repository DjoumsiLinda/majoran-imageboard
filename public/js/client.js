import * as Vue from "./vue.js";
import { getImageComponent } from "./getImageComponent.js";
import { addImageComponent } from "./addImageComponent.js";

Vue.createApp({
    data() {
        return { images: [] };
    },
    methods: {
        handleimage(data) {
            this.images = data;
        },
        addnewimage(data) {
            this.images.unshift(data);
        },
    },
    components: {
        "get-image-component": getImageComponent,
        "add-image-component": addImageComponent,
    },
}).mount("#server");

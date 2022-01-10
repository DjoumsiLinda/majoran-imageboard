import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
            file: true,
            title: "",
            description: "",
            username: "",
            fileU: "",
        };
    },
    mounted() {
        fetch("/images")
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                this.images = data;
            });
    },
    methods: {
        addImage(e) {
            // prevents the browser from doing the default GET / POST request
            e.preventDefault();
            console.log(this.title, this.username);
        },
    },
}).mount("#server");

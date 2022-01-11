import * as Vue from "./vue.js";

Vue.createApp({
    data() {
        return {
            images: [],
            title: "",
            description: "",
            username: "",
            file: "",
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
            if (this.title && this.username && this.file) {
                // we need to work with FormData,
                // because we want to POST a file: also on doit envoyer le file au server et il doit ajourte a la db
                // Content-type: multipart/form-data
                const formData = new FormData();
                formData.append("username", this.username);
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("file", this.file);

                fetch("/images", { method: "POST", body: formData })
                    .then((res) => {
                        console.log(res.status, res.ok);
                        return res.json();
                    })
                    .then((data) => {
                        console.log("new image", data);
                        this.images.push(data);
                    });
            }
        },
        addFile(e) {
            // prevents the browser from doing the default GET / POST request
            e.preventDefault();
            this.file = e.target.files[0];
        },
        clickImage(e) {
            // prevents the browser from doing the default GET / POST request
            e.preventDefault();
            console.log("click Image");
        },
    },
}).mount("#server");

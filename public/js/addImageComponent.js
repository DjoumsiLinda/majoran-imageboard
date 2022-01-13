export const addImageComponent = {
    template: `
    <div class="herun">
         <h1>Add an Image Now!</h1>
         <form @submit.prevent="addImage">
                <div id="fiel">
                    <label>Tilte </label>
                    <input type="text" name="title" v-model="title" >    
                </div>
                <div id="fiel">
                    <label>Decription </label>
                    <input type="text" name="description" v-model="description">    
                </div>
                <div id="fiel">
                    <label>Username </label>
                    <input type="text" name="username" v-model="username">    
                </div>    
                <div id="field">
                    <label>File </label>
                    <input type="file" accept="image/*" name="Choose" @change="addFile">
                </div>
                <button type="submit" id="upload">Upload</button> 
        </form>
    </div>
    `,
    data() {
        return {
            title: "",
            description: "",
            username: "",
            file: "",
        };
    },
    methods: {
        addImage(e) {
            e.preventDefault();
            if (this.title && this.username && this.file) {
                const formData = new FormData();
                formData.append("username", this.username);
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("file", this.file);

                fetch("/images", { method: "POST", body: formData })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        this.$emit("addnewimage", data);
                    });
            }
        },
        addFile(e) {
            e.preventDefault();
            this.file = e.target.files[0];
        },
    },
};

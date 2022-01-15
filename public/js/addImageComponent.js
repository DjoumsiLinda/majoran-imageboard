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
                     <div id="errorFile"> 
                     <p v-if="notboth"> You cannot download and add Link at the same time. Choose one!</p>
                     <p v-if="notempty"> not empty!</p>
                     <p v-if="urlfehler"> The given url is not correct please try again!</p>
                     </div>
                    <label>Download the image </label>
                    <input type="file" accept="image/*" name="Choose" @change="addFile"> or give the link <input type="url" name="url" v-model="url">   
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
            url: "",
            notboth: false,
            notempty: false,
            urlfehler: false,
        };
    },
    methods: {
        addImage(e) {
            e.preventDefault();
            if (this.title && this.username) {
                if (this.url && this.file) {
                    this.leerVariable();
                    this.notboth = true;
                    return;
                } else if (!this.url && !this.file) {
                    this.leerVariable();
                    this.notempty = true;
                    return;
                }
                if (
                    !this.url.toLowerCase().endsWith("jpe") &&
                    !this.url.toLowerCase().endsWith("jpg") &&
                    !this.file
                ) {
                    this.leerVariable();
                    this.urlfehler = true;
                    return;
                }
                const formData = new FormData();
                formData.append("username", this.username);
                formData.append("title", this.title);
                formData.append("description", this.description);
                if (this.url) {
                    formData.append("url", this.url);
                    fetch("/images/url", { method: "POST", body: formData })
                        .then((res) => {
                            return res.json();
                        })
                        .then((data) => {
                            if ("status" in data) {
                                if (!this.url) {
                                    this.urlfehler = true;
                                }
                            } else {
                                this.$emit("addnewimage", data);
                                this.leerVariable();
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else if (this.file) {
                    formData.append("file", this.file);
                    fetch("/images/file", { method: "POST", body: formData })
                        .then((res) => {
                            return res.json();
                        })
                        .then((data) => {
                            if ("status" in data) {
                                if (!this.url) {
                                    this.urlfehler = true;
                                }
                            } else {
                                this.$emit("addnewimage", data);
                                this.leerVariable();
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
            }
        },
        addFile(e) {
            e.preventDefault();
            this.file = e.target.files[0];
        },
        leerVariable() {
            this.title = "";
            this.description = "";
            this.username = "";
            this.file = "";
            this.url = "";
            this.notboth = false;
            this.notempty = false;
            this.urlfehler = false;
        },
    },
};

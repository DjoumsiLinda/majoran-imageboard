export const moreCommentsComponent = {
    props: ["id", "selectedcomment", "selectedUsername", "selectedDatum"],
    template: `
        <head>
            <meta charset="utf-8">
            <link rel="stylesheet" href="/css/moreCommentStyle.css">
        </head>
        <div class="moreComment">
            <div id="getComment">
                <div id="addComments"> 
                    <p>{{selectedUsername}} has wrote "{{selectedcomment}}" on {{new Date(selectedDatum).getDate()}}/{{(new Date(selectedDatum).getMonth() + 1).toString().padStart(2, "0")}}/{{new Date(selectedDatum).getFullYear()}} 
                    at {{new Date(selectedDatum).getHours()}}:{{new Date(selectedDatum).getMinutes().toString().padStart(2, "0")}} </p>
                    <div id="allmoreComments">
                        <li v-for="allcomment in allComments">
                            {{allcomment.username}}: "{{allcomment.comment}}" on {{new Date(allcomment.created_at).getDate()}}/{{(new Date(allcomment.created_at).getMonth() + 1).toString().padStart(2, "0")}}/{{new Date(allcomment.created_at).getFullYear()}} 
                            at {{new Date(allcomment.created_at).getHours()}}:{{new Date(allcomment.created_at).getMinutes().toString().padStart(2, "0")}}
                        </li>
                    </div>
                    <div id="inputMoreComment">
                        <textarea id="more" type="text" name="moreComments" v-model="moreComments" placeholder="add you comments" rows="30" cols="50"> </textarea>
                        <input id="name" type="text" name="username" v-model="username" placeholder="username"> 
                        <button type="submit" id="upload" @click="addMoreComment">Add</button>
                    </div> 
                </div>
                <div id="morecommentbtx"> 
                    <button  @click="handleClick">Close</button>
                </div>
            </div>
        </div>
       
    `,
    data() {
        return { allComments: [], moreComments: "", username: "", tosend: [] };
    },
    mounted() {
        //pour get le commentaire
        const path2 = "/morecomments/" + this.id;
        fetch(path2)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (data) {
                    //a envoyer au parent
                    this.allComments = data;
                }
            });
    },
    methods: {
        addMoreComment() {
            console.log(this.moreComments);
            //fetch pour ajouter le nveau commentaire a la db
            let newComment = {
                comment: this.moreComments,
                username: this.username,
                comment_id: this.id,
            };
            fetch("/morecomment", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(newComment),
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log(data[0]);
                    this.allComments.push(data[0]);
                    this.tosend.push(data[0]);
                    this.moreComments = "";
                    this.username = "";
                });
        },
        handleClick() {
            this.$emit("close", this.tosend);
            //alert("a new comment has been added, refresh the browser");
        },
    },
};

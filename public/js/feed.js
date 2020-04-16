let feed_section = document.querySelector("main")

/* Adds Post to News Feed */
function createPost(postTitle,imgUrl=null,postData){
    let div = document.createElement('div');
    div.className = "post "

    let h3 = document.createElement('h3');
    h3.textContent = postTitle

    div.appendChild(h3)

    if(imgUrl){
        let img = document.createElement('img')
        img.className = "post-image"
        img.src = imgUrl

        div.appendChild(img)
    }

    let p = document.createElement('p')
    p.className = "post-data"
    p.textContent = postData
    div.appendChild(p)

    let a = document.createElement('a')
    a.className = "read-more"
    a.textContent = "Read More about this ..."
    div.appendChild(a)

    feed_section.appendChild(div)

    setTimeout(()=>{
        div.classList.add("animate")
    },100)
    

    
}

function getPosts(category = "all"){
    fetch("/getPosts").then((response)=>{
        posts = response.json()
        .then((posts)=>{
            for(post of posts){
                if(post.imgurl == "none"){
                    post.imgurl = null;
                }

                if(post.category == category || category == "all")
                createPost(post.title,post.imgurl,post.data)
            }
        })
    })
}

getPosts("all");
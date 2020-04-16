if(localStorage.getItem('notifications') == "true"){
    console.log("inside")
    document.querySelector('#notification-btn').classList.replace('false','true')
}

let uploadScreenShowing = false;
let drawer_menu = document.querySelector(".drawer-icon")
let drawer = document.querySelector(".drawer")
let news_feed = document.querySelector("main")
let close_drawer_btn = document.querySelector(".close-drawer")
let drawer_btns = document.querySelector("ul")
let header_nav = document.querySelector("nav")
let upload_section = document.querySelector(".upload-screen")
let upload_section_btns = document.querySelector(".upload-screen-btns")

upload_section_btns.addEventListener('click',(e)=>{
    handleUploadScreen(e)
})


header_nav.addEventListener('click',(e)=>{
    e.preventDefault()
    filterNews(e)
})

/* Drawer Btns Controller */
drawer_btns.addEventListener('click',(e)=>{
    e.preventDefault()
    drawerBtnController(e)
})

drawer_menu.addEventListener('click',(e)=>{
    drawerController();
})

close_drawer_btn.addEventListener('click',(e)=>{
    drawerController()
})


function clear_news_feed(){
    news_feed.innerHTML = ""
}

function filterNews(e){
   
    let target = e.target.innerText;
    let category = target.toLowerCase()

   let nav_elements = new Array(header_nav.children)
   

   for(let i = 0 ; i<nav_elements[0].length ;i++){

       if(nav_elements[0][i].innerText != target){
        nav_elements[0][i].className = ""
       }
       else if(nav_elements[0][i].innerText == target){
        nav_elements[0][i].className = "active"
       }
   }

   e.target.className = "active"

   clear_news_feed()

   if(category == "trending")
   getPosts(category="all")
   else 
   getPosts(category)
}

function drawerController(){

    
    drawer_menu.classList.toggle('icon-close')
    drawer.classList.toggle('open')
    news_feed.classList.toggle('hide-main');
   
    if(uploadScreenShowing && drawer.classList.contains('open')){
        upload_section.classList.remove("upload-screen-show")
    }

    else if(uploadScreenShowing && !drawer.classList.contains('open')){
        upload_section.classList.add("upload-screen-show")
    }
    
}

function askUserPermissionForNotifications(notifybtn){
    Notification.requestPermission((result)=>{
        console.log("User Choice",result)
        if(result !=="granted")
        console.log("No Permission Granted")
        else {
            if('serviceWorker' in navigator){
                let reg
                navigator.serviceWorker.ready
                .then((swreg)=>{
                    reg = swreg
                    return
                    return swreg.pushManager.getSubscription()
                }).then((subscription)=> {
                    if(subscription === null){
                        // No Existing Subscription, create one
                        reg.pushManager.subscribe({
                            userVisibleOnly: true
                        }).then((newsub)=>{
                            fetch('/addSubscriber',{
                                method:"POST",
                                headers:{
                                   'Content-Type':'application/json',
                                   'Accept':'application/json' 
                                },
                                body: JSON.stringify(newsub)
                            })
                        })
                        .then((response)=>{
                            if(response.ok){
                                swreg.showNotification("Successfully Subscribed SW",{body:"Wolla ! youre subscribed !"})
                            }
                        }).catch((err)=>{
                            console.log(err)
                        })
                    }

                    else {
                        // Exisitng a Subscription
                    }
                })
            }
            notifybtn.classList.toggle('true')
            localStorage.setItem('notifications',true);
        }
    })
}

function show_upload(){
    drawer.classList.remove("open");
    news_feed.classList.add("hide-main-upload-screen")
    uploadScreenShowing = true;
    drawer_menu.classList.remove("icon-close")
    upload_section.classList.add('screen-show')
    setTimeout(()=>{
        upload_section.classList.add("upload-screen-show")
        upload_section.classList.remove('screen-show')
    },700)

}

function handleUploadScreen(e){
    switch(e.target.innerText){
        case "CANCEL": upload_section.classList.remove('upload-screen-show');
        uploadScreenShowing = false;
        setTimeout(()=>{
            news_feed.classList.remove("hide-main-upload-screen")
            news_feed.classList.remove("hide-main")
            upload_section.classList.remove("upload-screen-show")
        },500)
        
    }
}




function drawerBtnController(e){
   
 
    switch(e.target.innerText){
        case "NOTIFY" :askUserPermissionForNotifications(e.target.parentNode);
        break;

        case "UPLOAD NEWS":show_upload();
        break;

        case "WORLD":drawerController();
        filterNews(e);
        break;

        case "NATIONAL":drawerController();
        filterNews(e);
        break;

        case "KASHMIR":drawerController();
        filterNews(e);
        break;

        case "TRENDING":drawerController();
        filterNews(e);
        break
    }
}


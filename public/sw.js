currentStaticCache = "snf-static-v3";
currentDynamicCache = "snf-dynamic-v2"

self.addEventListener('install',function(event){
    console.log("Service Worker Installed ",event)
   /*Pre Caching Static Content */

   event.waitUntil(
       caches.open(currentStaticCache).then(function(cache){
           return cache.addAll([
                '/',
                '/index.html',
                '/js/app.js',
                '/js/feed.js',
                '/css/style.css',
                '/manifest.json'
            ])
       }).catch(function(error){
           console.log(error)
       })
   )

})

self.addEventListener("activate", (event)=>{
    console.log("Service Worker Activating ",event)
    /* Remove Previous Caches */
    event.waitUntil(
        caches.keys()
        .then((keylist)=>{
            return Promise.all(
                keylist.map((key)=>{
                    if(key!== currentStaticCache && key!== currentDynamicCache ){
                        return caches.delete(key)
                    }
                })
            )
        })
    )

   return self.clients.claim()
})

self.addEventListener('fetch', (event)=>{
/* Handle Caching Strategy for POSTS */
    if(event.request.url.includes("/getPosts")){
        return event.respondWith(
             fetch(event.request).then((response)=>{
             return caches.open('news-feed').then((cache)=>{
                    cache.put(event.request,response.clone())
                    return response;
                })
               
            }).catch( (err)=>{
                return caches.match(event.request).then((response)=>{
                    if(response)
                    return response;
                })
            })

        )
    }

    else 

    {
        event.respondWith(
            caches.match(event.request).then((response)=>{
                if(response)
                return response
      
              /* Dynamic Cache in Place */
              else {
              return  fetch(event.request).then((response)=>{
                  caches.open(currentDynamicCache).then((cache)=>{
                      cache.put(event.request,response.clone())
                      return response
                  })
              })
              .catch((err)=>{
                  
              })
          }
            })
        )
    }

  
})


/* Trim Dynamic Cache */
function trimDynamicCache (cacheName , maxlimit){
    caches.open(cacheName).then((cache)=>{
        return cache.keys()
        .then((keys)=>{
        if(keys.length > maxlimit){
            cache.delete(keys[0])
            .then(trimDynamicCache(cacheName,maxlimit))
        }
        })
    })
}

/* Send Notification to User */

function diplayNotification(){
    if(navigator.serviceWorker){
        let options = {
            body : " Text to send",
            icon : "/images/icons/app-icon-96x96.png",
            image: "/images/app/01.png",
            vibrate : [100,50,200],
            badge : "/images/app/01.png",
            actions : [
                {action: "confirm", title:"Read News"},
                {action: "cancel", title:"Read Later"}
            ]
        }

        new Notification("text",options)
    }
}

/* Notification Handling User Interaction */

self.addEventListener('notificationclick',(event)=>{

})
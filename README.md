After Cloning

npm i
bower install
gulp dev (deprecated gulp js on 18/11) 

import DB from /db into mongo

admin account: appadmin@yopmail.com pw: admin


Bitnami: R5cIZXzaVRqc


ssh -i ~/.ssh/overtable.pem ubuntu@ec2-34-211-44-34.us-west-2.compute.amazonaws.com



cd apps/techdev

sudo forever start app.js
sudo forever stopall





db:
      user: "dbadmin",
      pwd: "secoelpinto",
      

db.createUser({
        user: "dbadminapp",
        pwd: "secoelpinto",
        roles:[
                {
                        "role" : "readWrite",
                        "db": "meanapp"
                }
        ]
})




Change base_url/port in  server / config / config.js (URL_DOMAIN) (as needed)
 
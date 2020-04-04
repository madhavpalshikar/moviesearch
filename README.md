#Movie Search App
-------------------

##Run:
    npm start

##Tests:
    npm run test


##Run With Docker Container:
---------------------------------------------
##Build:
    docker build -t search-app:latest .

##Start Container:
    docker run -d -p 3000:3000 search-app:latest
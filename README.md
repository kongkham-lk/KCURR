# KCURR
- currency web application

## Links:
- https://kcurr.onrender.com/

## Pre-Conditions/Setup for running KCURR on the local machine for the first time:
1. node.js and npm are required to be installed on the PC for frontend:
    - Run “node --v" to check and to install run “brew install node”.
    - Run "npm --v" to check and to install run “npm install” (to install all the node modules dependencies)
2. For the backend, require dotNET (ASP.NET):
    - run “dotnet --version” to check

## Start running project on local machine:
1. Navigate to the frontend window, and run "npm start”.
2. Navigate to the backend app, Visual Studio IDE:
    - run with normal dotnet command:
        a. right click on "backend" project, click "Set as Startup Project".
        b. compile code which will run "dotnet run".
    - run with docker:
        a. right click on "docker-compose" project, click "Set as Startup Project".
        b. compile code, this will do 2 things:
            - build docker file, which run command "docker build -t kcurr-backend .”
            - execute code, which run “docker run -p 5268:80 kcurr-backend” (5268:80 is what we specify in docker-compose.override.yml)
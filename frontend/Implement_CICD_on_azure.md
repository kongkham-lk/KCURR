## Instruction On Implement CI/CD Pipeline On Azure

# Set Up Component:
    1. Resource Group: Grouping deploy components
    2. App Service plan:
        - Resource Group -> the same name as the "Resource Group", point 1
        - Operating System -> window
    3. App Service -> Web App:
        - Resource Group -> the same name as the "Resource Group", point 1
        - Web App Name -> set proper the website name
        - Publish -> code
        - Runtime stack -> need to match with the actual codebase -> .NET 7.0
        - Operating System -> window

# Modify Component Setting:
    1. App Service (look at the Left bar):
        a. Setting -> Config:
            - .NET version -> set target .Net version that match with the actual codebase
            - SCM Basic Auth Publishing -> On
            - FTP Basic Auth Publishing -> On
            - Web sockets -> Off
            - Session affinity -> On
        b. Deployment -> Deployment Center:
            - link "Github"
            - Authentication type -> Basic Authentication
        c. Deployment -> Deployment Slots:
            - upgrade subscription plan -> standart plan
        d. Setting -> Environment variables -> add all the APIs key
    2. Update yml of backend code -> update the correct working-path

# Credit: 
    - https://dev.to/abidemi/how-to-deploy-a-web-app-with-cicd-pipeline-on-azure-app-service-1j3p  
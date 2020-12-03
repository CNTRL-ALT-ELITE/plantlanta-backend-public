Release Notes (Version 1.0)

    Home Page
    Volunteer and Events sign up
    Donating
    Merchandise Shop


    Admin side to oversee app content and view new orders and donations accessible on {url}/admin route and entering password (default password is 12345678). 

    Bugs:
    If max inventory for a shop item is added to cart and ordered then the website will produce an error. 


    Future Features:
    Auto-updating shop item quantities
    Integrate Podcasts in web app
    Plantlanta Drive Content
    Basement x PlantLanta



Install Guide 

    If hosting the website online:

    Create a Stripe account to handle payments
    Create a Shipeo account to handle shipping cost. Shipeo also validates user addresses and generates prepaid shipping labels. 
    Create an Amazon S3 account to handle image uploads for events and shop items. 
    Create an Amazon SES account for emailing order confirmations. Update the email address in the code. 
    Create a MongoDB account required to access backend information
    Need to host website online (buy a domain name and pay for hosting services)
    Through AWS access the environment variables and input your API keys.


    If you want to run the web app locally:

    Install Node JS
    Create accounts for all the various API and backend management tools mentioned 
    Clone repository from github
    Replace API keys in the backend
    To run the web app go to the command line on your machine:
    Load the Plantlanta website backend by typing “cd {file location}” & “cd plantlanta-backend” & “nmp install” & “nmp start”
    Access the Plantlanta website frontend by typing “cd {file location}” & “cd plantlanta-frontend” & “yarn install” & “yarn start”
    Web app will run on a Google Chrome tab
    Create a .env file and put in the following variables from the various 3rd party accounts / Api keys created: 

      SHIPPO_API_KEY = ____,
      STRIPE_API_KEY = ____,
      AMAZON_ACCESS_KEY_ID = ____
      AMAZON_SECRET_ACCESS_KEY = _____
      MONGODB_URL = _______
 

    Dependant Libraries:

    third party npm libraries 

    Troubleshooting:
    Application will not run properly if the frontend is installed and started without running the backend. Make sure to install and start the backend first and then the frontend


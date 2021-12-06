# **SkyHome Backend**

This REST API is for the backend of the local cloud platform "SkyHome". You can use it to install the logic of the web to generates users, create and upload directories/files and more.

## **Installation**

To install SkyHome Backend clone the repo in your local machine

```bash
git clone https://github.com/MrKrrot/skyhome-backend.git
```

Now install the dependencies using `yarn` package manager

```bash
yarn install
```

Once the dependencies are installed create an `.env` file in root directory. In this file you will create the environment variables that needs the backend to work.
These are the names of the variables and what do you need to put in the values:

| Name              | Type   | Description                                            |
| ----------------- | ------ | ------------------------------------------------------ |
| PORT              | number | The port that the server will be listening             |
| STORAGE_PATH      | string | Path which storage all the data from all the users     |
| SECRET_TOKEN      | string | The secret keyword to generate and decode user's token |
| MONGO_DB_URI      | string | Link of the MongoDB database                           |
| MONGO_DB_URI_TEST | string | Link of the MongoDB database for testing               |

## **URL**

`http://localhost:5000/v1`

## **Endpoints**

-   /login
    -   POST
-   /register
    -   POST
-   /folders
    -   POST
    -   PUT
    -   DEL
-   /files
    -   POST
    -   PUT
    -   DEL
-   /users:
    -   DEL
    -   PUT
-   /fm
    -   GET

# ay2324s1-course-assessment-g47 
ay2324s1-course-assessment-g47 created by GitHub Classroom

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/6BOvYMwN)
# Assignment instructions
## Assignment 1:
**Setup:** Run `start index.html` in IDE terminal
<br > <sub>**Note**: Since the question data is stored using local storage, no questions will be shown on initial start up, you will need to add some questions manually first. </sub>   


## Assignment 2:
**Setup:**
Steps to run:
1. ensure you have a .env file in the backend folder
2. `npm run install-all` in main directory
3. `npm run create-db` in main directory
4. `npm run dev` in main directory

Sample of .env file in the backend folder:   
DB_USER=postgres   
DB_HOST=localhost   
DB_PASSWORD=`YOUR_POSTGRES_PASSWORD`   
DB_PORT=`YOUR_POSTGRES_PORT->5432`   
DB_DATABASE=cs3219_g47   
POSTGRESQLPORT=4001   
PORT=4000   
MONGO_URI = mongodb+srv://default:1234@g47-assignment-cluster.6vxd6vb.mongodb.net/?retryWrites=true&w=majority

## Assignment 3:
**Setup:**
Steps to run:
1. ensure you have a .env file in the backend folder
2. `npm run install-all` in main directory
3. `npm run create-db` in main directory
4. `npm run dev` in main directory

Sample of .env file in the backend folder:   
DB_USER=postgres   
DB_HOST=localhost   
DB_PASSWORD=`YOUR_POSTGRES_PASSWORD`   
DB_PORT=`YOUR_POSTGRES_PORT->5432`   
DB_DATABASE=cs3219_g47   
POSTGRESQLPORT=4001   
PORT=4000   
MONGO_URI = mongodb+srv://default:1234@g47-assignment-cluster.6vxd6vb.mongodb.net/?retryWrites=true&w=majority
ACCESS_TOKEN_SECRET =`YOUR_ACCESS_TOKEN_SECRET`
AUTH_EMAIL=cs3219OTPsender@hotmail.com
AUTH_PASS=cs3219grp47 
<br > <sub>**Note**: `YOUR_ACCESS_TOKEN_SECRET` can be a random string </sub> 

## Setting up PostgreSQL Permissions

If you are not using the default PostgreSQL user (`postgres`) for your database operations, follow these steps to grant necessary permissions:

1. Open your terminal and enter the PostgreSQL command-line interface:

    ```bash
    psql -U postgres
    ```

2. Once you're in the PostgreSQL CLI, run the following command to grant superuser privileges to your user:

    ```sql
    ALTER USER your_username WITH SUPERUSER;
    ```

   Replace `your_username` with the actual username you're using for your PostgreSQL database.

These steps ensure that your user has the required permissions to perform CRUD (Create, Read, Update, Delete) operations in PostgreSQL.

Make sure to execute these commands with caution, especially when granting superuser privileges.

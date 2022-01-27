# Musive-Backend

In Order to run Musive app you need to follow few steps.

### Tools we need.

- Heroku account and Cli installed in the machine
- git installed.
- PostgreSQL(psql command line).

We can easily upload it to Heroku

- first clone this repo. to your local machine.
- delete .git folder.
- now initiate git repository with the following commands.
- `git init`

- `git add .`

- `git commit -m "first commit"`

- `heroku login` login with your Heroku account.
- `heroku create` create a new web application in your account.
- `git push heroku master` run this command to push code to your application for the build.
- now go to <a>https://www.heroku.com/postgres</a>
- Click on 'CHOOSE A PLAN"
- again click on "install Heroku Postgres"
- now choose the web app that you created with `heroku create` command and submit your order.
- it will redirect you to the Heroku Postgres console now go to settings and view credentials.
- copy `songs.sql` file from the root of the musive Api directory and paste it into your "C" drive
- open up a psql command tool and enter your credentials.
- run `\i 'C:/songs.sql'` and your backend will be created.
- test your backend with your URL.

you can test API here [documention of api](https://documenter.getpostman.com/view/15632620/UVeAuowo)

note: change `http:localhost:4444/` to your own URL.

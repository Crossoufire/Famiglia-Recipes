# Famiglia-Recipes
 
Famiglia-Recipes is a small platform designed for families to add, share, and discover cherished recipes. With a simple and intuitive interface, Famiglia-Recipes helps you manage your family's culinary treasures in one place.

## Key Features

- Add and manage family recipes with steps, ingredients, and images.
- Adjust ingredient quantities dynamically based on the number of servings.
- Add comments to recipes for feedback and tips.
- Organize recipes with labels like Oven, Casserole, Red Meat, Fish, Vegetarian, etc.
- Browse and discover new recipes shared by your family members.
- Secure user account creation and connexion using a special register key, to disallow connection from non-members.


## Backend Installation (Python - Flask)

### Prerequisites
- Python 3.9+

### Steps
- Install python and create a virtual environment
```
pip install virtualenv
python -m venv venv-recipes
```


- Clone this repo and install the requirements
```
git clone https://www.github.com/crossoufire/Famiglia-Recipes.git
cd Famiglia-Recipes/backend
pip install -r requirements.txt
```

- Set up the `.flaskenv` file
```
FLASK_APP=server.py
FLASK_ENV=< development | production >
```

- Create a `.env` file
```
SECRET_KEY=<change-me>
REGISTER_KEY=<create-a-register-phrase>

MAIL_SERVER=<your-mail-server>
MAIL_PORT=<port>
MAIL_USE_TLS=< True | False >
MAIL_USE_SSL=< True | False >
MAIL_USERNAME=<mail@mail.com>
MAIL_PASSWORD=<password>
```

- Run the command `flask run` inside the `Famiglia-Recipes/backend` folder. 
- The backend will be served by default at `http://localhost:5000`.

## Frontend Installation (Node - React)


### Prerequisites
- Node.js > 19.0
- npm > 9.0

### Steps
- Clone this repo and install the requirements
```
git clone https://www.github.com/crossoufire/Famiglia-Recipes.git
cd Famiglia-Recipes/frontend
npm install
```

- Create the `.env.development` file for development (`.env.production` for production)
```
VITE_BASE_API_URL=http://localhost:5000
VITE_RESET_PASSWORD_CALLBACK=http://localhost:3000/reset_password
```

- Run the command `npm run start` inside the `Famiglia-Recipes/frontend` folder. 
- The frontend will be served by default at `http://localhost:3000`.

Enjoy cooking and sharing your favorite recipes with your family :)


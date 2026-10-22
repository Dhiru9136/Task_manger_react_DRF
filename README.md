# Django Task Manager API

A Task Management REST API built using **Python, Django, Django REST Framework (DRF), PostgreSQL, and SimpleJWT**. This project provides user registration, login, profile access, and task management through authenticated API endpoints.

## Features

- **User Registration:** Create a new user account.
- **User Login:** Authenticate users and generate JWT access and refresh tokens.
- **JWT Authentication:** Protect API endpoints using access tokens.
- **User Profile:** Retrieve the authenticated user's profile.
- **Create Tasks:** Create tasks with a title, description, status, priority, and due date.
- **List Tasks:** Retrieve tasks associated with the authenticated user.
- **Task Status:** Support task statuses such as Pending.
- **Task Priority:** Support priorities such as Medium.
- **Access Control:** Use Django REST Framework permissions to protect private endpoints.

## Technologies Used

- Python
- Django
- Django REST Framework
- SimpleJWT
- PostgreSQL / SQLite
- REST API
- Git and GitHub
- Postman for API testing

## Project Structure

```text
task_manager/
├── manage.py
├── task_manager/
│   ├── settings.py
│   ├── urls.py
│   └── ...
└── task_login_register/
    ├── models.py
    ├── serializers.py
    ├── views.py
    ├── urls.py
    └── ...
```

*Note: Adjust the folder structure if your actual project differs.*

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd task_manager
```

### 2. Create a virtual environment

```bash
python -m venv env
```

Activate it on Windows:

```bash
env\Scripts\activate
```

### 3. Install dependencies

```bash
pip install django djangorestframework djangorestframework-simplejwt
```

If you use PostgreSQL, install the appropriate PostgreSQL driver as well.

### 4. Apply migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Start the development server

```bash
python manage.py runserver
```

The local development server will run at:

`http://127.0.0.1:8000/`

## API Endpoints

The exact URLs depend on your `urls.py` configuration.

| Method | Endpoint purpose | Authentication |
|---|---|---|
| POST | User registration | Not required |
| GET | List users | Not required in the current view |
| POST | User login | Not required |
| GET | User profile | JWT required |
| POST | Create task | JWT required |
| GET | List user's tasks | JWT required |

## JWT Authentication

After a successful login, the API returns an access token and a refresh token.

For protected endpoints, send the access token in the request header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Example:

```http
GET /your-task-endpoint/
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Task Example

Example request body for creating a task:

```json
{
  "title": "Learn Django REST Framework",
  "description": "Practice authentication and CRUD APIs",
  "status": "Pending",
  "priority": "Medium",
  "due_date": null
}
```

The actual accepted values and date format depend on your `Task` model and serializer.

## Testing

You can test the endpoints using Postman:

1. Register a user.
2. Log in with the registered credentials.
3. Copy the access token from the login response.
4. Select **Authorization → Bearer Token** in Postman.
5. Create a task using a POST request.
6. Retrieve tasks using a GET request.

## Security Notes

- Store passwords using Django's password-hashing utilities rather than plain text.
- Keep secret keys and database credentials out of source control.
- Validate incoming task data using serializers.
- Ensure each task is associated with the correct user.
- Apply authentication and authorization consistently to protected endpoints.

## Future Improvements

- Update and delete tasks.
- Soft-delete tasks.
- Filter and search tasks.
- Pagination.
- Token refresh endpoint.
- Automated tests.
- Docker-based deployment.

## Author

**Dhiraj Pal**

Python Developer | Django | Django REST Framework | REST APIs | PostgreSQL

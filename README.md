# Learning Platform

Welcome to the Learning Platform project! This platform is designed to facilitate online learning interactions between administrators, teachers, and students. With features like course enrollment, assignment submissions, automatic grading, and file uploading capabilities, it aims to provide a seamless educational experience.

## Features

- **User Roles**: The platform supports multiple user roles including admin, teacher, and student, each with their respective permissions and functionalities.
- **Course Management**: Teachers can create courses, lessons, and lesson episodes, organizing the learning materials efficiently.
- **Assignment Submissions**: Students can enroll in courses and submit assignments related to course lessons.
- **Automatic Grading**: The system automatically grades courses based on students' assignment results, streamlining the evaluation process.
- **File Uploading**: Users can upload various file types including Word documents, PDFs, and images in different contexts such as assignment submissions and course materials.
- **Authentication**: JWT authentication and Google authentication via Passport.js in NestJS ensure secure access to the platform.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **PostgreSQL**: A powerful, open-source relational database system utilized for storing and managing application data.
- **Prisma**: Prisma is used as the database ORM (Object-Relational Mapping) for interacting with the PostgreSQL database.
- **JWT Authentication**: JSON Web Token-based authentication mechanism for securing user access to the platform.
- **Passport.js**: Integration with Passport.js facilitates Google authentication for users, enhancing the platform's security and user experience.

## Getting Started

To get started with the Learning Platform, follow these steps:

1. **Clone the Repository**: Clone this repository to your local machine using `git clone https://github.com/your/repository.git`.

2. **Install Dependencies**: Navigate to the project directory and install dependencies using `npm install`.

3. **Database Setup**: Configure the PostgreSQL database and update the connection settings in the project's configuration files.

4. **Run the Application**: Start the application using `npm start`. Ensure that the NestJS server is running and accessible.

5. **Access the Platform**: Access the platform via the provided URL or localhost address and begin exploring its features.

## Contributing

Contributions are welcome! If you'd like to contribute to the development of the Learning Platform, please follow these guidelines:

- Fork the repository and create a new branch for your feature or bug fix.
- Commit your changes with descriptive commit messages.
- Submit a pull request detailing the changes you've made and the problem or feature it addresses.

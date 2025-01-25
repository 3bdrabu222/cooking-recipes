# Recipe Blog

A modern, responsive recipe sharing platform built with Node.js, Express, MongoDB, and EJS. Share your favorite recipes, discover new dishes, and connect with food enthusiasts from around the world.

## Features

- 📱 Responsive modern design
- 🍳 Browse recipes by categories
- 🔍 Search functionality
- 📝 Submit and share recipes
- 🎯 Latest recipes section
- 🎲 Random recipe discovery
- 📸 Image upload support

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **View Engine**: EJS
- **Frontend**: Bootstrap 5, Font Awesome
- **File Upload**: Express-fileupload

## Prerequisites

Before running this project, make sure you have:

1. Node.js (v14 or higher)
2. MongoDB installed and running
3. npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd RecipeBlog-MongoDB-Node.js
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```
MONGODB_URI=your_mongodb_connection_string
```

4. Start the application:
```bash
npm start
```

The application will be available at `http://localhost:3001`

## Project Structure

```
RecipeBlog-MongoDB-Node.js/
├── public/               # Static files (CSS, images)
├── server/              # Server-side code
│   ├── controllers/     # Route controllers
│   ├── models/         # Database models
│   └── routes/         # Route definitions
├── views/              # EJS templates
│   └── layouts/       # Layout templates
├── uploads/            # Uploaded images
├── app.js             # Application entry point
└── package.json       # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Contact

For any questions or feedback, please reach out:
- Email: alshrafi1999@gmail.com
- Phone: +966 552445377

## License

This project is licensed under the MIT License - see the LICENSE file for details.

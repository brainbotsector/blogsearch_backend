const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors middleware
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'https://blogsearch-frontend.vercel.app', // Frontend deployment URL
    methods: ['GET', 'POST'],
}));

app.use(express.json());

// Set Faker locale to English
faker.locale = 'en'; // Correct method to set locale to English

// Generate fake blogs using Faker.js
const generateFakeBlogs = (query, count = 10) => {
    const fakeBlogs = [];
    for (let i = 0; i < count; i++) {
        fakeBlogs.push({
            title: `Blog on ${query} #${i + 1}`, // Remove "Fake" from title
            description: faker.lorem.paragraph(), // Generates a paragraph in English
            url: faker.internet.url(),
        });
    }
    return fakeBlogs;
};

// Blog search API without pagination
app.get('/api/blogs', async (req, res) => {
    const searchQuery = req.query.q || ""; // Get search query from URL parameters

    if (!searchQuery) {
        return res.json({ blogs: [] }); // Return empty if no search query is provided
    }

    try {
        // Fetch from Dev.to API using the search query
        const devResponse = await axios.get(`https://dev.to/api/articles?tag=${searchQuery}`);
        let combinedArticles = devResponse.data;

        // If Dev.to results are empty, generate fake blogs
        if (combinedArticles.length === 0) {
            combinedArticles = generateFakeBlogs(searchQuery, 10);
        }

        // Return all articles
        res.json({ blogs: combinedArticles });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch blog data" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// // backend//server.js
// const express = require('express');
// const axios = require('axios');
// const cors = require('cors'); // Import cors middleware
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors()); // Enable CORS
// app.use(express.json());

// // Blog search API with pagination
// app.get('/api/blogs', async (req, res) => {
//     const searchQuery = req.query.q || ""; // Get search query from URL parameters
//     const page = parseInt(req.query.page) || 1; // Current page
//     const limit = parseInt(req.query.limit) || 10; // Number of blogs per page
//     const skip = (page - 1) * limit; // Skip number for pagination

//     if (!searchQuery) {
//         return res.json({ blogs: [], totalPages: 0 }); // Return empty if no search query is provided
//     }

//     try {
//         // Fetch from Dev.to API using the search query
//         const devResponse = await axios.get(`https://dev.to/api/articles?tag=${searchQuery}`);

//         // Combine results from both sources (if any additional sources are added)
//         const combinedArticles = devResponse.data;

//         // Paginate the combined articles
//         const totalArticles = combinedArticles.length; // Total number of articles
//         const totalPages = Math.ceil(totalArticles / limit); // Calculate total pages
//         const paginatedArticles = combinedArticles.slice(skip, skip + limit); // Slice the articles based on page and limit

//         // Return paginated articles and total pages
//         res.json({ blogs: paginatedArticles, totalPages });
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).json({ error: "Failed to fetch blog data" });
//     }
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

// const express = require('express');
// const axios = require('axios');
// const cors = require('cors'); // Import cors middleware
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors()); // Enable CORS
// app.use(express.json());

// // Blog search API
// app.get('/api/blogs', async (req, res) => {
//     const searchQuery = req.query.q || ""; // Get search query from URL parameters

//     try {
//         // Fetch from News API
//         const newsResponse = await axios.get(
//             `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${process.env.NEWS_API_KEY}`
//         );

//         // Fetch from Dev.to API
//         const devResponse = await axios.get(`https://dev.to/api/articles?tag=${searchQuery}`);

//         // Combine results from both sources
//         const combinedArticles = [
//             ...newsResponse.data.articles,
//             ...devResponse.data,
//         ];

//         res.json(combinedArticles);  // Return combined data as JSON
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).json({ error: "Failed to fetch blog data" });
//     }
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

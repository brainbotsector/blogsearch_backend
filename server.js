const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import cors middleware
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'https://blog-search-b13dhb134-brainbotsectors-projects.vercel.app', // Frontend deployment URL (without trailing slash)
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
            title: `Blog on ${query} #${i + 1}`,
            description: faker.lorem.paragraph(),
            url: faker.internet.url(),
        });
    }
    return fakeBlogs;
};

// Blog search API
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
        console.error("Error fetching data:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch blog data" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// const express = require('express');
// const axios = require('axios');
// const cors = require('cors'); // Import cors middleware
// const { faker } = require('@faker-js/faker');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors({
//     origin: 'https://blog-search-b13dhb134-brainbotsectors-projects.vercel.app/', // Frontend deployment URL
//     methods: ['GET', 'POST'],
// }));

// app.use(express.json());

// // Set Faker locale to English
// faker.locale = 'en'; // Correct method to set locale to English

// // Generate fake blogs using Faker.js
// const generateFakeBlogs = (query, count = 10) => {
//     const fakeBlogs = [];
//     for (let i = 0; i < count; i++) {
//         fakeBlogs.push({
//             title: `Blog on ${query} #${i + 1}`, // Remove "Fake" from title
//             description: faker.lorem.paragraph(), // Generates a paragraph in English
//             url: faker.internet.url(),
//         });
//     }
//     return fakeBlogs;
// };

// // Blog search API without pagination
// app.get('/api/blogs', async (req, res) => {
//     const searchQuery = req.query.q || ""; // Get search query from URL parameters

//     if (!searchQuery) {
//         return res.json({ blogs: [] }); // Return empty if no search query is provided
//     }

//     try {
//         // Fetch from Dev.to API using the search query
//         const devResponse = await axios.get(`https://dev.to/api/articles?tag=${searchQuery}`);
//         let combinedArticles = devResponse.data;

//         // If Dev.to results are empty, generate fake blogs
//         if (combinedArticles.length === 0) {
//             combinedArticles = generateFakeBlogs(searchQuery, 10);
//         }

//         // Return all articles
//         res.json({ blogs: combinedArticles });
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         res.status(500).json({ error: "Failed to fetch blog data" });
//     }
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });


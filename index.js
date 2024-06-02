const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('portfolio');
        const collection = db.collection('users');
        const projectsCollection = db.collection('projects');
        const blogsCollection = db.collection('blogs');
        const skillsCollection = db.collection('skills');
        

        // User Registration
        app.post('/api/register', async (req, res) => {
            const { name, email, password } = req.body;

            // Check if email already exists
            const existingUser = await collection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            await collection.insertOne({ name, email, password: hashedPassword });

            res.status(201).json({
                success: true,
                message: 'User registered successfully'
            });
        });

        // User Login
        app.post('/api/login', async (req, res) => {
            const { email, password } = req.body;

            // Find user by email
            const user = await collection.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });

            res.json({
                success: true,
                message: 'Login successful',
                token
            });
        });


        // ==============================================================
        // WRITE YOUR CODE HERE
        // //Create project
        app.post("/api/create-project", async (req, res) => {
            const newProject = req.body;
            const result = await projectsCollection.insertOne(newProject);
            res.status(201).json({
                success: true,
                message: 'New Project Added successfully!',
                data: result
            });
        });

        // //get all projects
        app.get("/api/projects", async (req, res) => {
            const result = await projectsCollection.find().toArray();
            res.status(201).json({
                success: true,
                message: 'Projects are retrieved successfully!',
                data: result
            });
        });


          //get a project
          app.get("/api/project/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await projectsCollection.findOne(query);
            res.status(201).json({
                success: true,
                message: 'Project is retrieved successfully!',
                data: result
            });
           });

        //update a project
          app.put("/api/project/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const update = { $set: req.body };
            const result = await projectsCollection.findOneAndUpdate(query, update, { returnOriginal: false });
            res.status(201).json({
                success: true,
                message: 'Project is updated successfully!',
                data: result
            });
           });

        //delete a project
          app.delete("/api/project/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await projectsCollection.deleteOne(query);
            res.status(201).json({
                success: true,
                message: 'Projects is deleted successfully!',
                data: result
            });
           });


        //Create blog
        app.post("/api/create-blog", async (req, res) => {
            const newBlog = req.body;
            const result = await blogsCollection.insertOne(newBlog);
            res.status(201).json({
                success: true,
                message: 'New Blog Added successfully!',
                data: result
            });
        });

        //get all blogs
        app.get("/api/blogs", async (req, res) => {
            const result = await blogsCollection.find().toArray();
            res.status(201).json({
                success: true,
                message: 'Blogs are retrieved successfully!',
                data: result
            });
        });


          //get a blog
          app.get("/api/blog/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogsCollection.findOne(query);
            res.status(201).json({
                success: true,
                message: 'Blog is retrieved successfully!',
                data: result
            });
           });

        //update a blog
          app.put("/api/blog/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const update = { $set: req.body };
            const result = await blogsCollection.findOneAndUpdate(query, update, { returnOriginal: false });
            res.status(201).json({
                success: true,
                message: 'Blog is updated successfully!',
                data: result
            });
           });

        //delete a blog
          app.delete("/api/blog/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            res.status(201).json({
                success: true,
                message: 'Blog is deleted successfully!',
                data: result
            });
           });


        //Create skill
        app.post("/api/create-skill", async (req, res) => {
            const newSkill = req.body;
            const result = await skillsCollection.insertOne(newSkill);
            res.status(201).json({
                success: true,
                message: 'New Skill Added successfully!',
                data: result
            });
        });

        //get all skills
        app.get("/api/skills", async (req, res) => {
            const result = await skillsCollection.find().toArray();
            res.status(201).json({
                success: true,
                message: 'Skills are retrieved successfully!',
                data: result
            });
        });


          //get a skill
          app.get("/api/skill/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await skillsCollection.findOne(query);
            res.status(201).json({
                success: true,
                message: 'Skill is retrieved successfully!',
                data: result
            });
           });

        //update a skill
          app.put("/api/skill/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const update = { $set: req.body };
            const result = await skillsCollection.findOneAndUpdate(query, update, { returnOriginal: false });
            res.status(201).json({
                success: true,
                message: 'Skill is updated successfully!',
                data: result
            });
           });

        //delete a blog
          app.delete("/api/skill/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await skillsCollection.deleteOne(query);
            res.status(201).json({
                success: true,
                message: 'Skill is deleted successfully!',
                data: result
            });
           });
    

          

            
            

        // ==============================================================


        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running !!!',
        timestamp: new Date()
    };
    res.json(serverStatus);
});
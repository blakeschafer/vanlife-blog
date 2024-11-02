// Blog data stored in an array (most recent post first)
const blogs = [
    {
        id: "blog3",
        title: "Indy 500",
        date: "Oct 6, 2024",
        image: "house-image.jpg", // Custom image for the blog
        content: `
            <p>TL;DR I created a new project called This House Does Not Exist which uses AI to generate modern architecture homes.</p>
            <p>Just 2 weeks ago, Stability AI open sourced their AI imaging model Stable Diffusion. It lets anyone generate images based on text. I think it's groundbreaking and revolutionary.</p>
        `
    },
    {
        id: "blog2",
        title: "Hello Indiana",
        date: "Oct 2, 2024",
        image: "podcast-image.jpg", // Custom image for this blog
        content: `
            <p>In this podcast episode, we talk about bootstrapping, open startups, and lifestyle inflation.</p>
        `
    },
    {
        id: "blog1",
        title: "Leaving Chicago",
        date: "Sept 30, 2024",
        image: "thinking-image.jpg", // Custom image for this blog
        content: `
            <p>On this episode of Life Done Differently, we discuss the importance of thinking for yourself and developing a unique mindset.</p>
        `
    }
    // Add more blog data here
];

// Function to display the blog list dynamically
function loadBlogList() {
    const blogList = document.getElementById('blog-list');
    blogs.forEach(blog => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="#" onclick="loadBlog('${blog.id}')">${blog.title}</a> - ${blog.date}`;
        blogList.appendChild(listItem);
    });
}

// Function to load a specific blog post dynamically
function loadBlog(blogId) {
    const selectedBlog = blogs.find(blog => blog.id === blogId);
    if (selectedBlog) {
        // Set blog image and content
        document.getElementById('blog-image').src = selectedBlog.image;
        document.getElementById('blog-article').innerHTML = `
            <h1>${selectedBlog.title}</h1>
            <p>${selectedBlog.date}</p>
            ${selectedBlog.content}
        `;
    }
}

// Load the blog list when the page loads
window.onload = loadBlogList;


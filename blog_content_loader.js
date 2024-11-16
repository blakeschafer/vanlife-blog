// Extract blog identifier from URL query parameters
const params = new URLSearchParams(window.location.search);
const blogId = params.get('id');

// Fetch and render the markdown file
if (blogId) {
    fetch(`./blogs/${blogId}.md`)
        .then(response => response.text())
        .then(text => {
            const converter = new showdown.Converter(); // Using Showdown.js for markdown conversion
            const htmlContent = converter.makeHtml(text);
            document.getElementById('blog-content').innerHTML = htmlContent;
        })
        .catch(error => {
            document.getElementById('blog-content').innerHTML = `<h1>Blog Not Found</h1><p>Sorry, the blog post you are looking for does not exist.</p>`;
        });
}

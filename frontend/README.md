# GitHub Followers Visualization

This project visualizes GitHub followers of a user and their followers in a graph format. The project consists of a backend service built with FastAPI and a frontend that uses JavaScript and VivaGraphJS.

## Changes Made to the Original Application

1. **Backend Enhancements**:
   - Modified the backend to calculate the "size" of each user icon based on their number of followers. This value is used to dynamically adjust the size of the user's avatar in the graph.
   - Implemented recursive fetching of followers for each user, meaning the graph will show not only the requested user's followers but also the followers of those followers, and so on.
   - Added two new endpoints:
     - **GET /github/{username}/repos**: Returns a list of repositories for a given user.
     - **POST /github/{username}/follow**: Simulates a follow action for a given user (used for demonstration purposes).

2. **Frontend Changes**:
   - Integrated the backend to dynamically load and render the graph with nodes representing GitHub users.
   - Each node’s size is calculated and displayed according to the user’s followers count.
   - The graph visualization uses the `VivaGraphJS` library, and the user avatars are represented by image nodes in the graph.
   
## API Documentation in Postman

To view the API documentation and test the endpoints, please visit our Postman workspace:

[Postman Workspace Link](https://www.postman.com/workspace/your-workspace-link-here)

## How to Run the Project

1. **Backend**:
   - Install dependencies: `pip install -r requirements.txt`
   - Run the FastAPI server: `uvicorn main:app --reload`
   
2. **Frontend**:
   - Install dependencies: `npm install`
   - Build and run the frontend: `npm start`

Visit `http://localhost:5000` to see the visualization.


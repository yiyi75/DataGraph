# DataGraph

DataGraph is a simple React application for displaying data graphs. This project allows you to visualize data in a user-friendly manner. You can clone this repository to your local machine and customize it to display your own data. Additionally, you can push the data to Firebase for real-time updates.

## Getting Started

Follow these steps to get a copy of the project on your local machine and configure Firebase if needed.

### Prerequisites

- [Node.js](https://nodejs.org/) installed on your machine
- [Firebase](https://firebase.google.com/) account (if you want to push data to Firebase)

### Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/yiyi75/DataGraph.git
   cd DataGraph

2. Install project dependencies
```bash
npm install

3. Inside the firebase folder, paste the Firebase config object in the `firebase.jsx` file.

4. Can manually add more data to the `src/data` folder by saving data in JSON format.
- Need to update App.js to load the new variable names
- Load the new data into the plotarea/plotcomplex scripts

5. Start the development server
```bash
npm start

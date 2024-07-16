# **City Explorer App**

## Hosted Web App:

https://city-explorer-web.netlify.app/

    Warning: At this stage, please use passwords that you do not use elsewhere while we work on implementing a more secure authentication system.

### Backend repo:

[https://github.com/EliR94/city-explorer-backend](https://github.com/EliR94/city-explorer-backend)

## Local Frontend Setup

To get the web app up and running on your local machine, follow these steps:

### **Prerequisites**

Before proceeding, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** (minimum version: v21.7.3)

### 1. Clone the Repository

Begin by cloning the repository to your local machine. Use the following command in your terminal, ensuring you navigate to your desired directory:

```bash
git clone https://github.com/michael-farah/city-explorer-app.git
```

### 2. Install Dependencies

Next, install the project dependencies using npm. Execute the following command in your terminal (ensure you're within the repository directory):

```bash
npm install
```

This command will fetch and install the required packages.

#### 3. Create Environment Variable Files

You'll need to create a .env file to store a Google Maps API key:

- Check the .env.example for an example of how this is written.

#### 4. Run On Your Local Browser

```bash
npm start
```
Go to the link displayed in your terminal.
    It should look like this: http://localhost:8081
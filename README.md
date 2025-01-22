# Online Library App

## Project Overview
The Online Library App is a web application that allows users to browse, borrow, and return books. It is built with Node.js for the backend and React for the frontend. This repository provides all necessary code to run both the frontend and backend components locally.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Clone the Repository](#clone-the-repository)
  - [Install Backend Dependencies](#install-backend-dependencies)
  - [Install Frontend Dependencies](#install-frontend-dependencies)
- [Running the Application](#running-the-application)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Environment Configuration](#environment-configuration)

## Prerequisites
Before setting up the app, make sure you have the following installed:
- **Node.js** (v14 or later) – [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- A code editor (e.g., Visual Studio Code)

## Setup Instructions

### Clone the Repository
First, clone the repository to your local machine:

```bash
git clone https://github.com/wahyumulyautama/online-library-app.git
cd online-library-app
```

### Install Backend Dependencies

```bash
cd online-libaray-system
npm install
```

### Install Frontend Dependencies

```bash
cd online-libaray-ui
npm install
```

## Running the Application

### Backend

```bash
cd online-libaray-system
npm start
```

### Frontend

```bash
cd online-libaray-ui
npm start
```

## Environment Configuration
Ensure you have the necessary environment variables set up for the backend. You can add these in a .env file in the backend directory. Example:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=library_db
```


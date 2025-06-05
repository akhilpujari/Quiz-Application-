# 🧠 Quiz Application

A web-based Quiz Application built with **HTML, CSS, jQuery, PHP, and PostgreSQL**. This platform allows users to take timed quizzes based on selected subjects and get instant results. It also provides a leaderboard, certificate generation, and admin control panel.

---

## 🚀 Features

- 🔍 **Subject-based Quiz Selection**: Users can choose a subject and take available quizzes.
- ⏱️ **Time-Limited Quizzes**: Each quiz must be completed within the given time.
- 📊 **Leaderboard**: View ranks based on quiz performance.
- 🎓 **Certificates**: Automatically generated for users who pass the quiz.
- 🔐 **Authentication**: Secure token-based login system; token is stored and updated in the database.
- 🧑‍💻 **Admin Panel**:
  - Add new subjects and quizzes
  - View quiz analytics (pass/fail/attendance reports)

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, jQuery
- **Backend**: PHP
- **Database**: PostgreSQL
- **Database Access**: PHP PDO (Prepared Statements for security)
- **Server**: `php -S localhost:3000`
- **Authentication**: Token-based session tracking
- **Version Control**: Git & GitHub

---

## 🧪 How to Run the Project

1. **Clone the repository**:
   => git clone https://github.com/akhilpujari/Quiz-Application-.git
   => cd Quiz-Application-
   
2. **Set up PostgreSQL**:
   Create a new database.
   Take the reference from this  SQL schema from this link =>  https://dbdiagram.io/d/67d2d38775d75cc844f62f59.
   Update the DB credentials in your PHP connection file (/api/utils/db.php or wherever you initialized PDO).
   make sure to enable the necessary psql extensions in php.ini file ( doesn't work if not enabled)

3. **Start the server in local**:
    use this command in terminal
    => php -S localhost:3000






   

from flask import Flask, request, Blueprint, render_template
import os
import hashlib
import json
import csv
import base64
import jwt
from flask_mysqldb import MySQL

from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '12345'
app.config['MYSQL_DB'] = 'BLOG_APPLICATION'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
mysql = MySQL(app)


def sha1_hash(string):
    hashing = hashlib.sha1()
    hashing.update(string.encode('utf-8'))
    return hashing.hexdigest()


def salt_generate():
    salt = os.urandom(16)
    return base64.b64encode(salt)


def password_generator(password, salt):
    i = 0
    pswd = ""
    while i < 30:
        ps = salt+password
        pswd = sha1_hash(ps)
        i += 1
    return pswd


def database_reader():
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM  User""")
    res = cursor.fetchall()
    cursor.close()
    data = []
    for i in res:
        data.append(i)
    return data


def get_user(email):
    data = database_reader()
    for line in data:
        if line["email"] == email:
            return line


def check_email(email):
    data = database_reader()
    for file in data:
        if file["email"] == email:
            return True
    return False


def user_find(email):
    data = database_reader()
    for file in data:
        if file["email"] == email:
            return {"name": file["name"], "id": file["id"]}
    return "not found"


def user_details_find(id):
    data = database_reader()
    for file in data:
        if file["id"] == id:
            return file
    return "not found"


def get_user_name(id):
    curs = mysql.connection.cursor()
    curs.execute("""SELECT name from User WHERE id=%s""", (id,))
    user = curs.fetchone()
    curs.close()
    return user


@app.route("/auth/signup", methods=['POST'])
def sign_up():
    name = request.json["name"]
    email = request.json["email"]
    password = request.json["password"]
    salt = str(salt_generate())
    password_hash = password_generator(str(password), salt)
    if check_email(email):
        return json.dumps({"error": "true", "message": "Email Already Exist"})
    else:
        cursor = mysql.connection.cursor()
        name = request.json["name"]
        email = request.json['email']
        password = request.json['password']
        cursor.execute("INSERT INTO User (name, email, salt, password_hash) VALUES (%s, %s, %s, %s)",
                       (name, email, salt, password_hash))
        mysql.connection.commit()
        cursor.close()
        return {"error": "false", "message": "Registration Successfull"}


@app.route("/auth/login", methods=["POST"])
def login():
    email = request.json["email"]
    password = request.json["password"]
    if check_email(email):
        user = get_user(email)
        password_hash = password_generator(str(password), user["salt"])
        if password_hash == user["password_hash"]:
            user = user_find(email)
            encode_data = jwt.encode(user, 'ayaan', algorithm='HS256')
            return json.dumps({"error": "false", "message": "login Successfull", "token": str(encode_data, "utf-8")})

        else:
            return json.dumps({"error": "true", "message": "Incorrect Password"})

    else:
        return json.dumps({"error": "true", "message": "Invalid login Creadentials"})


@app.route("/auth/details", methods=['POST'])
def get_data():
    auth_header = request.headers.get('Authorization')
    token_encoded = auth_header.split(' ')[1]
    decode_data = jwt.decode(token_encoded, 'ayaan', algorithms=['HS256'])
    id = decode_data['id']
    user_data = user_details_find(id)
    return json.dumps({"name": user_data["name"], "img": user_data["img"], 'email': user_data["email"], 'id': user_data["id"]})


@app.route("/blog/create", methods=["POST"])
def create_blog():
    try:
        title = request.json["title"]
        content = request.json["content"]
        user_id = request.json["user_id"]
        category_id = request.json["category_id"]
        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO Blog (title, content, user_id, Category_id) VALUES (%s, %s, %s, %s)", (
                title, content, user_id, category_id)
        )
        mysql.connection.commit()
        cursor.close()
        return json.dumps({"message": "Blog Added", "error": "false", "blog": {"title": title, "content": content}})

    except Exception as e:
        return json.dumps({"message": e, "error": "true"})


@app.route("/blog/getcomments", methods=["POST"])
def get_comment():
    Category_id = request.json["category_id"]
    Blog_id = request.json["blog_id"]
    comments = mysql.connection.cursor()
    comments.execute("SELECT * FROM Comments WHERE Blog_id = %s && Category_id = %s",
                     (int(Blog_id), int(Category_id)))
    comment = comments.fetchall()
    comments.close()
    cmn = []
    for c in comment:
        c.update({"created_at": str(c['created_at']),
                  "name": get_user_name(c["user_id"])})
        cmn.append(c)
    return json.dumps({"comments": cmn})


@app.route("/blog/comments", methods=["POST"])
def comment_on_post():
    try:
        comment = request.json["comment"]
        user_id = request.json["user_id"]
        Category_id = request.json["category_id"]
        Blog_id = request.json["blog_id"]
        cursor = mysql.connection.cursor()
        cursor.execute("INSERT INTO Comments (comment, user_id, Category_id, Blog_id) VALUES(%s, %s, %s, %s)",
                       (comment, user_id, Category_id, Blog_id))
        mysql.connection.commit()
        cursor.close()
        return json.dumps({"error": "false", "comment": comment})

    except Exception as e:
        return json.dumps({"error": "true", "message": str(e)})


@app.route('/uploader/<email>/<id>', methods=['POST'])
def upload_file(email, id):
    if request.method == 'POST':
        f = request.files['file']
        location = "Frontend/public/static/img/"+email
        newLocation = "static/img/"+email
        f.save(location)
        cur = mysql.connection.cursor()
        cur.execute("""UPDATE User SET img=%s WHERE id=%s""",
                    (newLocation, id,))
        mysql.connection.commit()
        cur.close()
        return {"path": location}


@app.route("/blog/create", methods=["POST"])
def create_bloging():
    try:
        title = request.json["title"]
        content = request.json["content"]
        user_id = request.json["user_id"]
        category_id = request.json["category_id"]
        cursor = mysql.connection.cursor()
        cursor.execute(
            "INSERT INTO Blog (title, content, user_id, Category_id) VALUES (%s, %s, %s, %s)", (
                title, content, user_id, category_id)
        )
        mysql.connection.commit()
        cursor.close()
        return json.dumps({"message": "Blog Added", "error": "false", "blog": {"title": title, "content": content}})

    except Exception as e:
        return json.dumps({"message": e, "error": "true"})


@app.route("/blog/delete", methods=["DELETE"])
def delete_blog():
    blog_id = str(request.json["blog_id"])
    cur2 = mysql.connection.cursor()
    cur2.execute("DELETE FROM Comments WHERE Blog_id=%s", (blog_id,))
    mysql.connection.commit()
    cur2.close()
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM Blog WHERE id=%s", (blog_id,))
    mysql.connection.commit()
    cur.close()
    return json.dumps({"message": "Delete Successfull"})


@app.route("/blog/update", methods=["PUT"])
def update_blogs():
    blog_id = str(request.json["blog_id"])
    title = str(request.json["title"])
    content = str(request.json["content"])
    cur = mysql.connection.cursor()
    cur.execute("""UPDATE Blog SET title=%s, content=%s WHERE id=%s""",
                (title, content, blog_id,))
    mysql.connection.commit()
    cur.close()
    return json.dumps({"message": "update Successfull"})


@app.route("/blog/getData")
def get_category_and_blogs():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT * FROM Category")
        res = cursor.fetchall()
        cursor.close()
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM Blog")
        blogs = cur.fetchall()
        cur.close()
        cur2 = mysql.connection.cursor()
        cur2.execute("SELECT id, name, img FROM User")
        all_user = cur2.fetchall()
        cur2.close()
        blog = []
        data = []
        us = []
        for u in all_user:
            us.append(u)
        for m in blogs:
            m.update({"created_at": str(m['created_at'])})
            blog.append(m)

        for i in res:
            data.append(i)
        return json.dumps({"error": "false", "category": data, "blogs": blog, "users": us})
    except Exception as e:
        return json.dumps({"error": "true", "message": str(e)}, default=str)

let global_username = "restricted_username";
const APP_ID = 'hw2-application-orgip';
const ATLAS_SERVICE = 'mongodb-atlas';
const app = new Realm.App({id: APP_ID});
initialization();
let auth_val = 1;

const openSideBar = async () => {
    $('.ui.sidebar').sidebar('toggle');
}

const open_add_book_form = () => {
    if (document.getElementById("add_book_form").style.visibility == "hidden") {
        document.getElementById("add_book_form").style.visibility = "visible";
        document.getElementById("add_book_button").style.visibility = "visible";
    } else {
        document.getElementById("add_book_form").style.visibility = "hidden";
        document.getElementById("add_book_button").style.visibility = "hidden";
    }
}
const do_checkbox_translation = async () => {
    if (document.getElementById('translator').className === 'field') {
        document.getElementById('translator').className = 'disabled field'
    } else {
        document.getElementById('translator').className = 'field'
    }
}
const do_checkbox_editor = async () => {
    if (document.getElementById('editor').className === 'field') {
        document.getElementById('editor').className = 'disabled field'
    } else {
        document.getElementById('editor').className = 'field'
    }
}
const do_checkbox_genre = async () => {
    if (document.getElementById('genre').className === 'field') {
        document.getElementById('genre').className = 'disabled field'
    } else {
        document.getElementById('genre').className = 'field'
    }
}
const submit_book = async () => {
    const collection_books = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("books");
    if ($(`#add_book_form`).form('is valid')) {
        let dict_book = $('#add_book_form').form('get values');
        if (dict_book['checkbox_editor'] === false) {
            delete dict_book.editor
        }
        if (dict_book['checkbox_fiction'] === false) {
            delete dict_book.genre
        }
        if (dict_book['checkbox_translation'] === false) {
            delete dict_book.translator
        }
        delete dict_book.checkbox_editor;
        delete dict_book.checkbox_fiction;
        delete dict_book.checkbox_translation;
        dict_book.number_readers = 0;
        dict_book.total_rating = 0;
        dict_book.avg_rating = 0;
        const result = await collection_books.insertOne(
            dict_book
        );
        open_add_book_form();
        document.getElementById("add_book_form").reset();
    }
}
const submit_user = async () => {
    const collection_users = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("users");
    if ($(`#add_user_form`).form('is valid')) {
        let dict_user = $('#add_user_form').form('get values');
        dict_user.number_read = 0;
        dict_user.favorite_books = [];
        dict_user.avg_rating_given = 0;
        await collection_users.insertOne(dict_user);
        open_add_user_form();
        document.getElementById("add_user_form").reset();
    }
}
const add_author = async () => {
    auth_val++;
    $('#first_book_fields').append(
        "<div class=\"field\">" +
        "            <label>Author_" + auth_val.toString() + "</label>" +
        "            <input type=\"text\" name=\"author_" + auth_val.toString() + "\" placeholder=\"Author_" + auth_val.toString() + "\">" +
        "        </div>"
    );
    $('#add_book_form').form({
        fields: {
            name: 'empty',
            author: 'empty',
            publisher: 'empty',
            cover: 'empty',
            year_published: 'empty',
        }
    });
}
const delete_book_main = async () => {
    const collection_books = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("books");
    const table = document.getElementById('delete_book_table')
    if (table.style.visibility === 'hidden') {
        const books_with_projection = await collection_books.find({});
        books_with_projection.forEach(book => {
            let row = table.insertRow();
            let name = row.insertCell(0);
            name.innerHTML = book.name;
            let author = row.insertCell(1);
            author.innerHTML = book.author + ((book.author_2 === undefined) ? "" : (", " + book.author_2)) + ((book.author_3 === undefined) ? "" : (", " + book.author_3)) + ((book.author_4 === undefined) ? "" : (", " + book.author_4)) + ((book.author_5 === undefined) ? "" : (", " + book.author_5));
            let buttonV1 = row.insertCell(2);
            buttonV1.innerHTML = "<button class = \"ui icon button\" style='background-color: #e75a5a'>" +
                "<i class =\"trash alternate icon\" onclick='delete_book(\"" + book.name + "\",\"" + book.author + "\"," + (table.rows.length - 1) + ")'></i>" +
                "</button"
        })
        table.style.visibility = 'visible'
    } else {
        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            table.deleteRow(1);
        }
        table.style.visibility = 'hidden'
    }
}

const delete_user_main = async () => {
    const collection_users = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("users");
    const table = document.getElementById('delete_user_table')
    if (table.style.visibility === 'hidden') {
        const users_with_projection = await collection_users.find({});
        users_with_projection.forEach(user => {
            let row = table.insertRow();
            let name = row.insertCell(0);
            name.innerHTML = user.username;
            let buttonV1 = row.insertCell(1);
            buttonV1.innerHTML = "<button class = \"ui icon button\" style='background-color: #e75a5a'>" +
                "<i class =\"trash alternate icon\" onclick='delete_user(\"" + user.username + "\"," + (table.rows.length - 1) + ")'></i>" +
                "</button"
        })
        table.style.visibility = 'visible'
    } else {
        var rowCount = table.rows.length;
        for (var i = 1; i < rowCount; i++) {
            table.deleteRow(1);
        }
        table.style.visibility = 'hidden'
    }
}


async function delete_book(name, author, row) {
    const collection_books = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("books");
    const table = document.getElementById('delete_book_table')
    const result = await collection_books.deleteOne({"name": name, "author": author});
    table.deleteRow(row);
    delete_book_main();
}

async function delete_user(username, row) {
    const collection_users = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("users");
    const table = document.getElementById('delete_user_table')
    await collection_users.deleteOne({"username": username});
    table.deleteRow(row);
    delete_user_main();
}


async function get_books() {
    const collection_books = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("books");
    const table = document.getElementById('book_table')
    if (table.style.visibility === 'hidden') {
        const books_with_projection = await collection_books.find({});
        table.style.visibility = 'visible'
        for (const book of books_with_projection) {
            let row = table.insertRow();
            let name = row.insertCell(0);
            name.innerHTML = book.name;
            let author = row.insertCell(1);
            author.innerHTML = book.author + ((book.author_2 === undefined) ? "" : (", " + book.author_2)) + ((book.author_3 === undefined) ? "" : (", " + book.author_3)) + ((book.author_4 === undefined) ? "" : (", " + book.author_4)) + ((book.author_5 === undefined) ? "" : (", " + book.author_5));
            let translator = row.insertCell(2);
            translator.innerHTML = ((book.translator === undefined) ? "" : book.translator);
            let editor = row.insertCell(3);
            editor.innerHTML = ((book.editor === undefined) ? "" : book.editor);
            let cover = row.insertCell(4);
            cover.innerHTML = "<img src=\"" + book.cover + "\" alt=\"No Image Found\" width=\"60\" height=\"60\" style=\"vertical-align:middle\">";
            let publisher = row.insertCell(5);
            publisher.innerHTML = book.publisher;
            let genre = row.insertCell(6);
            genre.innerHTML = ((book.genre === undefined) ? "" : book.genre);
            let year_published = row.insertCell(7);
            year_published.innerHTML = book.year_published;
            let avg_rating = row.insertCell(8);
            const collection_ratings = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("ratings");
            const all_ratings = await collection_ratings.find({'book': book.name})
            let a = 0;
            let b = 0;
            let c = 0;
            if (all_ratings) {
                all_ratings.forEach(rating => {
                    c = 1;
                    a += Number(rating['rating']);
                    b = b + 1;
                })
                if (c === 1) {
                    avg_rating.innerHTML = a / b;
                } else {
                    avg_rating.innerHTML = 0
                }
            } else {
                avg_rating.innerHTML = 0
            }
            if (avg_rating.innerText === "NaN") {
                avg_rating.innerHTML = 0
            }

            let reviews = row.insertCell(9);
            const collection_reviews = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("reviews");
            const all_reviews = await collection_reviews.find({'book': book.name})
            all_reviews.forEach(review => {
                reviews.innerHTML = reviews.innerHTML + ("<h4> User Name: " + review.username + "</h4><h4>Review: " + review.context + "</h4> <hr>");
            })

        }
    } else {
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            table.deleteRow(0);
        }
        table.style.visibility = 'hidden'
    }
}

async function add_rating(name, author, rating) {
    const collection_books = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("books");
    const book = await collection_books.findOne({"name": name, "author": author});
    collection_books.update({"name": name, "author": author},
        {
            $set:
                {
                    number_readers: book.number_readers + 1,
                    total_rating: (book.total_rating + rating),
                    avg_rating: ((book.total_rating + rating) / (book.number_readers + 1))
                }
        })
}

async function initialization() {
    const credentials = Realm.Credentials.anonymous();
    const user = await app.logIn(credentials);
}

function open_add_user_form() {
    if (document.getElementById("add_user_form").style.visibility == "hidden") {
        document.getElementById("add_user_form").style.visibility = "visible";
        $("#user_submit_button").attr("onclick", "submit_user()");
        $("#user_submit_button").html("Add User");
    } else {
        document.getElementById("add_user_form").style.visibility = "hidden";
        document.getElementById("add_user_form").reset();
    }
}

function open_login_user_form() {
    if (document.getElementById("add_user_form").style.visibility == "hidden") {
        document.getElementById("add_user_form").style.visibility = "visible";
        $("#user_submit_button").attr("onclick", "login_user()");
        $("#user_submit_button").html("Login");
    } else {
        document.getElementById("add_user_form").style.visibility = "hidden";
        document.getElementById("add_user_form").reset();
    }
}

async function login_user() {
    const collection_users = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("users");
    if ($(`#add_user_form`).form('is valid')) {
        let dict_user = $('#add_user_form').form('get values');
        const user = await collection_users.findOne({"username": dict_user.username});
        if (user != null) {
            if (user.password === dict_user.password) {
                global_username = user.username
                if ($('#username_div')[0].innerText === "") {
                    $('#username_div').append("<i class=\"user circle icon\"></i> User: " + global_username)
                }
                // $('#user_page_icon').attr('href', 'user.html?username=' + user.username)
                localStorage.setItem("username", user.username);
            } else {
                alert("Wrong Password!");
            }
        } else {
            alert("There is no user with that username!");
        }
        open_add_user_form();
        document.getElementById("add_user_form").reset();
    }
}

async function fillUserTable() {
    const collection_users = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("users");
    const user = await collection_users.findOne({"username": localStorage.getItem('username')});
    const table = document.getElementById('user_table')
    let row = table.insertRow();
    let username = row.insertCell(0);
    username.innerHTML = user.username;
    let numRead = row.insertCell(1);
    numRead.innerHTML = user.number_read;
    let fav = row.insertCell(2);
    fav.innerHTML = user.favorite_books;
    let avg = row.insertCell(3);
    avg.innerHTML = user.avg_rating_given;
    let reviews = row.insertCell(4);
    const collection_reviews = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("reviews");
    const all_reviews = await collection_reviews.find({'username': user.username})
    all_reviews.forEach(review => {
        reviews.innerHTML = reviews.innerHTML + ("<h4> Book Name: " + review.book + "</h4><h4>Review: " + review.context + "</h4> <hr>");
    })
}

async function openActions() {
    const collection_books = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("books");
    const table = document.getElementById('book_table_action')
    if (table.style.visibility === "hidden") {
        const books_with_projection = await collection_books.find({});
        books_with_projection.forEach(book => {
            let row = table.insertRow();
            let name = row.insertCell(0);
            name.innerHTML = book.name;
            let author = row.insertCell(1);
            author.innerHTML = book.author + ((book.author_2 === undefined) ? "" : (", " + book.author_2)) + ((book.author_3 === undefined) ? "" : (", " + book.author_3)) + ((book.author_4 === undefined) ? "" : (", " + book.author_4)) + ((book.author_5 === undefined) ? "" : (", " + book.author_5));
            let buttonV1 = row.insertCell(2);
            buttonV1.innerHTML = "<form class=\"ui equal width form\" id =\"activity_form_" + book.name + "\">" +
                "    <div class=\"fields\">" +
                "        <div class=\"field\" >" +
                "            <div class=\"ui dropdown selection\">" +
                "                <input type=\"hidden\" name=\"rate\">" +
                "                <div class=\"default text\">Select Rate</div>" +
                "                <i class=\"dropdown icon\"></i>" +
                "                <div class=\"menu\">" +
                "                    <div class=\"item\" data-value=\"1\">1</div>" +
                "                    <div class=\"item\" data-value=\"2\">2</div>" +
                "                    <div class=\"item\" data-value=\"3\">3</div>" +
                "                    <div class=\"item\" data-value=\"4\">4</div>" +
                "                    <div class=\"item\" data-value=\"5\">5</div>" +
                "                </div>" +
                "            </div>" +
                "        </div>" +
                "        <div class=\"field\">" +
                "            <button class=\"ui labeled icon button \" onclick='add_rate(\"" + book.name + "\",\"" + localStorage.getItem('username') + "\")'>" +
                "                <i class=\"thumbs up icon\"></i>" +
                "                Rate" +
                "            </button>" +
                "        </div>" +
                "    </div>" +
                "    <div class=\"fields\">" +
                "        <div class=\"field\">" +
                "            <input type=\"text\" name=\"review\" placeholder=\"Write a review\">" +
                "        </div>" +
                "        <div class=\"field\" id = \"review_dis_\"" + book.name + ">" +
                "            <button class=\"ui labeled icon button \" onclick='add_review(\"" + book.name + "\",\"" + localStorage.getItem('username') + "\")'>" +
                "                <i class=\"pencil alternate icon\"></i>" +
                "                Write Review" +
                "            </button>" +
                "        </div>" +
                "    </div>" +
                "    <div class=\"fields\">" +
                "        <div class=\"field\">" +
                "            <button class=\"ui labeled icon button\" onclick='add_favorites(\"" + book.name + "\",\"" + localStorage.getItem('username') + "\")'>" +
                "                <i class=\"star icon\"></i>" +
                "                Add Favorites" +
                "            </button>" +
                "        </div>" +
                "    </div>" +
                "</form>"
        })
        $('.ui.dropdown.selection').dropdown();
        table.style.visibility = "visible";
    } else {
        table.style.visibility = "hidden";
        var rowCount = table.rows.length;
        for (var i = 0; i < rowCount; i++) {
            table.deleteRow(0);
        }
    }
}

const add_rate = async (name, username) => {
    let dict = $('#activity_form_' + name).form('get values');
    const collection_ratings = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("ratings");
    const collection_users = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("users");
    dict_book = {
        'book': name,
        'username': username,
        'rating': dict['rate']
    }
    collection_users.findOne()
    const result = await collection_ratings.insertOne(dict_book);
    const user = await collection_users.findOne({"username": username});
    let total = user.avg_rating_given * user.number_read;
    let newavg = ((dict['rate'] + total) / (user.number_read + 1))
    const result1 = await collection_users.update({username: username}, {
        set: {
            number_read: (user.number_read + 1),
            avg_rating_given: newavg
        }
    })
}

async function add_review(name, username) {
    let dict = $('#activity_form_' + name).form('get values');
    const collection_reviews = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("reviews");
    dict_book = {
        'book': name,
        'username': username,
        'context': dict['review']
    }
    await collection_reviews.insertOne(dict_book);
}

const add_favorites = async (name, username) => {
    const collection_users = app.currentUser.mongoClient(ATLAS_SERVICE).db("bookManager").collection("users");
    await collection_users.update({username: username}, {$addToSet: {favorite_books: name}});
}
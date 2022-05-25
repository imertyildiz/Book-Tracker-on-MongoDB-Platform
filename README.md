# Book Tracker on MongoDB Platform with using Atlas and Realm

This Book Tracker app developed by using JavaScript & HTML for FrontEnd, server side is not present thanks to the
MongoDB Atlas & Realm.

- App Link:
  https://hw2-application-orgip.mongodbstitch.com/

- User Guide:

There will be 3 different pages in my application, namely HomePage, BookPage, and User Page.

In the **HOME PAGE**,

Users can add books by clicking the "Add Book Button". After then, there will be different alternatives that they can
add to book. Some of them are required but some of them not. For example, if book is a translation user should click
the "Yes" under "Is a Book Translation". Moreover, they can delete a book by clicking the trash symbol on the table,
will be opened after clicking the "Delete Book" button. In addition, Users can add user by clicking the "Add User
Button". After then, they should enter the username and password. If a user clicks the login button, user should enter
the right credentials. Lastly, Users can be deleted through the trash button on the table, which will be opened by
clicking the "Delete User" button.

In the **BOOK PAGE**,

Users will be able to see the Books in the table. The books have Book Name, Author(s), Translator, Editor, Cover,
Publisher, Genre, Published Year, Average Rating, and All Reviews. Cover are should include the image link. If a link is
broken they will see the "No Image Found" error. Reviews and Average Rating will be change as users rate or review a
book.

In the **USER PAGE**,

Users will be able to see their profile in the table. Table includes the Username, Number of Books Read, Favorite Books,
and Average Rating Reviews. In addition they see their actions with the related book table. They will see the all books.
They can add a rate, they can add reviews and they can favorite a book. Sometimes, a page should be reloaded to see the
differences.

**PRINTS:**

• 1-) a fiction book
 
    await collection_books.find({genre:{$exists: true}})

    0: {_id: ObjectId, name: 'Kitap7', author: 'yazar7',…}

    1: {_id: ObjectId, name: 'Kitap8', author: "yazar8'in annesi",…}

    2: {_id: ObjectId, name: 'kitap11', author: 'yazar11',…}

• a non-fiction book with multiple authors

    await collection_books.findOne({genre:{$exists: false}, author_2:{$exists: true}})
    {_id: ObjectId, name: 'Kitap2', translator: 'translator2', author: 'author2', author_2: 'author2_a', …}


• a translated book
    
    await collection_books.findOne({translator:{$exists: true}})
    {_id: ObjectId, name: 'Kitap2', translator: 'translator2', author: 'author2', author_2: 'author2_a', …}

• a book with an editor and multiple authors

    await collection_books.findOne({editor:{$exists: true}, author_2:{$exists: true}})
    {_id: ObjectId, name: 'Kitap2', translator: 'translator2', author: 'author2', author_2: 'author2_a', …}

• a regular user
    
    await collection_users.find()
    0: {_id: ObjectId, username: 'ahmet', password: '123', number_read: 6, favorite_books: Array(0), …}
    1: {_id: ObjectId, username: 'ali', password: '123', number_read: 6, favorite_books: Array(0), …}
    2: {_id: ObjectId, username: 'sueda', password: '123', number_read: 6, favorite_books: Array(0), …}
    3: {_id: ObjectId, username: 'mert', password: '123', number_read: 6, favorite_books: Array(0), …}
    4: {_id: ObjectId, username: 'merve', password: '123', number_read: 6, favorite_books: Array(0), …}
    5: {_id: ObjectId, username: 'gönül', password: '123', number_read: 6, favorite_books: Array(0), …}
• an author
    



const Book = require('../models/bookModel');
const Club = require('../models/clubModel');
const axios = require('axios');



module.exports.renderNewForm = async (req, res) => {
    const { id } = req.params;
    const club = await Club.findById(id);
    res.render('books/new', { club });
}

module.exports.new = async (req, res) => {
    const foundClub = await Club.findById(req.params.id);
    let { title } = req.body;
    const response = await axios.get(`http://openlibrary.org/search.json?q=${title}`);
    //initialize variables with default values;
    let author = "404";
    let coverImageCode = 8406786;
    //try to find data in the JSON response, look at first two books in the response and then resort to the default.
    if (response.data.docs[0].author_name) {
        author = response.data.docs[0].author_name[0]
    } else {
        author = response.data.docs[1].author_name[0]
    }
    if (response.data.docs[0].title) {
        title = response.data.docs[0].title
    } else {
        title = response.data.docs[1].title
    }
    if (response.data.docs[0].cover_i) {
        coverImageCode = response.data.docs[0].cover_i
    } else {
        coverImageCode = response.data.docs[1].cover_i;
    }
    //utilize the cover_i code to create image urls
    const imageUrlM = `https://covers.openlibrary.org/b/id/${coverImageCode}-M.jpg`;
    const imageUrlL = `https://covers.openlibrary.org/b/id/${coverImageCode}-L.jpg`;
    const book = new Book({title, author, imageUrlM, imageUrlL});
    foundClub.clubBooks.push(book);
    await book.save();
    await foundClub.save();
    console.log(foundClub._id)
    console.log(book._id)
    res.redirect(`/clubs/${foundClub._id}/books/${book._id}`);
}

module.exports.show = async (req, res) => {
    const { id, bookId } = req.params;
    const club = await Club.findById(id).populate('clubBooks');
    const book = await Book.findById(bookId).populate('reviews');
    let sum = 0;
    for (let i = 0; i < book.reviews.length; i++) {
        sum += book.reviews[i].rating;
    }
    let average = (sum / book.reviews.length).toFixed(1);
    res.render('books/show', { club, book, average });
}

module.exports.renderEditForm = async (req, res) => {
    const { id, bookId } = req.params;
    const club = await Club.findById(id).populate('clubBooks');
    const book = await Book.findById(bookId);
    res.render('books/edit', { club, book });
}

module.exports.edit = async (req, res) => {
    const { id, bookId } = req.params;
    await Book.findByIdAndUpdate(bookId, req.body);
    res.redirect(`/clubs/${id}/books/${bookId}`);
}

module.exports.delete = async (req, res) => {
    const { id, bookId } = req.params
    await Book.findByIdAndDelete(bookId);
    res.redirect(`/clubs/${id}`);
}
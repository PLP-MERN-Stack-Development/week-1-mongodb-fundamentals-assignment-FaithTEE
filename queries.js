// find all books

const {title} = require ("process")

db.books.find()

//find book vy by a specific author
db.books.find({author: "J.K. Rowling"})

// find books that are in stock
db.books.find({in_stock: true})

// count the number of books in stock
db.books.find({in_stock: true}).count()

// find books published between certain years

db.books.find({
    published_year: {
        $gte: 1939, // greater than or equal to 1939
        $lte: 1970  // less than or equal to 1970
    }
}).sort({published_year: 1}) // sort by published year in ascending order


// find the book with "The" in the title	
db.books.find({
    title: {
        $regex: "The", // regular expression to match "The" in the title	
        $options: "i" // case-insensitive search
    }
})

// update the price of a book
db.books.updateOne(
    { title: "The Great Gatsby" }, // filter to find the book
    { $set: { price: 17.99 } } // update the price to 12.99
)

// Advanced Query
// Aggregation: avarage price by genre with book count

db.books.aggregate([
    {$group: {
        _id: "$genre", 
        avaragePrice: {$avg: "$price"}, // calculate average price
        bookCount: {$sum: 1}, // count the number of books in each genre
        totalPages: {$sum: "$pages"} // sum of pages in each genre
    }
}],
    {$sort: {avaragePrice: 1}} // sort by average price in ascending order
)

// find author with multiple books and their details

db.books.aggregate([
    {
        $group: {
            _id: "$author",
            bookCount: {$sum: 1}, 
            books: {$push: "$title"}, 
            avgPrice: {$avg: "$price"}
        }
    },
    {$match: {bookCount: {$gt: 1}}}, 
    {$sort: {avgPrice: -1}} // sort by average price in descending order
])


// create text index for full-text search
db.books.createIndex({
    title: "text",
    author: "text",
    description: "text"
})

// perform a full-text search
db.books.find({
    $text: {$search: "brave dystopian"} 
}, {
    score: {$meta: "textScore"} // include text score in results
}).sort({score: {$meta: "textScore"}}) // sort by text score in descending order
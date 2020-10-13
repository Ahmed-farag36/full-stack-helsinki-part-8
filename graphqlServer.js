const { ApolloServer, gql, UserInputError } = require("apollo-server");
const { connect, Schema, model } = require("mongoose");

connect(
	"mongodb+srv://ahmedfarag:D2aD45f43T6BHSml@cluster0.h0r7q.mongodb.net/fs-helsinki?retryWrites=true&w=majority",
	{
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useNewUrlParser: true,
	}
)
	.then(() => {
		console.log("connected to DB");
	})
	.catch((err) => {
		console.log("failed to connect to DB", err);
	});

const authorSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		minlength: 4,
	},
	born: {
		type: Number,
	},
});

const bookSchema = new Schema({
	title: {
		type: String,
		required: true,
		minlength: 2,
	},
	published: {
		type: Number,
		required: true,
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: "Author",
	},
	genres: [
		{
			type: String,
			required: true,
		},
	],
});

const Author = model("Author", authorSchema);
const Book = model("Book", bookSchema);

const typeDefs = gql`
	type Author {
		id: ID!
		name: String!
		born: Int
		bookCount: Int
	}
	type Book {
		id: ID!
		title: String!
		author: Author!
		published: Int!
		genres: [String!]!
	}
	type Query {
		bookCount: Int!
		authorCount: Int!
		allBooks(author: String, genre: String): [Book]
		allAuthors: [Author]
	}
	type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book!
		editAuthor(name: String!, setBornTo: Int!): Author
	}
`;

const resolvers = {
	Author: {
		bookCount: (root) => {
			return Book.find({}, {});
		},
	},
	Query: {
		bookCount: () => Book.countDocuments(),
		authorCount: () => Author.countDocuments(),
		allBooks: (root, { author, genre }) => {
			if (!author && !genre) return Book.find();
			return books.filter((book) => {
				if (author && genre)
					return book.author === author && book.genres.includes(genre);
				if (author) return book.author === author;
				return book.genres.includes(genre);
			});
		},
		allAuthors: () => Author.find(),
	},
	Mutation: {
		addBook: (root, args) => {
			try {
				const author = Author.findOne({ name: args.author });
				return new Book({ ...args, author: author.id }).save();
			} catch (error) {
				throw new UserInputError(error, {
					invalidArgs: args,
				});
			}
		},
		editAuthor: (root, args) => {
			let authorToBeUpdated = authors.find(
				(author) => author.name === args.name
			);
			if (!authorToBeUpdated) return null;
			authorToBeUpdated = {
				...authorToBeUpdated,
				born: args.setBornTo,
			};
			authors = authors.map((author) =>
				author.name === authorToBeUpdated.name ? authorToBeUpdated : author
			);
			return authorToBeUpdated;
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`);
});

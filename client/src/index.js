import React from "react";
import ReactDOM from "react-dom";
import {
	InMemoryCache,
	ApolloClient,
	HttpLink,
	ApolloProvider,
} from "@apollo/client";

import App from "./App";

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		uri: "http://localhost:4000",
	}),
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById("root")
);
